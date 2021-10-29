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
import MapPing from "src/components/atoms/MapPing";
import Message from "src/components/atoms/Message";
import { Padding } from "src/components/layouts/Margin";
import DynamicModalizeContainer, {
  AlbumList,
  ImageList,
  useDynamicModalizeState,
} from "src/components/organisms/DynamicModalize";
import useFocusedEffect from "src/hooks/useFocusedEffect";
import { useGetAPI } from "src/hooks/useGetAPI";
import { useNavigation } from "src/hooks/useNavigation";
import { useValueContext, ValueProvider } from "src/hooks/useValueContext";
import { useLocation } from "src/provider/location";
import { BASE_PX, SMALL_PX } from "src/utils/space";

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
  markerRefs: React.MutableRefObject<{
    [key: string]: Marker;
  }>;
  mapRef: React.RefObject<MapView>;
  currentRegion: any;
  albums: Album[];
  setCurrentAlbum: any;
};

type Album = {
  id: number;
  userId: string;
  title: string;
  startedAt: number;
  endedAt: number;
  isPublic: boolean;
  thumbnailImageId: number;
};

const FifthScreen: React.FC<{ albumId: string }> = ({ albumId }) => {
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();
  const [modalHeight, setModalHeight] = React.useState(windowDimensions.height);

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

    setImageSize(Math.max(40, Math.min(15 / region.longitudeDelta, 120)));

    setCurrentRegion({
      ...currentRegion,
      longitudeDelta: region.longitudeDelta,
      latitudeDelta: region.latitudeDelta,
    });
  };

  const { data } = useGetAPI<{ albums: Album[] }>("/albums");
  const { data: data2 } = useGetAPI("/album/detail", {
    album_id: currentAlbum,
    ...mapCorners,
  });


  const { albums } = data ?? {};

  const coordinates: CoordinateType[] = data2?.location;

  useFocusedEffect(() => {
    stopLocationRecording();
  });

  const navigationRef = useNavigationContainerRef<ParamList>();

  const Stack = createStackNavigator<ParamList>();

  const globalValues: GlobalValues = {
    openStatus,
    coordinates,
    flatListRef,
    markerRefs,
    mapRef,
    currentRegion,
    albums: albums ?? [],
    setCurrentAlbum,
  };

  const onPressMapPin = (c: CoordinateType, index: number) => {
    flatListRef.current?.scrollToIndex({ index: index });
    mapRef.current?.animateToRegion({
      ...currentRegion,
      longitude: c?.longitude,
      latitude: c?.latitude,
    });
    navigationRef?.navigate("ImageFlatList");
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
              <MapPing
                onPress={() => onPressMapPin(c, index)}
                uri={c.imageUrls.first()}
                imageSize={imageSize}
              />
            </Marker>
          ))}
          <Polyline
            coordinates={coordinates}
            strokeWidth={3}
            strokeColor="#ee82ee"
          />
        </MapView>
        <DynamicModalizeContainer
          onLayout={({ layout: { height } }) => setModalHeight(height)}
          scrollViewProps={{ scrollEnabled: false }}
        >
          <NavigationContainer independent={true} ref={navigationRef}>
            <Stack.Navigator
              screenOptions={{
                headerLeft: ({ canGoBack, onPress }) =>
                  canGoBack && (
                    <TouchableOpacity onPress={onPress}>
                      <Padding size={SMALL_PX}>
                        <AntDesign
                          name="left"
                          onPress={onPress}
                          size={24}
                          color="#333"
                        />
                      </Padding>
                    </TouchableOpacity>
                  ),
                headerTitle: () => null,
                headerStyle: { height: 40, backgroundColor: "transparent" },
              }}
            >
              <Stack.Screen name="Albums" component={Albums} />
              <Stack.Screen name="ImageFlatList" component={AlbumDetail} />
            </Stack.Navigator>
          </NavigationContainer>
        </DynamicModalizeContainer>
      </View>
    </ValueProvider>
  );
};

const Albums: React.FC = () => {
  const navigation = useNavigation();
  const globalValues = useValueContext<GlobalValues>();
  if (globalValues === null) return null;
  const { albums, setCurrentAlbum, flatListRef } = globalValues;
  return (
    <AlbumList
      data={albums.map((a) => ({
        ...a,
        title: a.title,
        locations: ["愛知県", "名古屋市"],
        timestamp: a.endedAt,
        imageUrl: "https://picsum.photos/700",
      }))}
      previewFlatListRef={flatListRef}
      onPressItem={({ item, index }) => {
        flatListRef?.current?.scrollToIndex({ index: index });
        navigation.navigate("ImageFlatList");
        // setCurrentAlbum(item.Id);
        setCurrentAlbum(1);
      }}
      keyExtractor={(item) => item.Id}
    />
  );
};

const AlbumDetail: React.FC = () => {
  const globalValues = useValueContext<GlobalValues>();
  const dynamicModalizeState = useDynamicModalizeState();
  if (globalValues === null) return null;
  const { currentRegion, mapRef, coordinates, flatListRef } = globalValues;
  const { contentHeight } = dynamicModalizeState;
  return (
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
        mapRef.current?.animateToRegion({
          ...currentRegion,
          longitude: item?.longitude,
          latitude: item?.latitude - currentRegion.latitudeDelta * 0.125,
        });
        flatListRef.current?.scrollToIndex({ index: index });
      }}
      extractImageUri={(item) => item.imageUrl}
      keyExtractor={(item) => item.id}
      previewSize={contentHeight - 60}
    />
  );
};

export default () => {
  const route = useRoute();
  const albumId: string = (route.params as any)?.albumId ?? 2;

  if (!albumId) return <Message message="アルバムの取得に失敗しました" />;

  return <FifthScreen albumId={albumId} />;
};
