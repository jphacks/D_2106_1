import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useCameraRoll = (options: MediaLibrary.AssetsOptions = {}) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    requestPermission();
  }, []);
  useEffect(() => {
    if (status && !status.granted)
      return Alert.alert("カメラロールにアクセスできません");
    if (status?.granted)
      MediaLibrary.getAssetsAsync(options).then((res) => setAssets(res.assets));
  }, [status]);

  return assets;
};

export default useCameraRoll;
