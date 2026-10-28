import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    CalendarDays,
    LogOut,
    BriefcaseBusiness,
} from "lucide-react";

function Sidebar({ user }) {
    const navigate = useNavigate();

    const isAdmin = user?.role === "ADMIN";

    const adminLinks = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
        },
        {
            name: "Employees",
            path: "/admin/employees",
            icon: Users,
        },
        {
            name: "Leave Requests",
            path: "/admin/leaves",
            icon: ClipboardList,
        },
    ];

    const employeeLinks = [
        {
            name: "Dashboard",
            path: "/employee",
            icon: LayoutDashboard,
        },
        {
            name: "Apply Leave",
            path: "/employee/apply-leave",
            icon: CalendarDays,
        },
        {
            name: "My Leaves",
            path: "/employee/my-leaves",
            icon: ClipboardList,
        },
    ];

    const links = isAdmin ? adminLinks : employeeLinks;

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    }

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-logo">
                    <BriefcaseBusiness size={22} />
                </div>

                <div>
                    <h2>LeaveFlow</h2>
                    <p>Leave Management</p>
                </div>
            </div>

            <p className="menu-heading">MAIN MENU</p>

            <nav className="sidebar-nav">
                {links.map((link) => {
                    const Icon = link.icon;

                    return (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === "/admin" || link.path === "/employee"}
                            className={({ isActive }) =>
                                `nav-link ${isActive ? "active" : ""}`
                            }
                        >
                            <Icon size={19} />
                            <span>{link.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-user">
                    <div className="avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="sidebar-user-info">
                        <strong>{user?.name || "User"}</strong>
                        <span>{user?.role || "EMPLOYEE"}</span>
                    </div>
                </div>

                <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;