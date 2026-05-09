export interface Doctor {
  id: number;
  name: string;
  email: string; // Used to identify logged-in doctor
  specialty: string; // Mapped from specialization
  experience: string;
  rating: string;
  image: string;
  bio: string;
  fee: number;
  availableTime: string[];
  qualifications: string;
  clinicAddress: string;
  availableDays: string;
  phone?: string;
}

export interface PatientProfile {
  name: string;
  email: string;
  dob: string;
  bloodGroup: string;
  allergies: string;
  emergencyContact: string;
  height: string;
  weight: string;
  address: string;
}

export interface Appointment {
  id: number;
  patientEmail: string;
  patientName: string; // Storing this directly for easier rendering in doctor portal
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'In-Person' | 'Video';
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
  condition?: string;
  phone?: string;
}

export const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Smith',
    email: 'dr.sarah@apexcare.com',
    specialty: 'Cardiologist',
    experience: '12 years exp.',
    rating: '4.9',
    image: 'SS',
    bio: 'Specialist in interventional cardiology and cardiovascular disease management.',
    fee: 50,
    availableTime: ['10:30 AM', '02:15 PM', '04:45 PM'],
    qualifications: 'MD, FACC',
    clinicAddress: 'ApexCare Main Hospital, Wing A, Room 102',
    availableDays: 'Mon, Wed, Fri'
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'dr.michael@apexcare.com',
    specialty: 'Neurologist',
    experience: '8 years exp.',
    rating: '4.8',
    image: 'MC',
    bio: 'Expert in neurological disorders, including migraine and epilepsy treatments.',
    fee: 65,
    availableTime: ['09:00 AM', '11:30 AM', '03:00 PM'],
    qualifications: 'MD, PhD',
    clinicAddress: 'ApexCare Main Hospital, Wing B, Room 204',
    availableDays: 'Tue, Thu, Sat'
  },
  {
    id: 3,
    name: 'Dr. Emily Johnson',
    email: 'dr.emily@apexcare.com',
    specialty: 'Pediatrician',
    experience: '15 years exp.',
    rating: '5.0',
    image: 'EJ',
    bio: 'Dedicated to providing comprehensive healthcare for children from birth to adolescence.',
    fee: 45,
    availableTime: ['01:00 PM', '04:30 PM', '06:15 PM'],
    qualifications: 'MD, FAAP',
    clinicAddress: 'ApexCare Main Hospital, Wing C, Room 301',
    availableDays: 'Mon, Tue, Wed, Thu, Fri'
  },
  {
    id: 4,
    name: 'Dr. Robert Wilson',
    email: 'dr.robert@apexcare.com',
    specialty: 'Orthopedic',
    experience: '10 years exp.',
    rating: '4.7',
    image: 'RW',
    bio: 'Focuses on sports injuries, joint replacements, and spinal health.',
    fee: 60,
    availableTime: ['10:00 AM', '12:45 PM', '05:30 PM'],
    qualifications: 'MD, Ortho',
    clinicAddress: 'ApexCare Main Hospital, Wing D, Room 405',
    availableDays: 'Mon, Wed, Fri'
  },
  {
    id: 5,
    name: 'Dr. Lisa Park',
    email: 'dr.lisa@apexcare.com',
    specialty: 'Dermatologist',
    experience: '7 years exp.',
    rating: '4.9',
    image: 'LP',
    bio: 'Specializes in clinical and cosmetic dermatology, including skin cancer screening.',
    fee: 55,
    availableTime: ['11:00 AM', '01:30 PM', '04:00 PM'],
    qualifications: 'MD, FAAD',
    clinicAddress: 'ApexCare Skin Clinic, Room 12',
    availableDays: 'Tue, Thu'
  },
  {
    id: 6,
    name: 'Dr. James Miller',
    email: 'dr.james@apexcare.com',
    specialty: 'General Physician',
    experience: '20 years exp.',
    rating: '4.9',
    image: 'JM',
    bio: 'Providing holistic primary care and chronic disease management for families.',
    fee: 40,
    availableTime: ['08:30 AM', '12:00 PM', '03:30 PM'],
    qualifications: 'MD, General Medicine',
    clinicAddress: 'ApexCare Primary Center, Room 5',
    availableDays: 'Mon, Tue, Wed, Thu, Fri'
  },
];

// Helpers
export const initSharedData = () => {
  if (typeof window === 'undefined') return;
  const docs = localStorage.getItem('apexcare_doctors');
  if (!docs) {
    localStorage.setItem('apexcare_doctors', JSON.stringify(DEFAULT_DOCTORS));
  }
};

export const getSharedDoctors = (): Doctor[] => {
  if (typeof window === 'undefined') return DEFAULT_DOCTORS;
  const docs = localStorage.getItem('apexcare_doctors');
  return docs ? JSON.parse(docs) : DEFAULT_DOCTORS;
};

export const saveSharedDoctors = (doctors: Doctor[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apexcare_doctors', JSON.stringify(doctors));
};

export const getSharedAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];
  const appts = localStorage.getItem('apexcare_appointments');
  return appts ? JSON.parse(appts) : [];
};

export const saveSharedAppointment = (appointment: Appointment) => {
  if (typeof window === 'undefined') return;
  const existing = getSharedAppointments();
  localStorage.setItem('apexcare_appointments', JSON.stringify([...existing, appointment]));
};

export const updateSharedAppointment = (appointment: Appointment) => {
  if (typeof window === 'undefined') return;
  const existing = getSharedAppointments();
  const updated = existing.map(a => a.id === appointment.id ? appointment : a);
  localStorage.setItem('apexcare_appointments', JSON.stringify(updated));
};

export const deleteSharedAppointment = (id: number) => {
    if (typeof window === 'undefined') return;
    const existing = getSharedAppointments();
    const updated = existing.filter(a => a.id !== id);
    localStorage.setItem('apexcare_appointments', JSON.stringify(updated));
};

export const getPatientProfile = (email: string): PatientProfile => {
  if (typeof window === 'undefined') return {} as PatientProfile;
  const key = `apexcare_patient_profile_${email}`;
  const profile = localStorage.getItem(key);
  return profile ? JSON.parse(profile) : {
    name: '',
    email: email,
    dob: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: '',
    height: '',
    weight: '',
    address: ''
  };
};

export const savePatientProfile = (email: string, profile: PatientProfile) => {
  if (typeof window === 'undefined') return;
  const key = `apexcare_patient_profile_${email}`;
  localStorage.setItem(key, JSON.stringify(profile));
};
