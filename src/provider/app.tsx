import React, { useContext } from "react";
export type AppContext = {};

const defaultAppContext: AppContext = {};

export const appContext = React.createContext<AppContext>(defaultAppContext);
export const useAppContext = () => useContext(appContext);

const AppProvider: React.FC = React.memo(({ children }) => {
  return <appContext.Provider value={{}}>{children}</appContext.Provider>;
});
export default AppProvider;
