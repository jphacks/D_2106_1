import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PermissionGuide from "src/components/organisms/PermissionGuide";
import useInterval from "src/hooks/useInterval";
import useIsLocationAlways from "src/hooks/useIsLocationAlways";
import { emptyAsyncFn } from "src/utils";

const TIME_INTERVAL = 1000;
export const FETCH_LOCATION = "FETCH_LOCATION";
export const LOCATION_RECORDS = "LOCATION_RECORDS";
export const RECORDING_BEGIN_TIME = "RECORDING_BEGIN_TIME";

export type LocationData = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  timestamp: moment.Moment;
};

export type LocationContext = {
  locations: LocationData[];
  status: Location.LocationPermissionResponse | null;
  hasStartedRecording: boolean | null;
  checkingIfStartedRecording: boolean;
  isPermissionOk: boolean;
  requirePermission: () => Promise<void>;
  startLocationRecording: (beginTime?: number) => Promise<void>;
  stopLocationRecording: () => Promise<void>;
  recheckAll: () => Promise<{
    status: Location.LocationPermissionResponse | null;
    isAlways: boolean;
    hasStartedRecording: boolean;
  }>;
};

const defaultLocationContext: LocationContext = {
  locations: [],
  status: null,
  hasStartedRecording: false,
  checkingIfStartedRecording: false,
  isPermissionOk: false,
  requirePermission: emptyAsyncFn,
  startLocationRecording: emptyAsyncFn,
  stopLocationRecording: emptyAsyncFn,
  recheckAll: async () => ({
    status: null,
    isAlways: false,
    hasStartedRecording: false,
  }),
};

export const locationContext = React.createContext<LocationContext>(
  defaultLocationContext
);
export const useLocation = () => useContext(locationContext);

const LocationProvider: React.FC = React.memo(({ children }) => {
  const [status, setStatus] =
    useState<Location.LocationPermissionResponse | null>(null);
  const [isAlways, setIsAlways] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [hasStartedRecording, setHasStartedRecording] = useState<
    boolean | null
  >(null);
  const checkIsLocationAlways = useIsLocationAlways();
  const isPermissionOk = !!status?.granted && isAlways;

  const [permissionGuideVisible, setPermissionGuideVisible] = useState(false);

  const requirePermission = useCallback(async () => {
    setStatus(await Location.requestBackgroundPermissionsAsync());
  }, []);
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

  // 権限等をチェックするタイミング
  // 1. useBackgroundLocation() が呼ばれた初回
  // 2. アプリがバックグラウンドから戻ってきた時
  // 3. スクリーンを遷移したタイミング（各スクリーンで処理）
  const recheckAll = async () => {
    setHasStartedRecording(null);
    const nextStatus = await Location.getBackgroundPermissionsAsync();
    const nextIsAlways = await checkIsLocationAlways();
    const nextHasStartedRecording =
      await Location.hasStartedLocationUpdatesAsync(FETCH_LOCATION);
    setStatus(nextStatus);
    setIsAlways(nextIsAlways);
    setHasStartedRecording(nextHasStartedRecording);
    return {
      status: nextStatus,
      isAlways: nextIsAlways,
      hasStartedRecording: nextHasStartedRecording,
    };
  };
  useEffect(() => {
    recheckAll();
  }, []);
  useEffect(() => {
    const onChangeAppState = async (state: string) => {
      if (state !== "active") return;
      const result = await recheckAll();
      setPermissionGuideVisible(!result.status?.granted || !result.isAlways);
    };
    AppState.addEventListener("change", onChangeAppState);
    return () => {
      AppState.addEventListener("change", onChangeAppState);
    };
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

  return (
    <locationContext.Provider
      value={{
        locations,
        status,
        hasStartedRecording,
        checkingIfStartedRecording: hasStartedRecording === null,
        isPermissionOk,
        requirePermission,
        startLocationRecording,
        stopLocationRecording,
        recheckAll,
      }}
    >
      {permissionGuideVisible ? (
        <SafeAreaView style={{ flex: 1 }}>
          <PermissionGuide />
        </SafeAreaView>
      ) : (
        children
      )}
    </locationContext.Provider>
  );
});

TaskManager.defineTask(FETCH_LOCATION, async ({ data, error }) => {
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

export default LocationProvider;
