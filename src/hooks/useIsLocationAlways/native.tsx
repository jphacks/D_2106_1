import { check, PERMISSIONS } from "react-native-permissions";

const useIsLocationAlways = () => {
  return async () =>
    (await check(PERMISSIONS.IOS.LOCATION_ALWAYS)) === "granted";
};

export type useIsLocationAlwaysType = typeof useIsLocationAlways;

export default useIsLocationAlways;
