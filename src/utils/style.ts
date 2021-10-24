import { StyleSheet } from "react-native";
import { BASE_PX } from "./space";

export const globalStyles = StyleSheet.create({
  shadow: {
    shadowRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.8,
  },
  rounodedImage: {
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
