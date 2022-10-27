import React, { createContext, useContext } from "react";
import { useDataBase } from "../hook/useDataBase";
import { DatabaseType, LoginForm } from "../utils/interface";

const database = createContext<DatabaseType>({
  getUsers: () => {
    return [];
  },
  getCurrentUser: () => undefined,
  registerUser: () => {
    return { status: -1, message: "" };
  },
  loginUser: (_loginDetails: LoginForm) => {
    return { status: -1, message: "" };
  },
  updateProfilePicture : (_email : string,_picture : string) => {
    return { status: -1, message: "" };
  }
});

export const useDatabaseContext = () => useContext(database);

export const Database: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const databaseUtils = useDataBase();
  return (
    <>
      <database.Provider value={databaseUtils}>{children}</database.Provider>
    </>
  );
};
