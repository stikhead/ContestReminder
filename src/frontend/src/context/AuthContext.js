import React, { useContext } from "react";

export const AuthContext = React.createContext({
    user: {
        isAuthenticated: false,
    },
    onLogin: ()=>{},
    onLogout: ()=>{}
});

export const AuthProvider = AuthContext.Provider;

export default function useAuth(){
    return useContext(AuthContext);
}