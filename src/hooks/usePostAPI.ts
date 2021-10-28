import React from "react";
import { useAppContext } from "src/provider/app";

export const usePostAPI = <T = any>(endpoint: string) => {
  const { serverHost } = useAppContext();
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  const post = async (variables: any = {}) => {
    const rawResult = await fetch(`${serverHost}${endpoint}`, {
      method: "POST",
      body: JSON.stringify(variables),
    });
    const result = await rawResult.json();
    if (rawResult.status !== 200) throw new Error(result.error ?? result.err);
    const resultData: T | null = result?.data ?? null;

    setLoading(false);
    setData(resultData);
    return resultData;
  };

  return [post, { data, loading }] as [
    typeof post,
    { data: T; loading: boolean }
  ];
};
