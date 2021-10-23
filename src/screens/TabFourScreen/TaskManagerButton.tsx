import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

const requestPermissions = async () => {
  const { status: fgStatus } =
    await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } =
    await Location.requestBackgroundPermissionsAsync();

  console.log("status", fgStatus, bgStatus);

  if (fgStatus === "granted" && bgStatus === "granted") {
    console.log("startLocationUpdatesAsync");
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 1000,
    });
  }
};

const TaskManagerButton = () => (
  <TouchableOpacity onPress={requestPermissions}>
    <Text>Enable background location</Text>
  </TouchableOpacity>
);

export default TaskManagerButton;
