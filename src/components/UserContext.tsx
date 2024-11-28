import React, {createContext, useContext, useState} from "react";

export const UserContext = createContext<any>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUserSession] = useState<{
        user_id?: string;
        id?: string;
        user_type?: string;
        token: string | null;
    } | null>(null);

    return (
        <UserContext.Provider value={{ user, setUserSession }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);