import { Card } from "@ui-kitten/components";
import * as React from "react";
import { FlatList, Image, useWindowDimensions, View } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { AntDesign } from "@expo/vector-icons";
import { useGetAPI } from "src/hooks/useGetAPI";
import { useNavigation } from "src/hooks/useNavigation";
import { Padding } from "src/components/layouts/Margin";
import { screens } from "src/dict";

type CoordinateType = {
  id: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  timestamp: string;
};

export default function FifthScreen(albumId: string) {
  const navigation = useNavigation();
  const windowDimensions = useWindowDimensions();

  const [mapCorners, setMapCorners] = React.useState<{
    lat1: number;
    lat2: number;
    lon1: number;
    lon2: number;
  }>({ lat1: 45, lat2: 46, lon1: 135, lon2: 136 });

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
      lat1: region.longitude - region.longitudeDelta / 2,
      lat2: region.longitude + region.longitudeDelta / 2,
      lon1: region.latitude - region.latitudeDelta / 2,
      lon2: region.latitude + region.latitudeDelta / 2,
    });

    setImageSize(Math.max(100, Math.min(30 / region.longitudeDelta, 200)));

    setCurrentRegion({
      ...currentRegion,
      longitudeDelta: region.longitudeDelta,
      latitudeDelta: region.latitudeDelta,
    });
  };

  const { data } = useGetAPI("/album/detail", {
    // TODO: 実データに置き換える
    album_id: albumId,
    ...mapCorners,
  });

  // TODO: 実データに置き換える
  // const coordinates = data?.locations;
  const coordinates: CoordinateType[] = [
    {
      id: "gpsId1",
      imageUrls: [
        "https://www.nagoyajo.city.nagoya.jp/images/content/guide/tenshu/index_img01.jpg",
      ],
      latitude: 35.1221702,
      longitude: 136.9682402,
      timestamp: "2021-10-05T12:34:56.123456+00:00",
    },
    {
      id: "gpsId2",
      imageUrls: [
        "https://www.nagoyajo.city.nagoya.jp/images/content/guide/tenshu/index_img01.jpg",
      ],
      latitude: 35.1221702,
      longitude: 136.9115014,
      timestamp: "2021-10-05T12:34:56.123456+00:00",
    },
    {
      id: "gpsId3",
      imageUrls: [
        "https://www.nagoyajo.city.nagoya.jp/images/content/guide/tenshu/index_img01.jpg",
      ],
      latitude: 35.1159824,
      longitude: 136.9797153,
      timestamp: "2021-10-05T12:34:56.123456+00:00",
    },
  ];

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

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <Card
        onPress={() => {
          markerRefs.current[index]?.showCallout();
          mapRef.current?.animateToRegion({
            ...currentRegion,
            longitude: item?.longitude,
            latitude: item?.latitude,
          });
        }}
      >
        <Image
          resizeMode="cover"
          source={{
            uri: item.imageUrls[0] ?? "",
            height: 100,
            width: 150,
          }}
        />
      </Card>
    ),
    []
  );

  return (
    <View style={{ flex: 1.5 }}>
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: 35.1221702,
          longitude: 136.9599526,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        onRegionChange={(region) => {
          getBounds(region);
        }}
        style={{ flex: 1.0 }}
      >
        {coordinates.map((c, index) => (
          <Marker
            coordinate={c}
            ref={(node) => {
              if (node) markerRefs.current[index] = node;
            }}
          >
            <View
              style={{
                height: (imageSize + 10) / 2 - 20,
                width: (imageSize + 10) / 2,
                borderRadius: 4,
                backgroundColor: "#36C1A7",
              }}
              onTouchStart={() => {
                flatListRef.current?.scrollToIndex({ index: index });
                mapRef.current?.animateToCoordinate({
                  ...currentRegion,
                  longitude: c?.longitude,
                  latitude: c?.latitude,
                });
              }}
            >
              <Image
                resizeMode="cover"
                source={{
                  uri: c.imageUrls[0],
                  height: imageSize / 2 - 25,
                  width: imageSize / 2 - 5,
                }}
                style={{
                  borderRadius: 4,
                  position: "relative",
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
      <Modalize
        alwaysOpen={windowDimensions.height * 0.25}
        modalHeight={windowDimensions.height * 0.75}
        onPositionChange={(args) => setOpenStatus(args)}
        handlePosition="inside"
      >
        <FlatList
          data={coordinates}
          ref={flatListRef}
          renderItem={renderItem}
          horizontal={openStatus === "initial"}
        />
      </Modalize>
    </View>
  );
}