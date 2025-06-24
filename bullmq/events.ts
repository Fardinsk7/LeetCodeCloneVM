import { QueueEvents } from 'bullmq';

const queueEvents = new QueueEvents('foo');

queueEvents.on('waiting', ({ jobId }) => {
  console.log(`⏳ Job ${jobId} is waiting`);
});

queueEvents.on('active', ({ jobId, prev }) => {
  console.log(`🚀 Job ${jobId} is active (was ${prev})`);
});

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`✅ Job ${jobId} completed with result: ${returnvalue}`);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.log(`❌ Job ${jobId} failed: ${failedReason}`);
});

queueEvents.on('progress', ({ jobId, data }, timestamp) => {
  console.log(`📈 Job ${jobId} progress: ${data} at ${timestamp}`);
});
