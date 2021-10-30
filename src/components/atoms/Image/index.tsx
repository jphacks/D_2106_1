import React from "react";
import { Image as RNImage, ImageProps, StyleSheet } from "react-native";
import { BORDER_COLOR } from "src/utils/color";

const Image: React.FC<ImageProps> = ({ style, width, height, ...props }) => (
  <RNImage {...props} style={[styles.img, { width, height }, style]} />
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
  style,
  ...props
}) => {
  if (fitTo === "width") {
    return (
      <Image
        width={size}
        height={size * (height / width)}
        style={[styles.img, style]}
        {...props}
      />
    );
  } else {
    return (
      <Image
        width={size * (width / height)}
        height={size}
        style={[styles.img, style]}
        {...props}
      />
    );
  }
};

const styles = StyleSheet.create({
  img: {
    backgroundColor: BORDER_COLOR,
  },
});

export default Image;
