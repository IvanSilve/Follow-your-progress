import {useState} from "react";
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {useEffect} from "react";
import {AuthContext} from "./context/AuthContext";

require ("./App.css");

const App = () => {
    const {initial, token, login}  = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
       initial().then(result => {
           setIsAuthenticated(result)})
    }, [initial, token]);
    const routes = useRoutes(isAuthenticated)
    return (
        <AuthContext.Provider value={{token, login}}>
            <BrowserRouter>
                <div className="container">
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default (App);