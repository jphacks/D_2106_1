import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";

const useFocusedEffect = (fn: () => void) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) fn();
  }, [isFocused]);
};

export default useFocusedEffect;
