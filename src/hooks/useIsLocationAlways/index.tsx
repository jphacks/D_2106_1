import type { useIsLocationAlwaysType } from "./native";

const useIsLocationAlwaysForExpo = () => async () => true;

let useIsLocationAlways: useIsLocationAlwaysType = useIsLocationAlwaysForExpo;
try {
  useIsLocationAlways = require("./native").default;
} catch (e) {
  console.log(
    "Error occured while importing. Bellow error is ignored.",
    e.message
  );
}

export default useIsLocationAlways;
