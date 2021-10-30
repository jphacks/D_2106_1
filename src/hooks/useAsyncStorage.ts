import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import useStateWithPromise from "./useStateWithPromise";

// source : https://github.com/react-native-async-storage/async-storage/issues/32

const useAsyncStorage = <T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void, boolean, boolean] => {
  const [state, setState] = useStateWithPromise({
    hydrated: false,
    storageValue: defaultValue,
  });
  const { hydrated, storageValue } = state;
  const [loading, setLoading] = useState(true);

  async function pullFromStorage() {
    const fromStorage = await AsyncStorage.getItem(key);
    let value = defaultValue;
    if (fromStorage) {
      value = JSON.parse(fromStorage);
    }
    await setState({ hydrated: true, storageValue: value });
  }

  async function updateStorage(newValue: T) {
    setState({ hydrated: true, storageValue: newValue });
    const stringifiedValue = JSON.stringify(newValue);
    await AsyncStorage.setItem(key, stringifiedValue);
  }

  useEffect(() => {
    const fn = async () => {
      await pullFromStorage();
      setLoading(false);
    };
    fn();
  }, []);

  return [storageValue, updateStorage, loading, hydrated];
};

export default useAsyncStorage;
