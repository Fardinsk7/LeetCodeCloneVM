import mongoose from "mongoose";
import { IProblem, IProblemServices } from "../problems.type";

class ProblemServices implements IProblemServices{
    constructor(
        private problemDb: mongoose.Model<IProblem>
    ){}

    createProblem = async (problem:IProblem) => {
        return await this.problemDb.create(problem);
    }

    findProblem = async (problemId: string) => {
        return await this.problemDb.findById(problemId)
    }

}

export default ProblemServices;