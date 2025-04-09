"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./SlideBar";

const Layout = ({ children }) => {
  const pathname = usePathname();

  // Define routes where the Sidebar should not be displayed
  const noSidebarRoutes = ["/login", "/signup"];

  return (
    <div className="flex">
      {/* Conditionally render Sidebar
      {!noSidebarRoutes.includes(pathname) && <Sidebar />}
      <div className="flex-1">{children}</div> */}
    </div>
  );
};

export default Layout;