'use client';

import { useState, useEffect } from 'react';

interface Patient {
  id?: number;
  fullName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  email: string;
  emergencyCase: boolean;
}

export default function PatientsTestPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Patient>({
    fullName: '',
    age: 0,
    gender: 'Male',
    phoneNumber: '',
    email: '',
    emergencyCase: false,
  });

  const API_URL = 'http://localhost:3001/patients';

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create patient');
      }

      // Clear form and refresh list
      setFormData({
        fullName: '',
        age: 0,
        gender: 'Male',
        phoneNumber: '',
        email: '',
        emergencyCase: false,
      });
      fetchPatients();
      alert('Patient created successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 border-b pb-4">
        Patient Backend Integration Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Creation Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-semibold mb-6 text-slate-700">Create New Patient</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number (10 digits)</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="1234567890"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="emergencyCase"
                checked={formData.emergencyCase}
                onChange={handleChange}
                id="emergencyCase"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="emergencyCase" className="text-sm font-medium text-slate-600">
                Emergency Case?
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
            >
              Add Patient to DB
            </button>
          </form>
        </section>

        {/* Patient List */}
        <section>
          <h2 className="text-xl font-semibold mb-6 text-slate-700 flex items-center justify-between">
            Patient List
            <button 
              onClick={fetchPatients}
              className="text-xs text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </h2>

          {loading ? (
            <div className="text-slate-400 italic">Loading patients...</div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">
              Error: {error}
            </div>
          ) : patients.length === 0 ? (
            <div className="text-slate-400 italic bg-slate-50 p-8 rounded-xl border border-dashed text-center">
              No patients found in PostgreSQL.
            </div>
          ) : (
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
              {patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`p-4 rounded-xl border shadow-sm transition-all ${
                    patient.emergencyCase ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800">{patient.fullName}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      ID: {patient.id}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1 text-sm">
                    <span className="text-slate-500">Age: <span className="text-slate-700 font-medium">{patient.age}</span></span>
                    <span className="text-slate-500">Gender: <span className="text-slate-700 font-medium">{patient.gender}</span></span>
                    <span className="text-slate-500 col-span-2">Phone: <span className="text-slate-700 font-medium">{patient.phoneNumber}</span></span>
                    <span className="text-slate-500 col-span-2 truncate">Email: <span className="text-slate-700 font-medium">{patient.email}</span></span>
                  </div>
                  {patient.emergencyCase && (
                    <div className="mt-3 text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                      Emergency Priority
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
