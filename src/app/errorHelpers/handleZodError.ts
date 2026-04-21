import z from 'zod';
import status from "http-status";
import { TErrorResponse, TErrorSource } from '../interfaces/error.interface';

export const handleZodError=(err: z.ZodError): TErrorResponse=>{
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";

    const errorSources: TErrorSource[]=[]

    err.issues.forEach((issue) => {
      errorSources.push({
        path:
          issue.path.length > 1
            ? issue.path.join("=>")
            : issue.path[0].toString(),
        message: issue.message,
      });
    });
    return {
        success: false,
        message,
        errorSources,
        statusCode
    }
}