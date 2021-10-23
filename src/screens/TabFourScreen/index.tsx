import * as React from "react";
import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "src/components/EditScreenInfo";
import { Text, View } from "src/components/Themed";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import TaskManagerButton from "./TaskManagerButton";

const LOCATION_TASK_NAME = "background-location-task";

export default function TabFourScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Four</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <TaskManagerButton />
    </View>
  );
}

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
