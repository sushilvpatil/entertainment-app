"use client";
import React, { useState } from "react";
import TextField from "@/app/commonComponents/TextField";
import Button from "@/app/commonComponents/Button";
import { postRequest } from "@/api/postRequest";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdMovie } from "react-icons/md";
const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
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
    if (!formData.repeatPassword) {
      toast.error("Please confirm your password!");
      return false;
    }
    if (formData.password !== formData.repeatPassword) {
      toast.error("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // ✅ Validate before API call

    setIsLoading(true); // ✅ Start Loader
    try {
      const response = await postRequest("/auth/register", {
        email: formData.email,
        password: formData.password,
      });
      
        toast.success("Signup successful!");
        router.push("/auth/login");
      
    } catch (err) {
      toast.error(err.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false); // ✅ Stop Loader
    }
  };

  return (
    
    <div className="flex h-screen items-center p-10 justify-center bg-[#0F111A]">
         <div className="absolute top-12 bottom-18">
              <MdMovie className="text-red-500 text-6xl mx-auto" />
            </div>
      <div className="w-full max-w-sm mt-32 p-8 bg-[#151924] rounded-xl shadow-lg">
        <h2 className="text-white text-xl font-semibold text-left mb-6">Sign Up</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <TextField
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full bg-transparent border-b border-gray-600 text-white px-2 py-5 focus:outline-none focus:border-red-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password Field */}
          <div>
            <TextField
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent border-b border-gray-600 text-white px-2 py-5 focus:outline-none focus:border-red-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Repeat Password Field */}
          <div>
            <TextField
              type="password"
              name="repeatPassword"
              placeholder="Repeat password"
              className="w-full bg-transparent border-b border-gray-600 text-white px-2 py-5 focus:outline-none focus:border-red-500"
              value={formData.repeatPassword}
              onChange={handleChange}
            />
          </div>

          {/* Signup Button with Loader */}
          <Button
            type="submit"
            disabled={isLoading} // ✅ Disable button when loading
            className={`mt-5 w-full py-2 rounded-lg transition ${
              isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-white hover:text-black text-white"
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
              "Create an account"
            )}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-red-500 cursor-pointer"
            onClick={() => router.push("/auth/login")} // ✅ Redirect to login
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
