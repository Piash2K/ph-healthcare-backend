/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import status from "http-status";
import z, { ZodError } from "zod";
import { error } from "node:console";

interface TErrorSource {
  path: string;
  message: string;
}

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from global error handler:", err);
  }

  const errorSources: TErrorSource[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";

  if (err instanceof z.ZodError) {
    statusCode = status.BAD_REQUEST;
    message = "Zod Validation Error";

    err.issues.forEach((issue) => {
      errorSources.push({
        path:
          issue.path.length > 1
            ? issue.path.join("=>")
            : issue.path[0].toString(),
        message: issue.message,
      });
    });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : undefined,
  });
};
