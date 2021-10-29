import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/core";
import * as React from "react";
import {
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import Image from "src/components/atoms/Image";
import Message from "src/components/atoms/Message";
import ScreenLoader from "src/components/atoms/ScreenLoader";
import { P } from "src/components/atoms/Text";
import Margin, { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ImageGrid from "src/components/organisms/ImageGrid";
import { screens } from "src/dict";
import useFocusedEffect from "src/hooks/useFocusedEffect";
import { useGetAPI } from "src/hooks/useGetAPI";
import { useNavigation } from "src/hooks/useNavigation";
import { useLocation } from "src/provider/location";
import { BASE_PX, LARGE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

type CoordinateType = {
  id: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  timestamp: string;
};

type CoordinateWithImageUrl = Omit<CoordinateType, "imageUrls"> & {
  imageUrl: string;
};

const FifthScreen: React.FC<{ albumId: string }> = ({ albumId }) => {
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();
  const { stopLocationRecording } = useLocation();

  const [mapCorners, setMapCorners] = React.useState<{
    lat1: number;
    lat2: number;
    lon1: number;
    lon2: number;
  }>({ lat1: 30, lat2: 40, lon1: 130, lon2: 140 });

  const [imageSize, setImageSize] = React.useState<number>(50);

  const [openStatus, setOpenStatus] = React.useState<string>("initial");

  const [currentRegion, setCurrentRegion] = React.useState<any | null>({
    latitude: 35.1221702,
    longitude: 136.9599526,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const flatListRef = React.useRef<FlatList>(null);

  const markerRefs = React.useRef<{ [key: string]: Marker }>({});

  const mapRef = React.useRef<MapView>(null);

  const getBounds = (region: Region) => {
    setMapCorners({
      lon1: region.longitude - region.longitudeDelta / 2,
      lon2: region.longitude + region.longitudeDelta / 2,
      lat1: region.latitude - region.latitudeDelta / 2,
      lat2: region.latitude + region.latitudeDelta / 2,
    });

    setImageSize(Math.max(100, Math.min(30 / region.longitudeDelta, 300)));

    setCurrentRegion({
      ...currentRegion,
      longitudeDelta: region.longitudeDelta,
      latitudeDelta: region.latitudeDelta,
    });
  };

  const { data, loading } = useGetAPI("/album/detail", {
    // TODO: 実データに置き換える
    album_id: albumId,
    ...mapCorners,
  });

  console.log(data);

  const coordinates: CoordinateType[] = data?.location;

  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Padding left={4}>
          <AntDesign
            name="left"
            onPress={() => navigation.navigate(screens.CreateNewAlbumFirst)}
            size={24}
            color="#333"
          />
        </Padding>
      ),
    });
  }, []);

  useFocusedEffect(() => {
    stopLocationRecording();
  });

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
          markerRefs.current[index]?.showCallout();
          mapRef.current?.animateToRegion({
            ...currentRegion,
            longitude: item?.longitude,
            latitude: item?.latitude,
          });
          flatListRef.current?.scrollToIndex({ index: index });
        }}
        activeOpacity={0.7}
      >
        <Margin size={SMALL_PX} top={LARGE_PX}>
          <View style={{ ...globalStyles.shadow, shadowOpacity: 0.15 }}>
            <Image
              source={{ uri: item.imageUrls[0] }}
              height={windowDimensions.height * 0.2 - LARGE_PX}
              width={windowDimensions.height * 0.2 - LARGE_PX}
              style={globalStyles.rounodedImage}
            />
          </View>
        </Margin>
      </TouchableOpacity>
    ),
    [openStatus]
  );

  return (
    <View style={{ flex: 1.5 }}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: 37.1234,
          longitude: 137.1234,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        onRegionChange={(region) => {
          getBounds(region);
        }}
        style={{ flex: 1.0 }}
      >
        {coordinates?.map((c, index) => (
          <Marker
            coordinate={c}
            ref={(node) => {
              if (node) markerRefs.current[index] = node;
            }}
          >
            <View
              style={{
                height: imageSize / 2 - 15,
                width: imageSize / 2 - 15,
                borderRadius: 4,
                backgroundColor: "#36C1A7",
              }}
              onTouchStart={() => {
                flatListRef.current?.scrollToIndex({ index: index });
                mapRef.current?.animateToRegion({
                  ...currentRegion,
                  longitude: c?.longitude,
                  latitude: c?.latitude,
                });
              }}
            >
              <Image
                source={{ uri: c.imageUrls.first() }}
                width={imageSize / 2 - 25}
                height={imageSize / 2 - 25}
                style={{
                  borderRadius: 4,
                  top: 5,
                  left: 5,
                }}
              />
            </View>
            <View
              style={{
                width: 0,
                height: 0,
                alignSelf: "center",
                backgroundColor: "transparent",
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopWidth: 20,
                borderBottomWidth: 0,
                borderTopColor: "#36C1A7",
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                marginBottom: imageSize / 2 + 5,
              }}
              onTouchStart={() =>
                flatListRef.current?.scrollToIndex({ index: index })
              }
            />
          </Marker>
        ))}
        <Polyline coordinates={coordinates} strokeWidth={3} strokeColor="red" />
      </MapView>
      {loading && <ScreenLoader />}
      <Modalize
        alwaysOpen={windowDimensions.height * 0.25}
        modalHeight={windowDimensions.height * 0.75}
        onPositionChange={(args) => setOpenStatus(args)}
        handlePosition="inside"
        rootStyle={{
          marginBottom: -20,
        }}
        modalStyle={[globalStyles.shadow]}
      >
        {coordinates?.length === 0 && (
          <Space
            vertical
            align="center"
            size={BASE_PX}
            style={{
              marginTop: (windowDimensions.height * 0.25) / 2 - 20 + BASE_PX,
            }}
          >
            <P
              gray
              style={{
                fontSize: 20,
              }}
            >
              周辺に写真がありません
            </P>
          </Space>
        )}

        {openStatus === "initial" ? (
          <FlatList
            data={coordinates}
            ref={flatListRef}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ImageGrid
            data={coordinates
              .map(({ imageUrls, ...c }) => ({
                ...c,
                imageUrl: imageUrls.first(),
              }))
              .filter<CoordinateWithImageUrl>(
                (c): c is CoordinateWithImageUrl => !!c.imageUrl
              )}
            extractImageUri={(item) => item.imageUrl}
            renderImage={({ item }) => (
              <Margin size={SMALL_PX} top={LARGE_PX}>
                <View style={{ ...globalStyles.shadow, shadowOpacity: 0.15 }}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    width={windowDimensions.width / 3 - SMALL_PX * 2}
                    height={windowDimensions.width / 3 - SMALL_PX * 2}
                    style={globalStyles.rounodedImage}
                  />
                </View>
              </Margin>
            )}
            flatListProps={{
              scrollEnabled: false,
              numColumns: 3,
            }}
          />
        )}
      </Modalize>
    </View>
  );
};

export default () => {
  const route = useRoute();
  const albumId: string = (route.params as any)?.albumId;

  if (!albumId) return <Message message="アルバムの取得に失敗しました" />;

  return <FifthScreen albumId={albumId} />;
};
