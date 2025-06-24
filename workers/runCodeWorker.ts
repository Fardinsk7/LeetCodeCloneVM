import { connection } from "../bullmq/connection";
import { Worker } from "bullmq";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { generatePythonRunner } from "../helper/generateRunner";

export const runCodeWorker = new Worker(
    "runCode",// Queue name
    async (job) => {
        console.log("Job Data: ", job.data);
        const { code, problmeId, testCases} = job.data;

        const solutionfile = "solution.py";
        const runnerFile = "runner.py";
    
        // const dirPath = path.join(__dirname, "code");
        const dirPath = path.join("/tmp/code", job?.id?.toString() || "default");


        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
    
        const solutionFilePath = path.join(dirPath, solutionfile);
        const runnerFilePath = path.join(dirPath, runnerFile);
    
        fs.writeFileSync(solutionFilePath, code);
        fs.writeFileSync(
          runnerFilePath,
          generatePythonRunner({ testCases, timeOut: 2 })
        );
    const output = await new Promise<string>((resolve, reject) => {
      const dockerProcess = spawn("docker", [
        "run",
        "--rm",
        "-i",
        "-w",
        "/app",
        "-v",
        `${dirPath}:/app`,
        "python:3",
        "python",
        "runner.py",
      ]);

      let stdout = "";
      let stderr = "";

      dockerProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      dockerProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      dockerProcess.on("close", (code) => {
        fs.rmSync(dirPath, { recursive: true, force: true }); // cleanup

        if (code !== 0 || stderr) {
          console.error("Error running docker:", stderr);
          reject(new Error(stderr || `Process exited with code ${code}`));
        } else {
          resolve(stdout);
        }
      });
    });

    return output;


    },
    { connection } // Connection to Redis
)

runCodeWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

runCodeWorker.on('failed', (job, err) => {
  console.log(`❌ Job ${job?.id} failed with ${err.message}`);
});

