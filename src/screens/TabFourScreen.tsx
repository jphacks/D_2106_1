import * as React from "react";
import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

export default function TabFourScreen() {
  const startTrackingLocation = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 5000,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Four</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <Button
        title="位置情報をバックグラウンドトラック開始"
        onPress={startTrackingLocation}
      />
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    alert(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = (data as any) ?? {};
    alert(JSON.stringify(locations)); //will show you the location object
    //lat is locations[0].coords.latitude & long is locations[0].coords.longitude
    // do something with the locations captured in the background, possibly post to your server with axios or fetch API
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
