"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    prevPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    // Safely access localStorage after the component mounts
    const locadata = localStorage.getItem("profileData");
    const data = locadata ? JSON.parse(locadata) : {}; // Parse or use an empty object
    console.log(data, "Profile data from localStorage");

    // Set initial form data and image preview
    setFormData({
      name: data?.name || "",
      email: data?.email || "",
      prevPassword: "",
      newPassword: "",
    });
    setImagePreview(data?.profileImage || null);
  }, []); // Run only once when the component mounts

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      let profileImageURL = "";
  
      // 1. Upload image if selected
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
  
        const uploadRes = await fetch("https://api.escuelajs.co/api/v1/files/upload", {
          method: "POST",
          body: uploadFormData,
        });
  
        if (!uploadRes.ok) {
          throw new Error("Image upload failed.");
        }
  
        const uploadData = await uploadRes.json();
        console.log(uploadData, "Image upload response");
        profileImageURL = uploadData.location;
      }
  
      // 2. Build update payload
      const payload = {
        name: formData.name,
        email: formData.email,
      };
  
      if (profileImageURL) {
        payload.profileImage = profileImageURL;
      }
  
      if (showPasswordChange) {
        if (!formData.prevPassword || !formData.newPassword) {
          toast.error("Please enter both previous and new passwords.");
          return;
        }
        payload.currentPassword = formData.prevPassword;
        payload.newPassword = formData.newPassword;
      }
  
      // 3. Send PUT request to update profile
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const updateRes = await fetch(API_BASE_URL + "/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        if (updateRes.status === 400 && errorData.message === "Current password is incorrect") {
          toast.error("Current password is incorrect");
        } else {
          throw new Error("Something went wrong!");
        }
        return;
      }
  
      // 4. Save to localStorage for Sidebar sync
      const updatedUser = {
        name: payload.name,
        email: payload.email,
        profileImage: profileImageURL || imagePreview,
      };
      localStorage.setItem("profileData", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));
  
      toast.success("Profile updated successfully!");
      router.push("/");
    } catch (err) {
      console.error(err);
      if (err.message === "Current password is incorrect") {
        toast.error("Current password is incorrect");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#10141E]  text-white p-6">
      <div className="max-w-md mx-auto bg-[#161D2F] p-6 rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative cursor-pointer" onClick={handleImageClick}>
            <img
              src={imagePreview || "data:image/png;base64,..."} // Fallback image
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-red-500"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs mt-1 text-center text-gray-400">Click to upload</p>
          </div>

          <h2 className="text-xl font-bold">{formData.name}</h2>

          <div className="w-full mt-6 space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#20283E] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-[#20283E] text-white"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="text-sm font-medium">Change Password?</label>
              <input
                type="checkbox"
                checked={showPasswordChange}
                onChange={() => setShowPasswordChange((prev) => !prev)}
                className="w-4 h-4"
              />
            </div>

            {showPasswordChange && (
              <>
                <div>
                  <label className="block text-sm mb-1">Previous Password</label>
                  <input
                    type="password"
                    name="prevPassword"
                    value={formData.prevPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-[#20283E] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-[#20283E] text-white"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-red-500 hover:text-black hover:bg-white hover:text-black transition text-white py-2 rounded font-medium"
            >
              Save
            </button>

            <button
              onClick={()=>{localStorage.removeItem("authToken"); router.push("/auth/login")}}
              className="mt-4 w-full bg-red-500 hover:text-black hover:bg-white hover:text-black transition text-white py-2 rounded font-medium"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;