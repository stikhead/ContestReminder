import React, { useContext } from "react";

export const AuthContext = React.createContext({
    user: {
        isAuthenticated: false,
        loading: true,
        contestPreference: {},
        reminderPreference: {},
        savedContests: []
    },
    onLogin: () => {},
    onLogout: () => {},
    updatePreferences: () => {} 
});

export const AuthProvider = AuthContext.Provider;

export default function useAuth() {
    return useContext(AuthContext);
}