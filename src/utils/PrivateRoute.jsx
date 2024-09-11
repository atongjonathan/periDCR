import { Navigate } from "react-router-dom";

export function PrivateRoute({ isAutheniticated, children }) {
    return isAutheniticated? children : <Navigate to="/login" />;
}