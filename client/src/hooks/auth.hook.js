import {useState, useCallback, useEffect} from "react";
import {useHttp} from "./http.hook";

const storageName = "cyp-userData"

export const useAuth = () => {
    let [isAuthenticated, setIsAuthenticated] = useState(false);
    let [token, setToken] = useState(null);

    const {request} = useHttp();

    const login = useCallback((jwtToken) => {
        localStorage.setItem(storageName, JSON.stringify({token:jwtToken}));
        setToken(jwtToken);
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(storageName);
        setIsAuthenticated(false);
        setToken(null);
    }, [])
    useEffect(() => {
        const storageData = JSON.parse(localStorage.getItem(storageName));
        if(storageData && storageData.token) {
            setToken(storageData.token);
        }
    }, [])

    const initial = useCallback(() => {

        async function checkAuthorization () {
            if (token) {
                try {
                    const headers = {};
                    headers["authorization"] = "Bearer " + token;

                    const checkedToken = await request("/api/auth/check", "POST", {}, headers);

                    if(checkedToken) return true
                    return false
                } catch (e) {
                    logout();
                    return false
                }
            }
        }

        return checkAuthorization();

    },[token, request, logout]);


    return { login, logout,  isAuthenticated, initial}
}