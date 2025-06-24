import { Worker } from 'bullmq';
import { connection } from './connection';

export const worker = new Worker(
  'foo',
  async (job) => {
    console.log(`Processing Job ${job.id}:`, job.data);
    return `Processed: ${JSON.stringify(job.data)}`;
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} failed with ${err.message}`);
});
