import { AntDesign } from "@expo/vector-icons";
import { useNavigationContainerRef, useRoute } from "@react-navigation/core";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
import PostedCard from "src/components/atoms/PostedCard";
import Margin, { Padding } from "src/components/layouts/Margin";
import ImageGrid from "src/components/organisms/ImageGrid";
import { screens } from "src/dict";
import useFocusedEffect from "src/hooks/useFocusedEffect";
import { useGetAPI } from "src/hooks/useGetAPI";
import { useNavigation } from "src/hooks/useNavigation";
import { useValueContext, ValueProvider } from "src/hooks/useValueContext";
import { useLocation } from "src/provider/location";
import { LARGE_PX, SMALL_PX } from "src/utils/space";
import { globalStyles } from "src/utils/style";

type CoordinateType = {
  id: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  timestamp: string;
};

type ParamList = {
  Albums: undefined;
  ImageFlatList: undefined;
};

type CoordinateWithImageUrl = Omit<CoordinateType, "imageUrls"> & {
  imageUrl: string;
};

type GlobalValues = {
  openStatus: string;
  coordinates: CoordinateType[];
  flatListRef: React.RefObject<FlatList<any>>;
  renderItem: any;
  markerRefs: React.MutableRefObject<{
    [key: string]: Marker;
  }>;
  mapRef: React.RefObject<MapView>;
  currentRegion: any;
  albums: Album[];
  setCurrentAlbum: any;
};

type Album = {
  Id: number;
  UserId: string;
  Title: string;
  StartedAt: string;
  EndedAt: string;
  IsPublic: boolean;
  ThumbnailImageId: number;
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

  const [currentAlbum, setCurrentAlbum] = React.useState<number>();

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

  const { data } = useGetAPI("/albums");

  const { data: data2 } = useGetAPI("/album/detail", {
    album_id: currentAlbum,
    ...mapCorners,
  });

  const albums: Album[] = data;

  const coordinates: CoordinateType[] = data2?.location;

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

  const navigationRef = useNavigationContainerRef<ParamList>();

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
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

  const Stack = createStackNavigator<ParamList>();

  const globalValues: GlobalValues = {
    openStatus,
    coordinates,
    flatListRef,
    renderItem,
    markerRefs,
    mapRef,
    currentRegion,
    albums,
    setCurrentAlbum,
  };

  return (
    <ValueProvider values={globalValues}>
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
                  navigationRef?.navigate("ImageFlatList");
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
                onTouchStart={() => {
                  flatListRef.current?.scrollToIndex({ index: index });
                  navigation.navigate("Albums");
                }}
              />
            </Marker>
          ))}
          <Polyline
            coordinates={coordinates}
            strokeWidth={3}
            strokeColor="red"
          />
        </MapView>
        <Modalize
          alwaysOpen={windowDimensions.height * 0.35 + SMALL_PX * 2 - LARGE_PX}
          modalHeight={windowDimensions.height * 0.75}
          onPositionChange={(args) => setOpenStatus(args)}
          handlePosition="inside"
          rootStyle={{
            marginBottom: -20,
          }}
          modalStyle={[globalStyles.shadow]}
        >
          <NavigationContainer independent={true} ref={navigationRef}>
            <Padding top={LARGE_PX}>
              <View
                style={{
                  width: windowDimensions.width,
                  height:
                    openStatus === "initial"
                      ? windowDimensions.height * 0.35 + SMALL_PX * 2
                      : windowDimensions.height * 0.75,
                }}
              >
                <Stack.Navigator
                  screenOptions={{
                    headerLeft: ({ canGoBack, onPress }) =>
                      canGoBack && (
                        <>
                          <TouchableOpacity onPress={onPress}>
                            <Padding left={4}>
                              <AntDesign
                                name="left"
                                onPress={onPress}
                                size={24}
                                color="#333"
                              />
                            </Padding>
                          </TouchableOpacity>
                        </>
                      ),
                    headerTitle: () => <></>,
                  }}
                >
                  <Stack.Screen name="Albums" component={Albums} />
                  <Stack.Screen
                    name="ImageFlatList"
                    component={ImageFlatList}
                  />
                </Stack.Navigator>
              </View>
            </Padding>
          </NavigationContainer>
        </Modalize>
      </View>
    </ValueProvider>
  );
};

const ImageFlatList: React.FC = () => {
  const windowDimensions = useWindowDimensions();
  const globalValues = useValueContext<GlobalValues>();
  if (globalValues === null) return null;

  const { openStatus, coordinates, flatListRef, renderItem } = globalValues;
  return (
    <>
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
            ?.map(({ imageUrls, ...c }) => ({
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
    </>
  );
};

const Albums: React.FC = () => {
  const windowDimensions = useWindowDimensions();
  const navigation = useNavigation();
  const globalValues = useValueContext<GlobalValues>();
  if (globalValues === null) return null;

  const {
    openStatus,
    flatListRef,
    markerRefs,
    mapRef,
    currentRegion,
    albums,
    setCurrentAlbum,
  } = globalValues;

  const renderItem2 = React.useCallback(
    ({ item, index }) => (
      <Margin size={SMALL_PX}>
        <View style={{ ...globalStyles.shadow, shadowOpacity: 0.15 }}>
          <PostedCard
            title={item.Title}
            imageUrl={
              // TODO: thumbnailImageId から取得する
              "https://www.nagoyajo.city.nagoya.jp/images/content/guide/tenshu/index_img01.jpg"
            }
            createdAt={[]}
            timestamp={item.EndedAt}
            width={
              openStatus === "top"
                ? windowDimensions.width - SMALL_PX * 2
                : windowDimensions.width * 0.6
            }
            height={
              openStatus === "top"
                ? windowDimensions.height * 0.2
                : windowDimensions.height * 0.15
            }
            onPress={() => {
              flatListRef?.current?.scrollToIndex({ index: index });
              navigation.navigate("ImageFlatList");
              setCurrentAlbum(item.Id);
            }}
          />
        </View>
      </Margin>
    ),
    [openStatus]
  );
  return (
    <>
      <Margin bottom={LARGE_PX}>
        <FlatList
          data={albums}
          ref={flatListRef}
          renderItem={renderItem2}
          keyExtractor={(item) => item.id}
          horizontal={openStatus === "initial"}
          showsHorizontalScrollIndicator={false}
        />
      </Margin>
    </>
  );
};

export default () => {
  const route = useRoute();
  const albumId: string = (route.params as any)?.albumId ?? 2;

  if (!albumId) return <Message message="アルバムの取得に失敗しました" />;

  return <FifthScreen albumId={albumId} />;
};
