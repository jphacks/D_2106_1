import React, { useMemo } from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import { trimString } from "src/utils";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"] & { filled?: boolean };

export const Text: React.FC<TextProps> = ({
  style,
  lightColor,
  darkColor,
  children,
  ...otherProps
}) => {
  // children: string[] の場合はスペース調整のために
  // \n や " " が含まれているので trimString() しない
  return (
    <DefaultText style={style} {...otherProps}>
      {typeof children === "string" ? trimString(children) : children}
    </DefaultText>
  );
};

export const View: React.FC<ViewProps> = ({
  style,
  lightColor,
  darkColor,
  filled,

  ...otherProps
}) => {
  const viewStyle = useMemo(
    () => [{ backgroundColor: filled ? "white" : "transparent" }, style],
    [style, filled],
  );
  return <DefaultView style={viewStyle} {...otherProps} />;
};
