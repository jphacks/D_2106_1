import React, { useContext } from "react";
export type AppContext = {
  serverHost: string;
};

const defaultAppContext: AppContext = {
  serverHost: "server-host-not-provided",
};

export const appContext = React.createContext<AppContext>(defaultAppContext);
export const useAppContext = () => useContext(appContext);

const AppProvider: React.FC<{ serverHost: string }> = React.memo(
  ({ serverHost, children }) => {
    return (
      <appContext.Provider value={{ serverHost }}>
        {children}
      </appContext.Provider>
    );
  }
);
export default AppProvider;
