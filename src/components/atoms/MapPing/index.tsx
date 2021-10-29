import React from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  uri?: string;
  imageSize: number;
  onPress: () => void;
};

const MapPing = (props: Props) => {
  const pingSize = {
    width: Math.floor(props.imageSize * 1.2),
    height: Math.floor((props.imageSize * 1.2 * 636) / 530),
  };
  return (
    <TouchableOpacity
      style={{
        top: -Math.floor(pingSize.height / 2),
        ...pingSize,
      }}
      onPress={props.onPress}
    >
      <Image
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          ...pingSize,
        }}
        resizeMode="contain"
        source={require("../../../assets/images/PING.png")}
      />
      <Image
        style={{
          borderRadius: 4,
          top: Math.floor(props.imageSize * 0.1) - 1,
          left: Math.floor(props.imageSize * 0.1),
          position: "absolute",
        }}
        // resizeMode=""
        width={Math.floor(props.imageSize)}
        height={Math.floor(props.imageSize)}
        source={{
          uri: props.uri,
        }}
      />
    </TouchableOpacity>
  );
};
export default MapPing;
