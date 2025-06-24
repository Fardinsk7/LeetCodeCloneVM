import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { IProblem } from "../problems.type";
import createHttpError from "http-errors";


const createProblemSchemaValidator = async (req:Request, res:Response, next:NextFunction)=>{
    const schemaValidator = Joi.object<IProblem>({
        problem_name: Joi.string().required(),
        problem_description: Joi.string().required(),
        example_problem: Joi.object({
            input: Joi.string().required(),
            output: Joi.string().required(),
            explanation: Joi.string().optional()
        }).optional(),
        right_cases: Joi.array().items(
            Joi.object({
                input: Joi.string().required(),
                output: Joi.string().required(),
                gotOutput: Joi.optional(),
                expectedOutput: Joi.string().required()
            })
        ).required(),
        level_of_problem: Joi.string().valid("easy", "medium", "hard").required(),
        code_of_problem: Joi.optional().default(""),
        test_cases: Joi.array().items(
            Joi.object({
                input: Joi.string().required(),
                expectedOutput: Joi.string().required()
            })
        ).required(),
        solved_or_not: Joi.boolean().optional().default(false)
    })

    const { error } = schemaValidator.validate(req.body);
    if (error) {
        return next(createHttpError(400, error.message));
    }

    next();
}

export default createProblemSchemaValidator;