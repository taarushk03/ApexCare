"use client";

import React, { useState } from 'react';

// Mock Reports Data
const REPORTS = [
  { id: 'REP-1042', patientName: 'John Doe', type: 'Blood Test Results', date: 'May 8, 2026', size: '2.4 MB', icon: 'file' },
  { id: 'REP-1043', patientName: 'Sarah Jenkins', type: 'MRI Scan', date: 'May 5, 2026', size: '45.1 MB', icon: 'image' },
  { id: 'REP-1044', patientName: 'Alice Cooper', type: 'ECG Report', date: 'May 2, 2026', size: '1.8 MB', icon: 'file' },
  { id: 'REP-1045', patientName: 'Michael Chang', type: 'X-Ray Chest', date: 'April 28, 2026', size: '12.5 MB', icon: 'image' },
  { id: 'REP-1046', patientName: 'Emma Watson', type: 'Prescription History', date: 'April 20, 2026', size: '0.5 MB', icon: 'file' },
];

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const filteredReports = REPORTS.filter(rep => 
    rep.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rep.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('Mock upload successful!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Reports</h1>
          <p className="text-slate-500 text-sm mt-1">Manage, upload, and view clinical test results.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <h2 className="text-lg font-bold text-slate-800">Upload New Report</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">Supported formats: PDF, JPG, PNG, DICOM (Max 50MB)</p>
            
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:bg-slate-50 transition-colors cursor-pointer mb-4">
              <p className="font-bold text-slate-600 text-sm">Click to browse or drag file here</p>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 ${
                isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Uploading...
                </>
              ) : 'Upload Document'}
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search reports by patient or type..."
                  className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                Recent
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div className="space-y-3">
                {filteredReports.length > 0 ? filteredReports.map((report) => (
                  <div key={report.id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        report.icon === 'image' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {report.icon === 'image' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{report.type}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{report.patientName} • {report.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-16 sm:ml-0 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="block text-xs font-bold text-slate-700">{report.date}</span>
                        <span className="block text-xs text-slate-400">{report.size}</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="py-12 text-center text-slate-500 border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="font-bold text-slate-700 text-lg">No reports found</p>
                    <p className="text-sm">Try a different search term.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
