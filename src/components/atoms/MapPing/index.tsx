import React from "react";
import { Image, View } from "react-native";

type Props = {
  uri?: string;
  size?: number;
};

const MapPing = (props) => {
  return (
    <>
      <View style={{ top: 0, bottom: 0, left: 0, right: 0 }}>
        <Image
          style={{
            width: props.size * 1,
            height: props.size * 1.2,
          }}
          source={require("../../../assets/images/PING.png")}
        />
        <View
          style={{
            top: -props.size * 1.2 + props.size / 36,
            left: props.size / 33,
          }}
        >
          <Image
            style={{
              width: props.size * 0.9,
              height: props.size * 0.9,
              position: "absolute",
            }}
            source={{
              uri: props.uri,
            }}
          />
        </View>
      </View>
    </>
  );
};
export default MapPing;
