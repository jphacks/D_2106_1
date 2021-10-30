import * as eva from "@eva-design/eva";
import { ApplicationProvider as UIKittenProvider } from "@ui-kitten/components";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppProvider from "src/provider/app";
import LocationProvider from "src/provider/location";
import "src/utils/extension";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";

LogBox.ignoreAllLogs(true);
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const customTheme = {
    ...eva.light,
    "color-primary-default": "#8ac75a",
    "color-primary-active": "rgba(138, 199, 90, 0.8)",
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UIKittenProvider {...eva} theme={customTheme}>
        <AppProvider serverHost="http://jphacks2021-server-859482516.ap-northeast-1.elb.amazonaws.com">
          <SafeAreaProvider>
            <LocationProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </LocationProvider>
          </SafeAreaProvider>
        </AppProvider>
      </UIKittenProvider>
    );
  }
}
