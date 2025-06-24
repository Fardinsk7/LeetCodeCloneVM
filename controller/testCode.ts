import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";
import { exec, spawn } from "child_process";
import { generatePythonRunner } from "../helper/generateRunner";

class TestCodeController {
  testCode = async (req: Request, res: Response, next: NextFunction) => {
    const { code, input } = req.body;

    try {
      const fileName = `code_${Date.now()}.py`;

      const dirPath = path.join(__dirname, "code");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
      const filePath = path.join(dirPath, fileName);

      fs.writeFileSync(filePath, code);

      const dockerProcess = spawn("docker", [
        "run",
        "--rm",
        "-i",
        "-v",
        `${filePath}:/app/${fileName}`,
        "python:3",
        "python",
        `runner.py`,
      ]);

      let output = "";
      let errorOutput = "";

      dockerProcess.stdin.write(input);
      dockerProcess.stdin.end();

      dockerProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      dockerProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      dockerProcess.on("close", (code) => {
        fs.unlinkSync(filePath); // Clean up

        if (code !== 0) {
          return res.status(500).json({ error: errorOutput });
        }

        res.json({ output });
      });
    } catch (error) {
      next(createHttpError(500, "Something went wrong"));
    }
  };

  testPythonCode = async (req: Request, res: Response, next: NextFunction) => {
    const { code, input } = req.body;
    const testCases = [
      {
        input: "2\n3",
        expectedOutput: "5\n",
      },
      {
        input: "5\n10",
        expectedOutput: "15\n",
      },
      {
        input: "7\n8",
        expectedOutput: "15\n",
      },
    ];
    const solutionfile = "solution.py";
    const runnerFile = "runner.py";

    const dirPath = path.join(__dirname, "code");
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
    try {
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

      let output = "";
      let errorOutput = "";

      dockerProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      dockerProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      console.log("STDOUT:", output);
      console.log("STDERR:", errorOutput);

      dockerProcess.on("close", (code) => {
        if (code !== 0 && errorOutput) {
          return res.status(500).json({ error: errorOutput });
        }

        fs.rmSync(dirPath, { recursive: true, force: true }); // Clean up the directory

        res.json({ output });
      });
    } catch (error) {
      fs.rmSync(dirPath, { recursive: true, force: true }); // Clean up the directory
      next(createHttpError(500, "Something went wrong"));
    }
  };

}

export default TestCodeController;
