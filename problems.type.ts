export interface IExampleProblem {
  input: string;
  output: string;
  explanation?: string;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
}

export interface IRightCases {
  input: string;
  output: string;
  gotOutput?: string;
  expectedOutput: string;
}

export interface IProblem {
  _id?: string;
  problem_name: string;
  problem_description: string;
  example_problem: IExampleProblem;
  solved_or_not?: boolean;
  right_cases: string;
  level_of_problem: "easy" | "medium" | "hard";
  code_of_problem: string;
  test_cases: ITestCase[];
}

export interface IProblemServices {
  createProblem : (problem: IProblem) => Promise<IProblem>;
  findProblem: (problemId: string) => Promise<IProblem | null>;
}
