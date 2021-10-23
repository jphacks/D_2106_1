import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FETCH_LOCATION = "FETCH_LOCATION";
const TIME_INTERVAL = 10000;
const ASYNC_STORAGE_KEY = "LOCATION_RECORDS";

const useBackgroundLocation = () => {
  const [status, setStatus] =
    useState<Location.LocationPermissionResponse | null>(null);
  const requirePermission = useCallback(
    async () => setStatus(await Location.requestBackgroundPermissionsAsync()),
    []
  );
  const startLocationRecording = useCallback(async () => {
    await Location.startLocationUpdatesAsync(FETCH_LOCATION, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: TIME_INTERVAL,
    });
  }, []);
  const stopLocationRecording = useCallback(async () => {
    await Location.stopLocationUpdatesAsync(FETCH_LOCATION);
  }, []);

  return {
    status,
    requirePermission,
    startLocationRecording,
    stopLocationRecording,
  };
};

TaskManager.defineTask(FETCH_LOCATION, async ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const prevLocationsStr = await AsyncStorage.getItem(ASYNC_STORAGE_KEY);
    const prevLocations = prevLocationsStr ? JSON.parse(prevLocationsStr) : [];

    const locations = (data as any).locations.map((l: any) => ({
      coordinate: {
        latitude: l.coords.latitude,
        longitude: l.coords.longitude,
        timestamp: l.timestamp,
      },
    }));

    AsyncStorage.setItem(
      ASYNC_STORAGE_KEY,
      JSON.stringify([...prevLocations, ...locations])
    );

    console.log("location", JSON.stringify(locations));

    // do something with the locations captured in the background
  }
});

export default useBackgroundLocation;
