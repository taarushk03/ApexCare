import { createConnection } from 'typeorm';
import { Appointment } from './src/appointments/entities/appointment.entity';
import { Availability } from './src/doctors/entities/availability.entity';
import { User } from './src/users/entities/user.entity';
import { Doctor } from './src/doctors/entities/doctor.entity';

async function cleanup() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'taarush@123', // From seed file
    database: 'apexcare',
    entities: [Appointment, Availability, User, Doctor],
  });

  console.log('--- Cleaning up Appointments ---');
  const apptRepo = connection.getRepository(Appointment);
  const appointments = await apptRepo.find({ order: { appointmentDate: 'ASC', id: 'ASC' } });
  const seenAppts = new Set<string>();
  let cancelledCount = 0;

  for (const app of appointments) {
    if (app.status === 'Cancelled') continue;
    const key = `${app.doctorId}-${app.patientId}-${new Date(app.appointmentDate).toISOString()}`;
    if (seenAppts.has(key)) {
      app.status = 'Cancelled';
      await apptRepo.save(app);
      cancelledCount++;
    } else {
      seenAppts.add(key);
    }
  }
  console.log(`Cancelled ${cancelledCount} duplicate appointments.`);

  console.log('--- Cleaning up Blocked Slots ---');
  const availRepo = connection.getRepository(Availability);
  const blocks = await availRepo.find({ where: { type: 'blocked' }, order: { date: 'ASC', startTime: 'ASC', id: 'ASC' } });
  const seenBlocks = new Set<string>();
  let deletedBlocks = 0;

  for (const block of blocks) {
    const key = `${block.doctorId}-${block.date}-${block.startTime}`;
    if (seenBlocks.has(key)) {
      await availRepo.remove(block);
      deletedBlocks++;
    } else {
      seenBlocks.add(key);
    }
  }
  console.log(`Deleted ${deletedBlocks} duplicate blocked slots.`);

  await connection.close();
  console.log('Cleanup complete.');
}

cleanup().catch(err => console.error(err));
