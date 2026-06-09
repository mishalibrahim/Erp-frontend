import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LoginForm } from "../components/LoginForm";

export const Login = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Optionally show a loading spinner while checking token
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-10 h-10 border-4 border-primary/30 rounded-full border-t-primary animate-spin"></div>
      </div>
    );
  }

  // Redirect if user is already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative background blurs that look good in both light and dark mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-ring/20 rounded-full blur-[120px] pointer-events-none"></div>
      <LoginForm />
    </div>
  );
};
