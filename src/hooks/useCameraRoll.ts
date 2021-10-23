import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import useAsyncCallback from "./useAsyncCallback";

const useCameraRoll = (options: MediaLibrary.AssetsOptions = {}) => {
  const [status, requestPermissionBase] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [requestPermission, reqestingPermission] = useAsyncCallback(
    requestPermissionBase
  );

  useEffect(() => {
    requestPermission();
  }, []);
  useEffect(() => {
    if (reqestingPermission) return;
    if (status && !status.granted)
      Alert.alert("カメラロールにアクセスできません");
    if (status?.granted)
      MediaLibrary.getAssetsAsync(options).then((res) => setAssets(res.assets));
  }, [status, reqestingPermission]);

  return assets;
};

export default useCameraRoll;
