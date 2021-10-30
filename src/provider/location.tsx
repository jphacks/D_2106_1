import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@ui-kitten/components";
import Constants from "expo-constants";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, AppState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { locationsData as demoLocations } from "src/assets/demo/locations";
import Divider from "src/components/atoms/Divider";
import { TinyP } from "src/components/atoms/Text";
import Space from "src/components/layouts/Space";
import PermissionGuide from "src/components/organisms/PermissionGuide";
import useInterval from "src/hooks/useInterval";
import useIsLocationAlways from "src/hooks/useIsLocationAlways";
import { emptyAsyncFn } from "src/utils";

const TIME_INTERVAL = 5000;
const DISTANCE_INTERVAL = 10;
export const FETCH_LOCATION = "FETCH_LOCATION";
export const LOCATION_RECORDS = "LOCATION_RECORDS";
export const RECORDING_BEGIN_TIME = "RECORDING_BEGIN_TIME";

export type LocationData = {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
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
  applyDemoData: () => Promise<void>;
  clearCurrentData: () => Promise<void>;
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
  applyDemoData: emptyAsyncFn,
  clearCurrentData: emptyAsyncFn,
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
  const isPermissionOk =
    (!!status?.granted && isAlways) || Constants.appOwnership === "expo";

  const [permissionGuideVisible, setPermissionGuideVisible] = useState(false);

  const requirePermission = useCallback(async () => {
    setStatus(await Location.requestBackgroundPermissionsAsync());
  }, []);
  const clearCurrentData = useCallback(async () => {
    setLocations([]);
    await AsyncStorage.setItem(LOCATION_RECORDS, JSON.stringify([]));
  }, []);
  const startLocationRecording = useCallback(
    async (beginTime: number = moment().unix() * 1000) => {
      await AsyncStorage.setItem(RECORDING_BEGIN_TIME, String(beginTime));
      await clearCurrentData();
      try {
        await Location.startLocationUpdatesAsync(FETCH_LOCATION, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: DISTANCE_INTERVAL,
          deferredUpdatesInterval: TIME_INTERVAL,
          deferredUpdatesDistance: DISTANCE_INTERVAL,
        });
        setHasStartedRecording(true);
      } catch {
        Alert.alert("この機能は Expo Go 経由ではサポートされていません。");
        throw new Error("権限エラー, ExpoGoで起動していると思われる");
      }
    },
    []
  );
  const stopLocationRecording = useCallback(async () => {
    try {
      await Location.stopLocationUpdatesAsync(FETCH_LOCATION);
      await clearCurrentData();
    } catch {}
    setHasStartedRecording(false);
  }, []);

  const applyDemoData = useCallback(async () => {
    setLocations(demoLocations);
    await AsyncStorage.setItem(RECORDING_BEGIN_TIME, String(1));
    console.log("asyncStorage.setItem", RECORDING_BEGIN_TIME, String(1));
    await AsyncStorage.setItem(LOCATION_RECORDS, JSON.stringify(demoLocations));
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
  const recheckAllAndApply = async () => {
    const result = await recheckAll();
    // 記録開始した後にパーミッションが変更した場合
    if (
      result.hasStartedRecording &&
      (!result.status?.granted || !result.isAlways)
    )
      setPermissionGuideVisible(true);
  };
  useEffect(() => {
    recheckAllAndApply();
  }, []);
  useEffect(() => {
    const onChangeAppState = async (state: string) => {
      if (state == "active") recheckAllAndApply();
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
      setLocations(locs);
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
        applyDemoData,
        clearCurrentData,
      }}
    >
      {permissionGuideVisible ? (
        <SafeAreaView style={{ flex: 1 }}>
          <PermissionGuide onClose={() => setPermissionGuideVisible(false)}>
            <Space vertical>
              <Button
                onPress={() => setPermissionGuideVisible(false)}
                disabled={!status?.granted}
              >
                続ける
              </Button>

              <Divider />

              <TinyP center gray>
                または
              </TinyP>
              <Button
                status="danger"
                appearance="outline"
                onPress={async () => {
                  try {
                    await stopLocationRecording();
                  } catch {}
                  setPermissionGuideVisible(false);
                }}
              >
                進行している記録を停止
              </Button>
            </Space>
          </PermissionGuide>
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
    const prevLocations: LocationData[] = prevLocationsStr
      ? JSON.parse(prevLocationsStr)
      : [];

    const locations: LocationData[] = (data as any).locations.map(
      positionToLocation
    );
    const locationsWithTimeInterval = locations.reduce<LocationData[]>(
      (acc, val) => {
        const accLast = acc.last();
        return accLast?.timestamp &&
          val.timestamp < accLast.timestamp + TIME_INTERVAL
          ? acc
          : [...acc, val];
      },
      [prevLocations.last()].filter<LocationData>((l): l is LocationData => !!l)
    );

    const merged =
      prevLocations.length > 0
        ? [...prevLocations, ...locationsWithTimeInterval.slice(1)]
        : locationsWithTimeInterval;
    AsyncStorage.setItem(LOCATION_RECORDS, JSON.stringify(merged));
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
