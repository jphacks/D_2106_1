import * as React from "react";
import { useAppContext } from "src/provider/app";
import { useSingleCallback } from "./useAsyncCallback";

export const useGetAPI = <T = any>(endpoint: string, variables?: any) => {
  const { serverHost } = useAppContext();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const fetchWithVariables = useSingleCallback(async () => {
    const query = new URLSearchParams(variables);
    setLoading(true);
    try {
      const resultRaw = await fetch(`${serverHost}${endpoint}?${query}`, {
        method: "GET",
      });
      const result = await resultRaw.json();
      setData(result?.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  });
  React.useEffect(() => {
    fetchWithVariables();
  }, [JSON.stringify(variables)]);

  return { data, loading };
};
