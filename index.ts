import express, { RequestHandler } from 'express';
import TestCodeController from './controller/testCode';
import 'dotenv/config';
import dbConnection from './db/connect';
import createProblemSchemaValidator from './validators/createProblem.validator';
import ProblemController from './controller/problemController';
import ProblemServices from './services/problemServices';
import ProblemModel from './model/ProblemModel';
import submitProblemSchemaValidator from './validators/submitProblem.validator';
import './workers/runCodeWorker';

const app = express();
app.use(express.json());

const testCodeController = new TestCodeController()

const problemServices = new ProblemServices(ProblemModel);
const problemController = new ProblemController(problemServices);

app.get('/',(req,res)=>{
    res.status(200).send("Hello")
})

app.post("/test-code", testCodeController.testPythonCode);

app.post("/create-problem", createProblemSchemaValidator, problemController.createProblem as RequestHandler );

app.post("/submit",submitProblemSchemaValidator, problemController.submitProblem as RequestHandler);


dbConnection().then(() => {
    app.listen(5501, ()=>{
        console.log("Server is listening on port http://localhost:5501");
    })
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
