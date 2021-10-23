import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

const requestPermissions = async () => {
  // const { status: fgStatus } =
  //   await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();

  console.log("status", bgStatus);

  if (bgStatus === "granted") {
    console.log("startLocationUpdatesAsync");
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 100,
    });
  }
};

const TaskManagerButton = () => (
  <TouchableOpacity onPress={requestPermissions}>
    <Text>Enable background location</Text>
  </TouchableOpacity>
);

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data as any;
    console.log("location", JSON.stringify(locations));
    // do something with the locations captured in the background
  }
});

export default TaskManagerButton;
