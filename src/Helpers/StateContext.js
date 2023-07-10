import React, { createContext, useContext, useState } from "react";

export const StateContext = createContext();

export function StateContextProvider({ children }) {
  const value = useState({});
  return (
    <StateContext.Provider value={value}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within StateContextProvider");
  }
  return context;
}
