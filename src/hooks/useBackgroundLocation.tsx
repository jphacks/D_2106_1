import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { check, PERMISSIONS } from "react-native-permissions";
import useFocusedEffect from "./useFocusedEffect";
import useInterval from "./useInterval";

const FETCH_LOCATION = "FETCH_LOCATION";
const TIME_INTERVAL = 1000;
export const LOCATION_RECORDS = "LOCATION_RECORDS";
export const RECORDING_BEGIN_TIME = "RECORDING_BEGIN_TIME";

export type LocationData = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  timestamp: moment.Moment;
};

const useBackgroundLocation = () => {
  const [status, setStatus] =
    useState<Location.LocationPermissionResponse | null>(null);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [hasStartedRecording, setHasStartedRecording] = useState<
    boolean | null
  >(null);

  const requirePermission = useCallback(
    async () => setStatus(await Location.requestBackgroundPermissionsAsync()),
    []
  );
  const startLocationRecording = useCallback(
    async (beginTime: number = moment().unix() * 1000) => {
      await AsyncStorage.setItem(RECORDING_BEGIN_TIME, String(beginTime));
      await AsyncStorage.setItem(LOCATION_RECORDS, JSON.stringify([]));
      await Location.startLocationUpdatesAsync(FETCH_LOCATION, {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: TIME_INTERVAL,
      });
      setHasStartedRecording(true);
    },
    []
  );
  const stopLocationRecording = useCallback(async () => {
    await Location.stopLocationUpdatesAsync(FETCH_LOCATION);
    setHasStartedRecording(false);
  }, []);

  useInterval(() => {
    const fn = async () => {
      const locsStr = await AsyncStorage.getItem(LOCATION_RECORDS);
      const locs = locsStr ? JSON.parse(locsStr) : [];
      setLocations(
        locs.map((l: any) => ({ ...l, timestamp: moment(l.timestamp) }))
      );
    };
    fn();
  }, TIME_INTERVAL);
  useEffect(() => {
    const fn = async () => {
      setStatus(await Location.getBackgroundPermissionsAsync());
      console.log(await check(PERMISSIONS.IOS.LOCATION_ALWAYS));
    };
    fn();
  }, []);
  useFocusedEffect(() => {
    const fn = async () => {
      setHasStartedRecording(null);
      setHasStartedRecording(
        await Location.hasStartedLocationUpdatesAsync(FETCH_LOCATION)
      );
    };
    fn();
  });

  // TODO: iOSの設定で Always になっているかをちゃんとチェックしたい
  // react-native-permissions で権限のチェックだけ行いたい

  return {
    locations,
    status,
    hasStartedRecording,
    checkingIfStartedRecording: hasStartedRecording === null,
    isPermissionOk: !!status?.granted,
    requirePermission,
    startLocationRecording,
    stopLocationRecording,
  };
};

TaskManager.defineTask(FETCH_LOCATION, async ({ data, error }) => {
  console.log("location collected");
  if (error) return console.log("FETCH_LOCATION error:", error);
  if (data) {
    const prevLocationsStr = await AsyncStorage.getItem(LOCATION_RECORDS);
    const prevLocations = prevLocationsStr ? JSON.parse(prevLocationsStr) : [];

    const locations: LocationData[] = (data as any).locations.map(
      positionToLocation
    );

    AsyncStorage.setItem(
      LOCATION_RECORDS,
      JSON.stringify([...prevLocations, ...locations])
    );
  }
});

export const positionToLocation = (l: any) => ({
  coordinate: {
    latitude: l.coords.latitude,
    longitude: l.coords.longitude,
  },
  timestamp: l.timestamp,
});

export default useBackgroundLocation;
