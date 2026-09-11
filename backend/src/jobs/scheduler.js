const cron = require('node-cron');
const {
  runReminderScan,
  runMedicationScan,
  runTestScan,
  markMissedAppointments
} = require('../services/reminder.service');

// Checkup scan — every hour
cron.schedule('0 * * * *', () => {
  console.log('[cron] checkup scan');
  runReminderScan();
});

// Medication scan — every 15 minutes
cron.schedule('*/15 * * * *', () => {
  console.log('[cron] medication scan');
  runMedicationScan();
});

// Overdue test scan — every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('[cron] test scan');
  runTestScan();
});

// Missed appointments — every hour at :30
cron.schedule('30 * * * *', () => {
  console.log('[cron] missed appointment sweep');
  markMissedAppointments();
});

// Kick everything once on startup (after 5s so DB is reachable)
setTimeout(async () => {
  await runReminderScan();
  await runMedicationScan();
  await runTestScan();
  await markMissedAppointments();
}, 5000);

console.log('[cron] scheduler started');