import * as React from "react";

const DOMAIN_NAME =
  "https://6e2d37c1-56a6-47de-af24-819ec4e13573.mock.pstmn.io";

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
