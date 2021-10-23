import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { ActivityIndicator } from "react-native";

export type Props = {
  visible?: boolean;
  overlay?: boolean;
};

const ScreenLoader: React.FC<Props> = ({ visible = true, overlay }) => (
  <Spinner
    visible={visible}
    overlayColor={overlay ? "rgba(0, 0, 0, 0.25)" : "transparent"}
    customIndicator={<ActivityIndicator size="large" />}
  />
);

export default ScreenLoader;
