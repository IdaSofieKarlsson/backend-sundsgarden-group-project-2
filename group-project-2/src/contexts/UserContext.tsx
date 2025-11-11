import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, UserForProfile } from "../interfaces/user";

interface UserContextType {
  activeUser: User | UserForProfile | null;
  setActiveUser: (user: User | UserForProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeUser, setActiveUser] = useState<User | UserForProfile | null>(
    null
  );

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
