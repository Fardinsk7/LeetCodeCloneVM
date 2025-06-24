import { Queue } from 'bullmq';
import { connection } from './connection';

export const myQueue = new Queue('foo', { connection });

export async function addJobs() {
  await myQueue.add('myJobName', { foo: 'bar' });
  await myQueue.add('myJobName', { qux: 'baz' });
}
