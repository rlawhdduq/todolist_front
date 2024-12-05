import React, {createContext, useContext, useEffect, useState} from "react";

type UserContextType = {
    user: { user_id?: string; id?: string; user_type?: string; token: string | null } | null;
    setUserSession: (user: { user_id?: string; id?: string; user_type?: string; token: string | null }) => void;
    logout: () => void
    loading: boolean;
};
export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const[ user, setUser ] = useState<UserContextType["user"]>(null);
    const[ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if(userData)
        {
            setUser(JSON.parse(userData));
        }
        setLoading(false)
    }, []);
    const setUserSession = (user: UserContextType["user"]) => {
        sessionStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        sessionStorage.removeItem("user");
        setUser(null);
    };

    if(loading) {
        return <div>Loading...</div>
    }

    return (
        <UserContext.Provider value={{ user, setUserSession, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error("useUser must be userd within a UserProvider");
    }
    return context;
}