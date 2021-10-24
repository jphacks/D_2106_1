import * as React from "react";
import { useWindowDimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { View } from "../components/Themed";

export default function TabThreeScreen() {
  const windowDimensions = useWindowDimensions();

  // TODO: 実データに置き換える
  const coordinates = [
    {
      id: "gpsId1",
      imageUrls: ["https://"],
      latitude: 35.1221702,
      longitude: 136.9682402,
      timestamp: "2021-10-05T12:34:56.123456+00:00",
    },
    {
      id: "gpsId2",
      imageUrls: ["https://"],
      latitude: 35.1221702,
      longitude: 136.9115014,
      timestamp: "2021-10-05T12:34:56.123456+00:00",
    },
    {
      id: "gpsId4",
      imageUrls: ["https://"],
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
        style={{ flex: 1.0 }}
      >
        {coordinates.map((c) => (
          <Marker coordinate={c} />
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
