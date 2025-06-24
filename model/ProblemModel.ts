import mongoose, { Schema } from "mongoose";
import { IExampleProblem, IProblem, IRightCases, ITestCase } from "../problems.type";

const ExampleProblemSchema = new Schema<IExampleProblem>(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String }, // optional
  },
  { _id: false }
);

const RightCasesSchema = new Schema<IRightCases>(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    gotOutput: { type: String },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

// Test Case Schema
const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

const ProblemSchema: Schema = new Schema(
  {
    problem_name: {
      type: String,
      required: true,
    },
    problem_description: {
      type: String,
      required: true,
    },
    example_problem: {
      type: [ExampleProblemSchema],
      required: true,
    },
    solved_or_not: {
      type: Boolean,
      default: false,
    },
    right_cases: {
      type: [RightCasesSchema],
      required: true,
    },
    level_of_problem: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    code_of_problem: {
      type: String,
      default: "",
    },
    test_cases: {
      type: [TestCaseSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProblemModel = mongoose.model<IProblem>("Problem", ProblemSchema);
export default ProblemModel;
