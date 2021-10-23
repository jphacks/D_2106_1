import React from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { Text, View } from "../Themed";
export type Props = {
  words: string[];
  debug?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  TextComponent?: React.FC<{ style: StyleProp<TextStyle> }>;
};

const Wrapped: React.FC<Props> = ({
  words,
  debug,
  containerStyle,
  textStyle,
  TextComponent,
  children,
}) => {
  const TextRenderer = TextComponent || Text;
  return (
    <View
      style={[styles.container, styles.rowWrapper, containerStyle, debug ? styles.debugStyle : {}]}
    >
      {words.map(
        (colText, colIndex) =>
          (colText !== "" || (words.length === 1 && colText === "")) && (
            <TextRenderer
              key={colText + "-" + colIndex}
              style={[textStyle, debug ? styles.debugStyle : {}]}
            >
              {colText}
            </TextRenderer>
          ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  rowWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  debugStyle: {
    borderWidth: 0.5,
    borderColor: "rgba(255,60,60,0.7)",
  },
});

export default Wrapped;
