import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { View, ViewProps } from "src/components/atoms/Themed";
import { undefinedOrNull } from "src/utils";

export type Props = {
  size?: string | number | null;
  top?: string | number | null;
  bottom?: string | number | null;
  left?: string | number | null;
  right?: string | number | null;
  fullWidth?: boolean;
  fullHeight?: boolean;
};

/**
 * styled-component の props を使用すると、
 * json value px cannot be converted to abi40_0_0ygvalue
 * というエラーが発生し、 props が正しく渡せなかった
 */

const Margin: React.FC<Props & ViewProps> = ({
  size,
  top,
  bottom,
  left,
  right,
  fullWidth,
  fullHeight,
  children,
  style,
  ...viewProps
}) => {
  const numberSize = {
    top: parse(top ?? size),
    left: parse(left ?? size),
    right: parse(right ?? size),
    bottom: parse(bottom ?? size),
  };
  const styles = [
    !undefinedOrNull(numberSize.top) && { marginTop: numberSize.top },
    !undefinedOrNull(numberSize.left) && { marginLeft: numberSize.left },
    !undefinedOrNull(numberSize.right) && { marginRight: numberSize.right },
    !undefinedOrNull(numberSize.bottom) && { marginBottom: numberSize.bottom },
  ];
  return <View style={[style, ...styles]}>{children}</View>;
};

export const Padding: React.FC<Props & ViewProps> = ({
  size,
  top,
  bottom,
  left,
  right,
  fullWidth,
  fullHeight,
  children,
  style,
  ...viewProps
}) => {
  const numberSize = {
    top: parse(top ?? size),
    left: parse(left ?? size),
    right: parse(right ?? size),
    bottom: parse(bottom ?? size),
  };
  const styles: StyleProp<ViewStyle> = [
    !undefinedOrNull(numberSize.top) && { paddingTop: numberSize.top },
    !undefinedOrNull(numberSize.left) && { paddingLeft: numberSize.left },
    !undefinedOrNull(numberSize.right) && { paddingRight: numberSize.right },
    !undefinedOrNull(numberSize.bottom) && { paddingBottom: numberSize.bottom },
  ];
  return (
    <View {...viewProps} style={[style, ...styles]}>
      {children}
    </View>
  );
};

const parse = (v?: string | number | null) =>
  undefinedOrNull(v) ? v : !(typeof v === "string") ? v : v.includes("px") ? parseInt(v) : v;

export default Margin;
