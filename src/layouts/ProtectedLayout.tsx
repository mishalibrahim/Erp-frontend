import { Navigate, Outlet } from "react-router-dom";

export const ProtectedLayout = () => {
  const { isAuthenticated, isLoading } = {
    isAuthenticated: false,
    isLoading: false,
  };
  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading Aegis ERP...</div>;
  }

  // Security Checkpoint: No token? Go to login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#f5f6f8" }}
    >
      {/* 1. LEFT SIDEBAR (Placeholder for now) */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#1f2d3d",
          color: "#fff",
          padding: "1rem",
        }}
      >
        <h3>Aegis ERP</h3>
        <nav
          style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <a href="/" style={{ color: "#ddeeff", textDecoration: "none" }}>
            Dashboard
          </a>
          <a
            href="/company/setup"
            style={{ color: "#ddeeff", textDecoration: "none" }}
          >
            Company Setup
          </a>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* TOP HEADER */}
        <header
          style={{
            height: "60px",
            backgroundColor: "#fff",
            borderBottom: "1px solid #e0e2e8",
            display: "flex",
            alignItems: "center",
            padding: "0 2rem",
          }}
        >
          <div style={{ marginLeft: "auto" }}>Welcome, Admin</div>
        </header>

        {/* DYNAMIC PAGE CONTENT INJECTED HERE */}
        <div style={{ padding: "2rem", overflowY: "auto" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
