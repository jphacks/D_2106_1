import { AntDesign } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/core";
import * as React from "react";
import { FlatList, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import MapPing from "src/components/atoms/MapPing";
import Message from "src/components/atoms/Message";
import { Padding } from "src/components/layouts/Margin";
import DynamicModalizeContainer, {
  ImageList,
} from "src/components/organisms/DynamicModalize";
import { screens } from "src/dict";
import useFocusedEffect from "src/hooks/useFocusedEffect";
import { useGetAPI } from "src/hooks/useGetAPI";
import { useNavigation } from "src/hooks/useNavigation";
import { useLocation } from "src/provider/location";

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
  const { stopLocationRecording } = useLocation();

  const [mapCorners, setMapCorners] = React.useState<{
    lat1: number;
    lat2: number;
    lon1: number;
    lon2: number;
  }>({ lat1: 30, lat2: 40, lon1: 130, lon2: 140 });

  const [imageSize, setImageSize] = React.useState<number>(50);
  const [currentRegion, setCurrentRegion] = React.useState<any | null>({
    latitude: 37.331,
    longitude: -122.0399526,
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

  const coordinates: CoordinateType[] = data?.location;
  const routes: CoordinateType[] = data?.route;

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

  const onPressMapPin = (c: CoordinateType, index: number) => {
    flatListRef.current?.scrollToIndex({ index: index });
    mapRef.current?.animateToRegion({
      ...currentRegion,
      longitude: c?.longitude,
      latitude: c?.latitude - currentRegion.latitudeDelta * 0.125,
    });
  };

  return (
    <View style={{ flex: 1.5 }}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: 37.331,
          longitude: -122.0399526,
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
            <MapPing
              onPress={() => onPressMapPin(c, index)}
              uri={c.imageUrls.first()}
              imageSize={imageSize / 2 - 25}
            />
          </Marker>
        ))}
        <Polyline coordinates={routes} strokeWidth={4} strokeColor="#A7894B" />
      </MapView>

      <DynamicModalizeContainer loading={loading}>
        <ImageList
          data={coordinates
            ?.map(({ imageUrls, ...c }) => ({
              ...c,
              imageUrl: imageUrls.first(),
            }))
            .filter<CoordinateWithImageUrl>(
              (c): c is CoordinateWithImageUrl => !!c.imageUrl
            )}
          previewFlatListRef={flatListRef}
          onPressItem={({ item, index }) => {
            markerRefs.current[index]?.showCallout();
            mapRef.current?.animateToRegion({
              ...currentRegion,
              longitude: item?.longitude,
              latitude: item?.latitude - currentRegion.latitudeDelta * 0.125,
            });
            flatListRef.current?.scrollToIndex({ index: index });
          }}
          extractImageUri={(item) => item.imageUrl}
          keyExtractor={(item) => item.id}
          style={{ marginTop: 24 }}
        />
      </DynamicModalizeContainer>
    </View>
  );
};

export default () => {
  const route = useRoute();
  const albumId: string = (route.params as any)?.albumId;

  if (!albumId) return <Message message="アルバムの取得に失敗しました" />;

  return <FifthScreen albumId={albumId} />;
};
