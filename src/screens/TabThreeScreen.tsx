import * as React from "react";
import { View } from "../components/Themed";
import MapView from "react-native-maps";

export default function TabThreeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        initialRegion={{
          latitude: 35.1221702,
          longitude: 136.9599526,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
        style={{ flex: 1.0 }}
      ></MapView>
    </View>
  );
}
