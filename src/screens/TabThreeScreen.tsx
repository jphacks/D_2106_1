import * as React from "react";
import { View } from "../components/Themed";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { Image, useWindowDimensions } from "react-native";
import { useGetAPI } from "src/hooks/useGetAPI";

type CoordinateType = {
  id: string;
  imageUrls: string[];
  latitude: number;
  longitude: number;
  timestamp: string;
};

export default function TabThreeScreen() {
  const windowDimensions = useWindowDimensions();

  const [mapCorners, setMapCorners] = React.useState<{
    lat1: number;
    lat2: number;
    lon1: number;
    lon2: number;
  }>({ lat1: 45, lat2: 46, lon1: 135, lon2: 136 });

  const [imageSize, setImageSize] = React.useState<number>(50);

  const getBounds = (region: Region) => {
    setMapCorners({
      lat1: region.longitude - region.longitudeDelta / 2,
      lat2: region.longitude + region.longitudeDelta / 2,
      lon1: region.latitude - region.latitudeDelta / 2,
      lon2: region.latitude + region.latitudeDelta / 2,
    });
    setImageSize(
      Math.max(50, Math.min((20 / region.longitudeDelta) * 0.7, 100))
    );
  };

  const { data } = useGetAPI("/album/detail", {
    // TODO: 実データに置き換える
    album_id: "album_id",
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

  return (
    <View style={{ flex: 1.5 }}>
      <MapView
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
        {coordinates.map((c) => (
          <Marker coordinate={c}>
            <View
              style={{
                top: -35 - (imageSize - 50) / 2,
                height: imageSize + 10,
                width: imageSize + 10,
                // alignSelf: "center",
                // justifyContent: "center",
                borderRadius: 4,
                backgroundColor: "#36C1A7",
              }}
            >
              <Image
                resizeMode="cover"
                source={{
                  uri: c.imageUrls[0],
                  height: imageSize,
                  width: imageSize,
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
                top: -35 - (imageSize - 50) / 2,
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
              }}
            />
          </Marker>
        ))}
        <Polyline coordinates={coordinates} strokeWidth={3} strokeColor="red" />
      </MapView>
      <Modalize
        alwaysOpen={windowDimensions.height * 0.25}
        modalHeight={windowDimensions.height * 0.75}
      ></Modalize>
    </View>
  );
}
