import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const { pathname } = useLocation();

  const menu = [
    { path: "/", label: "Dashboard", icon: "ri-dashboard-line" },
    { path: "/compose", label: "Compose Email", icon: "ri-edit-line" },
    { path: "/templates", label: "Templates", icon: "ri-file-text-line" },
  ];

  return (
    <aside className="w-64 bg-white sm:border-r sm:border-gray-200 sm:p-4">
      <nav className="space-y-2 mb-8">

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={
              "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors " +
              (pathname === item.path
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100")
            }
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={item.icon}></i>
            </div>
            <span>{item.label}</span>
          </Link>
        ))}

      </nav>
    </aside>
  );
};
