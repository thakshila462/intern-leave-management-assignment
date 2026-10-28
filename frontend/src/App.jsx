
import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Outlet,
  useLocation,
} from "react-router-dom";

import Sidebar from "./component/Sidebar";
import Navbar from "./component/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Employees from "./pages/Employees";
import LeaveRequests from "./pages/LeaveRequests";
import ApplyLeave from "./pages/ApplyLeave";
import MyLeaves from "./pages/MyLeaves";

import api from "./services/api";
import "./App.css";

/* Protected Layout */

function ProtectedLayout({ user, requiredRole }) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (user.role !== requiredRole) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin" : "/employee"}
        replace
      />
    );
  }

  const titleMap = {
    "/admin": "Admin Dashboard",
    "/admin/employees": "Employees",
    "/admin/leaves": "Leave Requests",
    "/employee": "Employee Dashboard",
    "/employee/apply-leave": "Apply for Leave",
    "/employee/my-leaves": "My Leaves",
  };

  return (
    <div className="app-container">
      <Sidebar user={user} />

      <main className="main-content">
        <Navbar
          user={user}
          title={titleMap[location.pathname] || "Dashboard"}
        />

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

/* Main App Content */

function AppContent() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [checkingAuth, setCheckingAuth] = useState(
    Boolean(localStorage.getItem("token"))
  );

  /* Verify logged-in user */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    let cancelled = false;

    async function verifySession() {
      try {
        const response = await api.get("/auth/me");

        const currentUser = response.data.user || response.data;

        if (!["ADMIN", "EMPLOYEE"].includes(currentUser.role)) {
          throw new Error("Invalid user role.");
        }

        if (!cancelled) {
          setUser(currentUser);

          localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
          );
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, []);

  /* Logout */

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  /* Authentication loading */

  if (checkingAuth) {
    return (
      <div className="loading-screen">
        Verifying your session...
      </div>
    );
  }

  /* Routes */

  return (
    <Routes>
      {/* Login */}

      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role === "ADMIN" ? "/admin" : "/employee"}
              replace
            />
          ) : (
            <Login onLogin={setUser} />
          )
        }
      />

      {/* Signup */}

      <Route
        path="/signup"
        element={
          user ? (
            <Navigate
              to={user.role === "ADMIN" ? "/admin" : "/employee"}
              replace
            />
          ) : (
            <Signup />
          )
        }
      />

      {/* Admin routes */}

      <Route
        element={
          <ProtectedLayout
            user={user}
            requiredRole="ADMIN"
          />
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/admin/employees"
          element={<Employees />}
        />

        <Route
          path="/admin/leaves"
          element={<LeaveRequests />}
        />
      </Route>

      {/* Employee routes */}

      <Route
        element={
          <ProtectedLayout
            user={user}
            requiredRole="EMPLOYEE"
          />
        }
      >
        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/apply-leave"
          element={<ApplyLeave />}
        />

        <Route
          path="/employee/my-leaves"
          element={<MyLeaves />}
        />
      </Route>

      {/* Home route */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              user
                ? user.role === "ADMIN"
                  ? "/admin"
                  : "/employee"
                : "/login"
            }
            replace
          />
        }
      />

      {/* Unknown routes */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              user
                ? user.role === "ADMIN"
                  ? "/admin"
                  : "/employee"
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
}

/* App */

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
