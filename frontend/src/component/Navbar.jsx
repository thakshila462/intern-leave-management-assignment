import { Bell } from "lucide-react";

function Navbar({ user, title }) {
    return (
        <header className="navbar">
            <div>
                <p className="breadcrumb">Pages / {title}</p>
                <h2 className="navbar-title">{title}</h2>
            </div>

            <div className="navbar-right">
                <button
                    className="icon-button"
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <Bell size={19} />
                </button>

                <div className="navbar-user">
                    <div className="avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                        <strong>{user?.name || "User"}</strong>
                        <span>{user?.role || "EMPLOYEE"}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;