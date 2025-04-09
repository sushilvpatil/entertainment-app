"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./commonComponents/SlideBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get current route
  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup") || pathname.includes("/details");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>
        {!isAuthPage && <Sidebar />} {/* Show sidebar except on login/signup */}
        <main className="flex-1">{children}</main>
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar 
          newestOnTop 
          closeOnClick 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover
        />
      </body>
    </html>
  );
}
