import * as React from "react";
import { Button, StyleSheet } from "react-native";
import EditScreenInfo from "src/components/EditScreenInfo";
import { Text, View } from "src/components/Themed";
import useBackgroundLocation from "src/hooks/useBackgroundLocation";

export default function TabFourScreen() {
  const { requirePermission, startLocationRecording, stopLocationRecording } =
    useBackgroundLocation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Four</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabThreeScreen.tsx" />
      <Button title="権限をリクエスト" onPress={requirePermission} />
      <Button title="記録を開始" onPress={startLocationRecording} />
      <Button title="記録を停止" onPress={stopLocationRecording} />
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
