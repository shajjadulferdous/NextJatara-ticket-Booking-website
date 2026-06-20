"use client";

import React, { useState } from "react";
import { Form, TextField, Label, Input, FieldError, Description, Button, Link } from "@heroui/react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const d = {};
    formData.forEach((value, key) => {
      d[key] = value.toString();
    });
    d.role = 'user';
    
    const { data, error } = await authClient.signUp.email({
      name: d.name,
      email: d.email,
      password: d.password,
      role: d.role,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Account registration submitted successfully!`);
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
            {/* নাম পরিবর্তন করে NextJatra করা হয়েছে */}
            <span>Next<span className="text-[#7c3aed]">Jatra</span></span>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] mt-2">Create an Account</h2>
          <p className="text-sm text-gray-400">Join NextJatra for quick and seamless ticket bookings</p>
        </div>

        <Form
          className="flex flex-col gap-5"
          render={(props) => <form {...props} data-custom="foo" />}
          onSubmit={onSubmit}
        >
          
          {/* Full Name */}
          <TextField isRequired name="name" type="text" className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold text-[#334155]">Full Name</Label>
            <Input 
              placeholder="John Doe" 
              variant="bordered"
              radius="xl"
              size="md"
              className="w-full bg-white text-sm"
            />
            <FieldError className="text-xs text-danger font-medium mt-1" />
          </TextField>

          {/* Email Address */}
          <TextField
            isRequired
            name="email"
            type="email"
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

          {/* Password */}
          <TextField
            isRequired
            minLength={8}
            name="password"
            className="flex flex-col gap-1.5"
            validate={(value) => {
              if (value.length < 8) return "Password must be at least 8 characters";
              if (!/[A-Z]/.test(value)) return "Password must contain an uppercase letter";
              if (!/[0-9]/.test(value)) return "Password must contain a number";
              return null;
            }}
          >
            <Label className="text-sm font-semibold text-[#334155]">Password</Label>
            
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
                {isVisible ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>

            <Description className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters with 1 uppercase and 1 number
            </Description>
            <FieldError className="text-xs text-danger font-medium mt-1" />
          </TextField>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <Button
              type="submit"
              className="w-full bg-[#7c3aed] text-white font-bold text-[15px] py-6 rounded-xl hover:bg-[#6d28d9] transition-all shadow-md shadow-purple-100"
            >
              Create Account
            </Button>
            <Button type="reset" variant="light" className="w-full text-gray-500 font-semibold text-sm rounded-xl py-5">
              Reset Form
            </Button>
          </div>
        </Form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-sm font-bold text-[#7c3aed] hover:underline">
              Log in instead
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}