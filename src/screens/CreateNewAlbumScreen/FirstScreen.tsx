import { Button } from "@ui-kitten/components";
import React from "react";
import { Linking, SafeAreaView, StyleSheet } from "react-native";
import { H3, SmallP } from "src/components/atoms/Text";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import { screens } from "src/dict";
import useAsyncCallback from "src/hooks/useAsyncCallback";
import useBackgroundLocation from "src/hooks/useBackgroundLocation";
import { useNavigation } from "src/hooks/useNavigation";
import { BASE_PX } from "src/utils/space";

const FirstScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isPermissionOk, requirePermission, startLocationRecording } =
    useBackgroundLocation();

  const [start, starting] = useAsyncCallback(async () => {
    await startLocationRecording();
    navigation.navigate(screens.CreateNewAlbumSecond);
  });
  const [startDebug, startingDebug] = useAsyncCallback(async () => {
    await startLocationRecording(1);
    navigation.navigate(screens.CreateNewAlbumSecond);
  });

  return (
    <SafeAreaView>
      <Padding size={BASE_PX}>
        <Space vertical>
          <H3>ステップ1. 位置情報へのアクセスを有効化</H3>
          <Button onPress={() => requirePermission()} disabled={isPermissionOk}>
            位置情報を有効化
          </Button>
          <H3>ステップ2. 設定で位置情報を有効にします</H3>
          <Button onPress={() => Linking.openSettings()}>設定を開く</Button>
          <SmallP>
            バックグラウンドで情報を記録できるように、位置情報へのアクセスを「常に」に切り替えてください。
          </SmallP>
          <H3>ステップ3. 位置情報の収集を開始します</H3>
          <SmallP>
            バックグラウンドで位置情報の収集を行い、撮影された写真がどこのものかをトラックします。
          </SmallP>
          <Button onPress={start} disabled={!isPermissionOk || starting}>
            位置情報の記録を開始
          </Button>
          <Button
            onPress={startDebug}
            disabled={!isPermissionOk || startingDebug}
          >
            位置情報の記録を開始（デバッグモード）
          </Button>
        </Space>
      </Padding>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default FirstScreen;
