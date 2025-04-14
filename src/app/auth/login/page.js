"use client";
import React, { useState } from "react";
import TextField from "@/app/commonComponents/TextField";
import Button from "@/app/commonComponents/Button";
import { postRequest } from "@/api/postRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdMovie } from "react-icons/md";
import { useEffect } from "react";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false); // ✅ Loader State
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email) {
      toast.error("Email is required!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Enter a valid email address!");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required!");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // If the user is already logged in, redirect to the main page
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ✅ Validate before API call

    setIsLoading(true); // ✅ Start Loader
    try {
      const response = await postRequest("/auth/login", formData);
      // ✅ Store Token in LocalStorage
      const { token, user, message } = response.data;
      // Store in localStorage
      console.log("Token:", token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
  
      toast.success(message);
      router.replace("/"); // ✅ Redirect to Home
    } catch (err) {
      const errorMessage = err.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false); // ✅ Stop Loader
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#0F111A] relative">
      
      {/* Top Center Icon */}
      <div className="absolute top-12 bottom-18">
        <MdMovie className="text-red-500 text-6xl mx-auto" />
      </div>
  
      {/* Login Box */}
      <div className="w-full max-w-sm p-8 bg-[#151924] rounded-xl shadow-lg mt-20">
        <h2 className="text-white text-xl font-semibold text-left mb-6">Login</h2>
  
        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextField
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email address"
            className="w-full bg-transparent border-b border-gray-600 text-white px-2 py-5 focus:outline-none focus:border-red-500 caret-red-500"
          />
          <TextField
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            type="password"
            className="w-full bg-transparent border-b border-gray-600 text-white px-2 py-5 focus:outline-none focus:border-red-500 caret-red-500"
          />
  
          <Button
            type="submit"
            disabled={isLoading}
            className={`mt-5 w-full py-2 rounded-lg transition ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500  text-white hover:bg-white hover:text-black text-white"
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Login to your account"
            )}
          </Button>
        </form>
  
        <p className="text-gray-400 text-sm text-center mt-4">
          Don’t have an account?{" "}
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => router.push("/auth/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
  
};

export default Login;
