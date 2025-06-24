import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import Joi from "joi";


const submitProblemSchemaValidator = async (req:Request, res:Response, next:NextFunction)=>{
    const schemaValidator = Joi.object({
        problemId: Joi.string().required(),
        code: Joi.string().required(),
    })

    const { error } = schemaValidator.validate(req.body);
    if (error) {
        return next(createHttpError(400, error.message));
    }

    next();
}

export default submitProblemSchemaValidator;