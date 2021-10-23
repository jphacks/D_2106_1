import React from "react";
import { Image as RNImage, ImageProps } from "react-native";

const Image: React.FC<ImageProps> = ({ style, width, height, ...props }) => (
  <RNImage {...props} style={[style, { width, height }]} />
);

export default Image;
