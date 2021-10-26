import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider as UIKittenProvider,
  Layout,
  Text,
} from "@ui-kitten/components";
import "src/utils/extension";
import AppProvider from "src/provider/app";
import LocationProvider from "src/provider/location";

LogBox.ignoreAllLogs(true);
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <UIKittenProvider {...eva} theme={eva.light}>
        <AppProvider serverHost="https://6e2d37c1-56a6-47de-af24-819ec4e13573.mock.pstmn.io">
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
