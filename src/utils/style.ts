import { StyleSheet } from "react-native";
import { BORDER_COLOR } from "./color";
import { BASE_PX } from "./space";

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.8,
  },
  rounodedImage: {
    borderColor: BORDER_COLOR,
    borderWidth: 1,
    borderRadius: BASE_PX,
    shadowRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});
