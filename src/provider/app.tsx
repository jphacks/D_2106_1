import React, { useContext, useEffect } from "react";
import { AppState } from "react-native";
import { useNavigation } from "src/hooks/useNavigation";
import * as Location from "expo-location";
import { check, PERMISSIONS, RESULTS } from "react-native-permissions";
import useBoolState from "src/hooks/useBoolState";
export type NavigationRefType = ReturnType<typeof useNavigation>;
export type AppContext = {};

const defaultAppContext: AppContext = {};

export const appContext = React.createContext<AppContext>(defaultAppContext);
export const useAppContext = () => useContext(appContext);

const AppProvider: React.FC = React.memo(({ children }) => {
  const {
    state: guideOverlayVisible,
    setTrue: openGuideOverlay,
    setFalse: closeGuideOverlay,
  } = useBoolState();

  const checkLocationPermission = async () => {
    const locationPermission = await Location.getBackgroundPermissionsAsync();
    const locationAlwaysPermission = await check(
      PERMISSIONS.IOS.LOCATION_ALWAYS
    );
    return locationPermission.granted && locationAlwaysPermission === "granted";
  };

  // アプリ復帰時
  useEffect(() => {
    const onChangeAppState = async (state: string) => {
      if (state !== "active") return;
      const isPermissionOk = await checkLocationPermission();
    };
    AppState.addEventListener("change", onChangeAppState);
    return () => {
      AppState.addEventListener("change", onChangeAppState);
    };
  }, []);

  return <appContext.Provider value={{}}>{children}</appContext.Provider>;
});
export default AppProvider;
