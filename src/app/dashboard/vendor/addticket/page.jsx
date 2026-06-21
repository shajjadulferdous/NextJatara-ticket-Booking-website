"use client";

import React, { useState } from "react";
import { Form, Checkbox, Button } from "@heroui/react";
import { FiGrid, FiUploadCloud, FiMapPin, FiCalendar, FiDollarSign, FiLayers, FiShield, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddTicketPage() {
  const [imagePreview, setImagePreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const { data: session, 
        isPending, 
        error, 
        refetch } = authClient.useSession();
  
  const handleSubmit = async (e) => {
   
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const ticketData = {
      title: formData.get("title"),
      origin: formData.get("origin"),
      destination: formData.get("destination"),
      transportType: formData.get("transportType"),
      departureSchedule: formData.get("departureSchedule"),
      price: formData.get("price"),
      seatCapacity: formData.get("seatCapacity"),
      amenities: selectedAmenities,
      bannerUrl: uploadedUrl,
      userId: session?.user?.id,
      status: "pending",
    };
     console.log("Submitting Ticket Data:", ticketData);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      toast.error("Failed to create ticket listing.");
      return;
    }

    setImagePreview("");
    setUploadedUrl("");
    setSelectedAmenities([]);
    e.target.reset(); 
    toast.success("Ticket listing created successfully!");
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsUploading(true);

    const IMGBB_API_KEY = process.env.IMGBB_API_KEY; 
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key={IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const resData = await response.json();
      if (resData.success) {
        setUploadedUrl(resData.data.url);
        toast.success("Artwork loaded successfully.");
      }
    } catch (err) {
      toast.error("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  return (
     isPending ? (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading session...</p>
      </div>
    ) : 
     <div className="w-full min-h-screen bg-[#F4F6F5] p-4 sm:p-6 lg:p-10 text-[#1A312C]">
      <div className="max-w-4xl mx-auto bg-white border border-[#1A312C]/5 rounded-3xl shadow-xl shadow-[#1A312C]/5 overflow-hidden">
        
        {/* Top Header Layer */}
        <div className="p-8 bg-[#1A312C] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 bg-[#89D7B7]/10 rounded-full blur-3xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#89D7B7] uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full w-max mb-3">
              <FiShield className="text-[#89D7B7]" /> Secure Transit Core
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Create Ticket Listing</h1>
            <p className="text-xs text-white/60 mt-1">Publish a premium transport seat matrix directly onto the active customer engine.</p>
          </div>
        </div>

        {/* Input Form Module */}
        <Form className="p-8 space-y-8" onSubmit={handleSubmit} >
          
          {/* Primary Fields */}
          <div className="w-full space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                <FiGrid className="text-[#1A312C]/40" /> Ticket Title / Fleet Name
              </label>
              <input 
                type="text" 
                name='title'
                placeholder="e.g., Green Line Scania Multi-Axle Sleeper" 
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm font-medium bg-gray-50/50" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                  <FiMapPin className="text-[#1A312C]/40" /> Origin Location
                </label>
                <input type="text" name="origin" placeholder="e.g., Dhaka" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm bg-gray-50/50" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                  <FiMapPin className="text-[#89D7B7]" /> Destination Hub
                </label>
                <input type="text" name="destination" placeholder="e.g., Cox's Bazar" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm bg-gray-50/50" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60">Transport Type</label>
                <input type="text" name="transportType" placeholder="e.g., Premium Bus" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm bg-gray-50/50" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                  <FiCalendar className="text-[#1A312C]/40" /> Departure Schedule
                </label>
                <input type="datetime-local" name="departureSchedule" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm text-[#1A312C]/80 bg-gray-50/50" required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                  <FiDollarSign className="text-[#1A312C]/40" /> Price (Per Unit)
                </label>
                <input type="number" name="price" placeholder="BDT 1500" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm bg-gray-50/50" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label  className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60 flex items-center gap-1.5">
                  <FiLayers className="text-[#1A312C]/40" /> Total Seat Capacity
                </label>
                <input type="number" name="seatCapacity" placeholder="e.g., 40" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-[#1A312C] focus:ring-4 focus:ring-[#89D7B7]/20 outline-none transition-all text-sm bg-gray-50/50" required />
              </div>
              <div className="flex flex-col gap-2 opacity-75">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vendor Node (Read Only)</label>
                <input type="text" value={session?.user?.name} disabled className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-100/50 text-gray-400 text-sm cursor-not-allowed font-medium" />
              </div>
              <div className="flex flex-col gap-2 opacity-75">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Registered Terminal Email</label>
                <input type="email" value={session?.user?.email} disabled className="w-full px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-100/50 text-gray-400 text-sm cursor-not-allowed font-medium" />
              </div>
            </div>
          </div>

          {/* Fleet Banner / Ticket Artwork */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60">Fleet Banner / Ticket Artwork</label>
            <div className="border-2 border-dashed border-gray-200 hover:border-[#1A312C]/30 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-gray-50/30 transition-all relative min-h-[160px]">
              {imagePreview ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden group shadow-md">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-[#1A312C]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                    <label htmlFor="ticket-upload" className="bg-white text-xs font-bold text-[#1A312C] px-4 py-2.5 rounded-xl cursor-pointer shadow-lg hover:bg-gray-50 transition-all">Replace Media</label>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center text-xs font-bold text-[#1A312C] gap-2">
                      <div className="w-5 h-5 border-2 border-[#1A312C] border-t-transparent rounded-full animate-spin" />
                      Uploading node to imgbb...
                    </div>
                  )}
                </div>
              ) : (
                <label htmlFor="ticket-upload" className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1A312C]/5 text-[#1A312C] flex items-center justify-center border border-[#1A312C]/5">
                    <FiUploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A312C] hover:underline">Click to stream fleet banner</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG (Auto-managed via ImgBB secure cloud)</p>
                  </div>
                </label>
              )}
              <input id="ticket-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          {/* FIXED & PREMIUM AMENITIES SECTION */}
          <div className="w-full flex flex-col gap-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A312C]/60">Available Roster Amenities</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#89D7B7]/10 border border-[#89D7B7]/20">
              {["Air Conditioner", "High-Speed Wi-Fi", "Snacks Buffet", "USB Charging Hub"].map((perk, idx) => {
                const isChecked = selectedAmenities.includes(perk);
                return (
                  <div 
                    key={idx}
                    onClick={() => toggleAmenity(perk)}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border select-none ${
                      isChecked 
                        ? "bg-white border-[#89D7B7] shadow-md shadow-[#89D7B7]/5" 
                        : "bg-white/40 border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isChecked 
                        ? "bg-[#1A312C] border-[#1A312C] text-[#89D7B7]" 
                        : "border-gray-300 bg-white"
                    }`}>
                      {isChecked && <FiCheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-bold text-black tracking-tight">{perk}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Footer Button Layer */}
          <div className="w-full pt-6 border-t border-gray-100 flex justify-end items-center gap-4">
            <Button type="reset" variant="light" className="text-[#1A312C]/50 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-gray-50 transition-all" onClick={() => { setImagePreview(""); setSelectedAmenities([]); }}>
              Clear Setup
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading} 
              className="bg-[#1A312C] hover:bg-[#1A312C]/90 text-white font-bold text-xs uppercase tracking-widest px-8 h-12 rounded-xl shadow-lg shadow-[#1A312C]/10 hover:shadow-[#1A312C]/20 transition-all border border-transparent active:scale-[0.98]"
            >
              Add Ticket Slot
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}