"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaBookmark } from "react-icons/fa";
import { MdMovie, MdLocalMovies } from "react-icons/md";
import { PiSquaresFourThin, PiTelevisionBold } from "react-icons/pi";

const Sidebar = ({ onNavigate = () => {}, user }) => {
  const [activeIcon, setActiveIcon] = useState("home");
  const router = useRouter();

  const handleIconClick = (iconName) => {
    setActiveIcon(iconName);

    if (iconName === "profile") {
      // Save user data in localStorage
      localStorage.setItem("profileData", JSON.stringify(user));
      router.push("/profile");
    } else {
      onNavigate(iconName);
    }
  };

  return (
    <>
      {/* Current Sidebar (Visible on PC and Large Screens) */}
      <div className="hidden md:flex fixed lg:top-4 lg:left-4 w-full md:w-[70px] h-16 md:h-[95vh] bg-[#161D2F] flex-col items-center justify-between md:py-8 z-50 shadow-lg rounded-xl md:rounded-2xl">
        {/* Logo */}
        <div className="hidden md:flex justify-center items-center w-full mb-10">
          <MdMovie size={25} className="text-red-500 text-4xl mb-10 mt--3" />
        </div>

        {/* Navigation Icons */}
        <div className="flex md:flex-col gap-6">
          <SidebarIcon
            icon={<PiSquaresFourThin size={22} />}
            isActive={activeIcon === "home"}
            onClick={() => handleIconClick("home")}
          />
          <SidebarIcon
            icon={<MdLocalMovies size={22} />}
            isActive={activeIcon === "movies"}
            onClick={() => handleIconClick("movies")}
          />
          <SidebarIcon
            icon={<PiTelevisionBold size={22} />}
            isActive={activeIcon === "tv"}
            onClick={() => handleIconClick("tv")}
          />
          <SidebarIcon
            icon={<FaBookmark size={18} />}
            isActive={activeIcon === "bookmark"}
            onClick={() => handleIconClick("bookmark")}
          />
        </div>

        {/* Profile Section */}
        <div className="md:flex mt-auto mb-2">
          <button onClick={() => handleIconClick("profile")}>
            <img
              src={user?.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-white hover:border-red-500 transition"
            />
          </button>
        </div>
      </div>

      {/* New Horizontal Sidebar (Visible on Mobile and Tablet) */}
      <div className="block md:hidden fixed top-0 left-0 w-full h-16 bg-[#161D2F] flex items-center justify-between px-4 z-50 shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <MdMovie size={20} className="text-red-500" />
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center gap-4">
          <SidebarIcon
            icon={<PiSquaresFourThin size={18} />}
            isActive={activeIcon === "home"}
            onClick={() => handleIconClick("home")}
          />
          <SidebarIcon
            icon={<MdLocalMovies size={18} />}
            isActive={activeIcon === "movies"}
            onClick={() => handleIconClick("movies")}
          />
          <SidebarIcon
            icon={<PiTelevisionBold size={18} />}
            isActive={activeIcon === "tv"}
            onClick={() => handleIconClick("tv")}
          />
          <SidebarIcon
            icon={<FaBookmark size={16} />}
            isActive={activeIcon === "bookmark"}
            onClick={() => handleIconClick("bookmark")}
          />
        </div>

        {/* Profile Section */}
        <button onClick={() => handleIconClick("profile")}>
          <img
            src={user?.profileImage || "/default-avatar.png"}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-white hover:border-red-500 transition"
          />
        </button>
      </div>
    </>
  );
};

const SidebarIcon = ({ icon, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`text-xl cursor-pointer transition ${
      isActive ? "text-white" : "text-[#5A698F]"
    } hover:text-red-500`}
  >
    {icon}
  </div>
);

export default Sidebar;