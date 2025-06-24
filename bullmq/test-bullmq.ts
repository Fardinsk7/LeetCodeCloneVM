import './events';  // Just to start listening
import './worker';  // Start the worker
import { addJobs } from './queue'; // Add jobs

(async () => {
  await addJobs();
})();
