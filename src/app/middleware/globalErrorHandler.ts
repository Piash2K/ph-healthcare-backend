/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z, { ZodError } from "zod";
import { TErrorResponse, TErrorSource } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import { env } from "node:process";
import AppError from "../errorHelpers/AppError";
import path from "node:path";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler:", err);
  }

  let errorSources: TErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let stack: string | undefined = undefined; 

  if (err instanceof z.ZodError) {
    const simplifiedError= handleZodError(err);
    statusCode=simplifiedError.statusCode as number;
    message= simplifiedError.message;
    errorSources.push(...simplifiedError.errorSources!)
  }
  else if(err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources=[
      {
        path:"",
        message: err.message,
      }
    ]
  } 
  //this else if block must be in the last part of any error handler
  else if (err instanceof Error) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message || "Internal Server Error";
    stack= err.stack;
    errorSources=[
      {
        path:"",
        message: err.message,
      }
    ]
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    stack:envVars.NODE_ENV === "development" ? stack : undefined,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  };
  res.status(statusCode).json(errorResponse);
};
