"use client";

import React, { useState } from "react";
// HeroUI v3 এর ফর্ম কম্পোনেন্ট
import { Form, TextField, Label, Input, FieldError, Button, Link } from "@heroui/react";
// React Icons থেকে আইকন ইমপোর্ট
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const d = {};

    formData.forEach((value, key) => {
      d[key] = value.toString();
    });
    
    const { data, error } = await authClient.signIn.email({
      email: d.email, 
      password: d.password, 
      callbackURL: "/",
    });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Login form submitted successfully!`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-gray-50 flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/50 overflow-hidden p-8 sm:p-10">
        
        <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-2 font-black text-[#0f172a] text-2xl tracking-tight">
            <svg
              className="w-7 h-7 text-[#7c3aed]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {/* ব্র্যান্ডের নাম পরিবর্তন করে NextJatra করা হয়েছে */}
            <span>Next<span className="text-[#7c3aed]">Jatra</span></span>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] mt-2">Welcome Back!</h2>
          <p className="text-sm text-gray-400">Please enter your details to login</p>
        </div>

        <Form
          className="flex flex-col gap-5"
          render={(props) => <form {...props} data-custom="foo" />}
          onSubmit={onSubmit}
        >
          
          {/* Email Field */}
          <TextField
            isRequired
            name="email"
            type="email"
            value={email}
            onChange={setEmail}
            className="flex flex-col gap-1.5"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-[#334155]">Email Address</Label>
            <Input 
              placeholder="you@example.com" 
              variant="bordered"
              radius="xl"
              size="md"
              className="w-full bg-white text-sm"
            />
            <FieldError className="text-xs text-danger font-medium mt-1" />
          </TextField>

          {/* Password Field */}
          <TextField
            isRequired
            name="password"
            value={password}
            onChange={setPassword}
            className="flex flex-col gap-1.5"
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              return null;
            }}
          >
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold text-[#334155]">Password</Label>
              <Link href="/forgot-password" className="text-xs font-semibold text-[#7c3aed] hover:underline">
                Forgot Password?
              </Link>
            </div>
            
            <div className="relative w-full flex items-center">
              <Input 
                type={isVisible ? "text" : "password"}
                placeholder="••••••••" 
                variant="bordered"
                radius="xl"
                size="md"
                className="w-full bg-white text-sm pr-12"
              />
              <button 
                className="absolute right-4 focus:outline-none text-gray-400 hover:text-gray-600 z-10" 
                type="button" 
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            <FieldError className="text-xs text-danger font-medium mt-1" />
          </TextField>

          <div className="flex flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-full bg-[#7c3aed] text-white font-bold text-[15px] py-6 rounded-xl hover:bg-[#6d28d9] transition-all shadow-md shadow-purple-100"
            >
              Sign In
            </Button>
          </div>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-sm font-bold text-[#7c3aed] hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}