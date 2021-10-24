import React from "react";
import { useAppContext } from "src/provider/app";

export const usePostApi = <T = any>(endpoint: string) => {
  const { serverHost } = useAppContext();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const post = async (variables: any = {}) => {
    let resultData: T | null = null;
    try {
      const result = await fetch(`${serverHost}${endpoint}`, {
        method: "POST",
        body: JSON.stringify(variables),
      }).then((res) => res.json());
      resultData = result?.data ?? null;
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setData(resultData);
    return resultData;
  };

  return [post, { data, loading }] as [
    typeof post,
    { data: T; loading: boolean }
  ];
};
