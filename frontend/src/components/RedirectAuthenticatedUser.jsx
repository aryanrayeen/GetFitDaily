import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

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

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return children;
};

export default RedirectAuthenticatedUser;
