import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../modules/auth/user.model';
import { Doctor } from '../modules/doctor/doctor.model';
import { Patient } from '../modules/patient/patient.model';

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Patient.deleteMany({}),
  ]);

  await User.create({
    name: 'Dr. Admin Coordinator',
    email: 'admin@careguide.com',
    password: 'Admin@123',
    role: 'admin',
  });

  const doctorSeeds = [
    { name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', hospital: 'Metro General Hospital', phone: '+1-555-0101', email: 'sarah.jenkins@careguide.com', createdAt: daysAgo(12) },
    { name: 'Dr. Marcus Vance', specialization: 'Neurology', hospital: 'St. Jude Medical Center', phone: '+1-555-0102', email: 'marcus.vance@careguide.com', createdAt: daysAgo(11) },
    { name: 'Dr. Elena Rostova', specialization: 'Orthopedics', hospital: 'City Care Clinic', phone: '+1-555-0103', email: 'elena.rostova@careguide.com', createdAt: daysAgo(10) },
    { name: 'Dr. David Kim', specialization: 'Pediatrics', hospital: 'Metro General Hospital', phone: '+1-555-0104', email: 'david.kim@careguide.com', createdAt: daysAgo(9) },
    { name: 'Dr. Priya Patel', specialization: 'Dermatology', hospital: 'Sunrise Health Hub', phone: '+1-555-0105', email: 'priya.patel@careguide.com', createdAt: daysAgo(8) },
    { name: 'Dr. Omar Hassan', specialization: 'Cardiology', hospital: 'Heart & Vascular Institute', phone: '+1-555-0106', email: 'omar.hassan@careguide.com', createdAt: daysAgo(7) },
    { name: 'Dr. Claire Bennett', specialization: 'Endocrinology', hospital: 'St. Jude Medical Center', phone: '+1-555-0107', email: 'claire.bennett@careguide.com', createdAt: daysAgo(6) },
    { name: 'Dr. Lucas Meyer', specialization: 'Pulmonology', hospital: 'City Care Clinic', phone: '+1-555-0108', email: 'lucas.meyer@careguide.com', createdAt: daysAgo(5) },
    { name: 'Dr. Aisha Rahman', specialization: 'General Medicine', hospital: 'Sunrise Health Hub', phone: '+1-555-0109', email: 'aisha.rahman@careguide.com', createdAt: daysAgo(4) },
    { name: 'Dr. Ethan Brooks', specialization: 'Neurology', hospital: 'Metro General Hospital', phone: '+1-555-0110', email: 'ethan.brooks@careguide.com', createdAt: daysAgo(3) },
    { name: 'Dr. Hannah Cho', specialization: 'Pediatrics', hospital: 'Sunrise Health Hub', phone: '+1-555-0111', email: 'hannah.cho@careguide.com', createdAt: daysAgo(2) },
    { name: 'Dr. Noah Alvarez', specialization: 'Orthopedics', hospital: 'Heart & Vascular Institute', phone: '+1-555-0112', email: 'noah.alvarez@careguide.com', createdAt: daysAgo(1) },
  ];

  const doctors = await Doctor.insertMany(doctorSeeds);

  const conditions = [
    'Hypertension',
    'Diabetes',
    'Cardiology',
    'Respiratory',
    'Orthopedic',
    'Neurological',
    'General',
  ];

  const patientNames = [
    'Liam Carter', 'Sophia Martinez', 'Noah Thompson', 'Olivia Chen', 'Mason Rivera',
    'Ava Robinson', 'Ethan Walker', 'Isabella Young', 'Logan Hall', 'Mia Allen',
    'Jacob King', 'Charlotte Wright', 'Lucas Scott', 'Amelia Green', 'Benjamin Adams',
    'Harper Baker', 'Elijah Nelson', 'Evelyn Hill', 'James Moore', 'Abigail Taylor',
    'Alexander White', 'Emily Harris', 'Michael Clark', 'Elizabeth Lewis', 'Daniel Lee',
    'Sofia Walker', 'Matthew Perez', 'Avery Sanchez',
  ];

  const patientSeeds = patientNames.map((name, idx) => {
    const doctor = doctors[idx % doctors.length];
    const genders: Array<'Male' | 'Female' | 'Other'> = ['Male', 'Female', 'Other'];
    return {
      name,
      age: 22 + ((idx * 7) % 55),
      gender: genders[idx % 2 === 0 ? 0 : 1],
      phone: `+1-555-02${String(idx + 10).padStart(2, '0')}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      condition: conditions[idx % conditions.length],
      notes: `Scheduled follow-up with ${doctor.name}`,
      doctorId: doctor._id,
      createdAt: daysAgo(idx % 12),
    };
  });

  await Patient.insertMany(patientSeeds);

  console.log('Seed completed: 1 admin, 12 doctors, 28 patients created.');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

