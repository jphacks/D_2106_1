import * as React from "react";

const DOMAIN_NAME =
  "http://jphacks2021-server-859482516.ap-northeast-1.elb.amazonaws.com";

export const useGetAPI = <T = any>(endpoint: string, variables: any) => {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      const query = new URLSearchParams(variables);
      fetch(`${DOMAIN_NAME}${endpoint}?${query}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((json) => {
          setData(json?.data);
          console.log(`${DOMAIN_NAME}${endpoint}?${query}`);
        });
    } catch (e) {
      // 400 | 500 エラーも通す
      console.log(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading };
};
