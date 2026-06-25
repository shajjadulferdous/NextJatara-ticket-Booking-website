'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaUpload, FaBus, FaTrain, FaShip, FaPlane } from 'react-icons/fa';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import Spinner from '@/compontents/ui/Spinner';

const AMENITIES = ['AC', 'WiFi', 'Food', 'Charging Port', 'Sleeper', 'TV', 'Blanket', 'Water'];

export default function AddTicketPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [perks, setPerks] = useState([]);
  const [transport, setTransport] = useState('Bus');
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Choose an image first');
      return;
    }
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) {
      toast.error('IMGBB key missing — set NEXT_PUBLIC_IMGBB_KEY in .env');
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedUrl(data.data.url);
        toast.success('Image uploaded');
      } else {
        toast.error(data.error?.message || 'Upload failed');
      }
    } catch (e) {
      toast.error('Upload failed: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const togglePerk = (a) =>
    setPerks((prev) => (prev.includes(a) ? prev.filter((p) => p !== a) : [...prev, a]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedUrl) {
      toast.error('Upload an image first');
      return;
    }
    const fd = new FormData(e.target);
    const payload = {
      title: fd.get('title'),
      origin: fd.get('origin'),
      destination: fd.get('destination'),
      transportType: transport,
      price: Number(fd.get('price')),
      quantity: Number(fd.get('quantity')),
      departureSchedule: fd.get('departureSchedule'),
      amenities: perks,
      bannerUrl: uploadedUrl,
      vendorName: user?.name,
      vendorEmail: user?.email,
    };
    if (!payload.title || !payload.origin || !payload.destination || !payload.departureSchedule) {
      toast.error('Fill all required fields');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/tickets', payload);
      toast.success('Ticket submitted for admin review');
      router.push('/dashboard/vendor/my-tickets');
    } catch (err) {
      toast.error(err.payload?.message || 'Failed to create ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">Add New Ticket</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        New tickets enter the queue as <strong>pending</strong> until an admin approves them.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="md:col-span-2">
          <Label>Title</Label>
          <Input name="title" placeholder="e.g. Green Line — Dhaka → Cox's Bazar" required />
        </div>
        <div>
          <Label>From (Origin)</Label>
          <Input name="origin" placeholder="Dhaka" required />
        </div>
        <div>
          <Label>To (Destination)</Label>
          <Input name="destination" placeholder="Cox's Bazar" required />
        </div>

        <div className="md:col-span-2">
          <Label>Transport Type</Label>
          <div className="grid grid-cols-4 gap-2">
            {['Bus', 'Train', 'Launch', 'Plane'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTransport(t)}
                className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-sm font-bold border transition ${
                  transport === t
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600'
                }`}
              >
                <span className="text-lg">
                  {t === 'Bus' && <FaBus />}
                  {t === 'Train' && <FaTrain />}
                  {t === 'Launch' && <FaShip />}
                  {t === 'Plane' && <FaPlane />}
                </span>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Departure Date &amp; Time</Label>
          <Input type="datetime-local" name="departureSchedule" required />
        </div>

        <div>
          <Label>Price (BDT)</Label>
          <Input type="number" name="price" min="0" placeholder="1200" required />
        </div>
        <div>
          <Label>Quantity (Total Seats)</Label>
          <Input type="number" name="quantity" min="1" placeholder="40" required />
        </div>

        <div className="md:col-span-2">
          <Label>Amenities / Perks</Label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => togglePerk(a)}
                className={`text-xs font-bold px-3 py-2 rounded-full transition ${
                  perks.includes(a)
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>Cover Image</Label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-48 aspect-video bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <FaUpload size={28} />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-50 file:text-violet-700"
              />
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={uploading || !imageFile}
                className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2"
              >
                {uploading ? <Spinner size={16} /> : <FaUpload />} Upload to ImgBB
              </button>
              {uploadedUrl && (
                <p className="text-xs text-emerald-600">Image ready ✓</p>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            Posting as <strong>{user?.name}</strong> ({user?.email})
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-bold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            {submitting ? <Spinner size={16} /> : null} Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
}

function Label({ children }) {
  return (
    <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-1.5">
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-900 dark:text-white"
    />
  );
}
