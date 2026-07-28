import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}