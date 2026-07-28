import { Navigate } from "react-router";

export default function AdminRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/" replace />;
    }

    if (!user.isAdmin) {
        return <Navigate to="/home" replace />;
    }

    return children;
}