import React from "react";
import { Image as RNImage, ImageProps } from "react-native";

const Image: React.FC<ImageProps> = ({ style, width, height, ...props }) => (
  <RNImage {...props} style={[style, { width, height }]} />
);

export const ScaledImage: React.FC<
  Omit<ImageProps, "width" | "height"> & {
    width: number;
    height: number;
    size: number;
    fitTo?: "width" | "height";
  }
> = ({
  width,
  height,
  fitTo = width > height ? "width" : "height",
  size,
  ...props
}) => {
  if (fitTo === "width") {
    return <Image width={size} height={size * (height / width)} {...props} />;
  } else {
    return <Image width={size * (width / height)} height={size} {...props} />;
  }
};

export default Image;
