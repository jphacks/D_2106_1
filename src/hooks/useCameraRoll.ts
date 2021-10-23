import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import useAsyncCallback from "./useAsyncCallback";

const useCameraRoll = (options: MediaLibrary.AssetsOptions = {}) => {
  const [status, requestPermissionBase] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [requestPermission, reqestingPermission] = useAsyncCallback(
    requestPermissionBase
  );

  const refreshAssets = useCallback(() => {
    if (reqestingPermission) return;
    if (status && !status.granted)
      Alert.alert("カメラロールにアクセスできません");
    if (status?.granted)
      MediaLibrary.getAssetsAsync(options).then((res) => setAssets(res.assets));
  }, [status, reqestingPermission]);

  useEffect(() => {
    requestPermission();
  }, []);

  useEffect(() => {
    refreshAssets();
  }, [status, reqestingPermission]);

  return { assets, refreshAssets };
};

export default useCameraRoll;
