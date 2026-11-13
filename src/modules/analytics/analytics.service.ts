import { Doctor } from '../doctor/doctor.model';
import { Patient } from '../patient/patient.model';
import { buildDateRangeFilter } from '../../utils/pagination';

export const getDashboardAnalytics = async (query: { startDate?: string; endDate?: string }) => {
  const dateRange = buildDateRangeFilter(query.startDate, query.endDate);
  const dateMatch = dateRange ? { createdAt: dateRange } : {};

  const [
    totalDoctors,
    totalPatients,
    specializations,
    patientsPerDoctor,
    conditionDistribution,
    doctorDailyStats,
    patientDailyStats,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Doctor.distinct('specialization'),
    Doctor.aggregate<{ _id: string; name: string; specialization: string; patientCount: number }>([
      {
        $lookup: {
          from: 'patients',
          localField: '_id',
          foreignField: 'doctorId',
          as: 'patients',
        },
      },
      {
        $project: {
          name: 1,
          specialization: 1,
          patientCount: { $size: '$patients' },
        },
      },
      { $sort: { patientCount: -1, name: 1 } },
      { $limit: 10 },
    ]),
    Patient.aggregate<{ _id: string; count: number }>([
      { $match: dateMatch },
      { $group: { _id: '$condition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    Doctor.aggregate<{ _id: string; count: number }>([
      { $match: dateMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Patient.aggregate<{ _id: string; count: number }>([
      { $match: dateMatch },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const dateMap = new Map<string, { date: string; doctors: number; patients: number }>();

  for (const item of doctorDailyStats) {
    dateMap.set(item._id, { date: item._id, doctors: item.count, patients: 0 });
  }

  for (const item of patientDailyStats) {
    const existing = dateMap.get(item._id);
    if (existing) {
      existing.patients = item.count;
    } else {
      dateMap.set(item._id, { date: item._id, doctors: 0, patients: item.count });
    }
  }

  const dateStats = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    summary: {
      totalDoctors,
      totalPatients,
      avgPatientsPerDoctor:
        totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(1)) : 0,
      totalSpecializations: specializations.length,
    },
    patientsPerDoctor: patientsPerDoctor.map((d) => ({
      doctorId: String(d._id),
      name: d.name,
      specialization: d.specialization,
      patientCount: d.patientCount,
    })),
    conditionDistribution: conditionDistribution.map((c) => ({
      condition: c._id,
      count: c.count,
    })),
    dateStats,
  };
};

