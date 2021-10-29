import React, { useContext } from "react";

const valueContext = React.createContext<any | null>(null);

export const useValueContext = <T,>() => useContext<T | null>(valueContext);

export const ValueProvider = <T,>({
  children,
  values,
}: {
  children: React.ReactNode;
  values: T;
}) => {
  return (
    <valueContext.Provider value={values}>{children}</valueContext.Provider>
  );
};
