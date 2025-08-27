import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
	const location = useLocation();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-base-200">
				<span className="loading loading-spinner loading-lg text-primary"></span>
			</div>
		);
	}

	if (!isAuthenticated) {
		// Redirect to login page with return url
		return <Navigate to="/login" state={{ from: location }} replace />;
	}

	return children;
};

export default ProtectedRoute;
