import mongoose from "mongoose";
import { IProblem, IProblemServices } from "../problems.type";
import { Request, Response } from "express";
import { Queue, QueueEvents } from "bullmq";
import { connection } from "../bullmq/connection";

export const myQueue = new Queue('runCode', { connection });
export const myQueueEvents = new QueueEvents('runCode', { connection });

class ProblemController {
    constructor(
        private problemService: IProblemServices
    ){}

    createProblem = async (req: Request, res: Response) => {
        const problemData = req.body;
        try {
            const newProblem = await this.problemService.createProblem(problemData);
            if (!newProblem) {
                return res.status(400).json({ message: "Failed to create problem" });
            }

            res.status(201).json({ message: "Problem created successfully", problem: newProblem });
        } catch (error) {
                console.error("Error while creating problem:", error); // ✅ log to terminal

            res.status(500).json({ message: "Error creating problem", error });
        }
    }

    submitProblem = async (req: Request, res: Response) => {
        const { problemId, code } = req.body;

        if (!problemId || !code) {
            return res.status(400).json({ message: "Problem ID, User ID, and code are required" });
        }

        try {

            const problem = await this.problemService.findProblem(problemId);

            if (!problem) {
                return res.status(404).json({ message: "Problem not found" });
            }

            console.log("Problem found:", problem?.test_cases);
            // Add the code to the queue for processing
            const job = await myQueue.add('runCode',{
                problemId: problem._id?.toString(),
                code: code,
                testCases: problem.test_cases,
            })
            const result = await job.waitUntilFinished(myQueueEvents);
            
            const outputData = JSON.parse(result as string);

            if(outputData?.success === false){
                return res.status(400).json({ 
                    success: false,
                    message: "Code execution failed",
                    error: outputData.error
                });
            }
            

            res.status(200).json({ 
                success: true,
                message: "Problem submitted successfully",
                output: outputData.result,
            });
        } catch (error) {
            console.error("Error while submitting problem:", error);
            res.status(500).json({ message: "Error submitting problem", error });
        }
    } 
}

export default ProblemController;