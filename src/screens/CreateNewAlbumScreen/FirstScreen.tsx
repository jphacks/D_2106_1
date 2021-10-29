import { Button } from "@ui-kitten/components";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useRef } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { H3, SmallP } from "src/components/atoms/Text";
import { Padding } from "src/components/layouts/Margin";
import Space from "src/components/layouts/Space";
import ModalizeHeader from "src/components/molecules/ModalizeHeader";
import PermissionGuide from "src/components/organisms/PermissionGuide";
import { screens } from "src/dict";
import useAsyncCallback from "src/hooks/useAsyncCallback";
import useFocusedEffect from "src/hooks/useFocusedEffect";
import { useNavigation } from "src/hooks/useNavigation";
import { useLocation } from "src/provider/location";
import { BASE_PX } from "src/utils/space";

const FirstScreen: React.FC = () => {
  const modalizeRef = useRef<Modalize>(null);
  const navigation = useNavigation();
  const {
    isPermissionOk: isLocationPermissionOk,
    startLocationRecording,
    stopLocationRecording,
    checkingIfStartedRecording,
    hasStartedRecording,
    recheckAll,
  } = useLocation();

  const [mlPermissionStatus] = MediaLibrary.usePermissions();

  const isAllPermissionOk =
    isLocationPermissionOk &&
    mlPermissionStatus?.granted &&
    mlPermissionStatus.accessPrivileges === "all";

  const [start, starting] = useAsyncCallback(async () => {
    await startLocationRecording();
    navigation.navigate(screens.CreateNewAlbumSecond);
  });
  const startWithCheckingPermission = () => {
    if (!isAllPermissionOk) {
      modalizeRef.current?.open();
      return;
    }
    start();
  };
  const continueRecording = () =>
    navigation.navigate(screens.CreateNewAlbumSecond);
  const [stop, stopping] = useAsyncCallback(async () => {
    await stopLocationRecording();
  });
  const stopWithAlert = () =>
    Alert.alert(
      "記録を停止してもよいですか？",
      "現在記録している位置情報データは破棄されます",
      [
        { text: "キャンセル", style: "cancel" },
        { text: "停止", onPress: stop },
      ]
    );
  const [startDebug, startingDebug] = useAsyncCallback(async () => {
    await startLocationRecording(1);
    navigation.navigate(screens.CreateNewAlbumSecond);
  });
  const [startDemo, startingDemo] = useAsyncCallback(async () => {
    navigation.navigate(screens.CreateNewAlbumSecond, {
      isDemo: true,
    });
  });

  useFocusedEffect(() => {
    recheckAll();
  });

  useEffect(() => {
    if (isAllPermissionOk) modalizeRef.current?.close();
  }, [isAllPermissionOk]);

  return (
    <><SafeAreaView>
      <Padding size={BASE_PX}>
        <Space vertical>
          <H3>位置情報の収集を開始します</H3>
          <SmallP>
            バックグラウンドで位置情報の収集を行い、撮影された写真がどこで撮影されたのかを追跡します。
          </SmallP>
          <SmallP>
            写真の撮影はこのアプリを経由する必要はありません。
            純正のカメラやサードパーティーカメラ、スクリーンショットなどもトラックすることができます。
          </SmallP>
          <Button
            onPress={hasStartedRecording ? continueRecording : startWithCheckingPermission}
            disabled={
              !isPermissionOk ||
              starting ||
              stopping ||
              checkingIfStartedRecording
            }
          >
            {hasStartedRecording
              ? "アルバム作成を続ける"
              : "位置情報の記録を開始"}
          </Button>
          <Button
            onPress={stopWithAlert}
            appearance="outline"
            disabled={
              !hasStartedRecording ||
              checkingIfStartedRecording ||
              starting ||
              stopping
            }
          >
            位置情報の記録を停止
          </Button>
          <Button
            status="basic"
            appearance="outline"
            onPress={startDebug}
            disabled={!isPermissionOk || startingDebug}
          >
            位置情報の記録を開始（デバッグモード）
          </Button>
          <Button status="basic" appearance="outline" onPress={startDemo}>
            デモを開始
          </Button>
          <Button
            status="basic"
            appearance="outline"
            onPress={() =>
              navigation.navigate(screens.CreateNewAlbumFifth, { albumId: 2 })
            }
            disabled={!isPermissionOk || startingDebug}
          >
            最終画面
          </Button>
        </Space>
      </Padding>
    </SafeAreaView>
        <Portal>
        <Modalize
          ref={modalizeRef}
          handlePosition="inside"
          HeaderComponent={
            <ModalizeHeader onClose={() => modalizeRef.current?.close()} />
          }
        >
          <PermissionGuide onClose={() => modalizeRef.current?.close()} />
        </Modalize>
      </Portal>
      </>
  );
};

export default FirstScreen;

const demoCoordinates = [
  {
    latitude: 35.1221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.0221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.1221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.2221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.2221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.2221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.1221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.0221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.2221702,
    longitude: 136.9599526,
  },
  {
    latitude: 35.1221702,
    longitude: 136.9599526,
  },
];
