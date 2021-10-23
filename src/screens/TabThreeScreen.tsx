import * as React from "react";
import { View } from "../components/Themed";
import MapView from "react-native-maps";
import { Modalize } from "react-native-modalize";
import { useWindowDimensions } from "react-native";

export default function TabThreeScreen() {
  const windowDimensions = useWindowDimensions();

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
      ></MapView>
      <Modalize
        alwaysOpen={windowDimensions.height * 0.25}
        modalHeight={windowDimensions.height * 0.75}
      ></Modalize>
    </View>
  );
}
