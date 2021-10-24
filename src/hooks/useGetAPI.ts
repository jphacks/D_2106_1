import * as React from "react";
import { useAppContext } from "src/provider/app";

export const useGetAPI = <T = any>(endpoint: string, variables: any) => {
  const { serverHost } = useAppContext();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const query = new URLSearchParams(variables);
    fetch(`${serverHost}${endpoint}?${query}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((json) => setData(json?.data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
