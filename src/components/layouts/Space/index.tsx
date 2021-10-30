import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { View } from "src/components/atoms/Themed";
import { intersperse } from "src/utils";

export type Props = {
  size?: number | "tiny" | "small" | "middle" | "large";
  direction?: "vertical" | "horizontal";
  vertical?: boolean;
  wrap?: boolean;
  align?: "start" | "end" | "center";
  style?: StyleProp<ViewStyle>;
};

const Space: React.FC<Props> = ({
  size,
  direction,
  vertical,
  wrap,
  children,
  align,
  style,
  ...props
}) => {
  const childrenWithMargin = Array.isArray(children)
    ? intersperse(
        (children as React.ReactNode[] | null)?.filter((c) => c) ?? [],
        <Split size={size} direction={direction} vertical={vertical} />
      ).map((c, i) => <React.Fragment key={i}>{c}</React.Fragment>)
    : children;
  const isVerticfal = direction === "vertical" || vertical;
  return (
    <View
      {...props}
      style={[
        style,
        {
          flexDirection: isVerticfal ? "column" : "row",
          alignItems:
            align === "start"
              ? "flex-start"
              : align === "center"
              ? "center"
              : align === "end"
              ? "flex-end"
              : "stretch",
          flexWrap: wrap ? "wrap" : "nowrap",
        },
      ]}
    >
      {childrenWithMargin}
    </View>
  );
};

export const Split: React.FC<Props & { vertical?: boolean }> = ({
  size,
  direction,
  vertical,
}) => {
  const pxSize = sizeToPx(size);
  const isVertical = direction === "vertical" || vertical;
  return (
    <View
      style={{
        width: !isVertical ? pxSize : 0,
        height: isVertical ? pxSize : 0,
      }}
    />
  );
};

const sizeToPx = (s?: number | "tiny" | "small" | "middle" | "large") => {
  if (s === "tiny") return 4;
  if (s === "small" || s === undefined) return 8;
  if (s === "middle") return 16;
  if (s === "large") return 24;
  return s;
};
export default Space;
