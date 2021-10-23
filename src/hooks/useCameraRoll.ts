import * as MediaLibrary from "expo-media-library";
import { useEffect } from "react";

export type Options = {
  autoRequestPermission?: boolean;
};

const useCameraRoll = ({ autoRequestPermission = true }: Options = {}) => {
  const [status, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (autoRequestPermission) requestPermission();
  }, [autoRequestPermission]);
};

export default useCameraRoll;
