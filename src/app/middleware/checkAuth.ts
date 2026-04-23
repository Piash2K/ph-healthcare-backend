/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { CookieUtils } from "../utils/cookie";
import { prisma } from "../lib/prisma";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { JwtUtils } from "../utils/jwt";
import { envVars } from "../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = CookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );
      if (!sessionToken) {
        throw new Error("Unauthorized: Session token is missing");
      }
      if (sessionToken) {
        const sessionExits = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });
        if (sessionExits && sessionExits.user) {
          const user = sessionExits.user;
          const now = new Date();
          const expiresAt = new Date(sessionExits.expiresAt);
          const createdAt = new Date(sessionExits.createdAt);

          const sessionLifeTieme = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();
          const percentRemaining = (timeRemaining / sessionLifeTieme) * 100;
          if (percentRemaining < 20) {
            res.setHeader("X-Refresh-Session-Token", "true");
            res.setHeader(
              "X-Session-Token-Expires-In",
              sessionExits.expiresAt.toISOString(),
            );
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
            console.log("Session expiring soon");
          }
          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED
          ) {
            throw new  AppError(status.UNAUTHORIZED, "Forbidden: Your account is blocked or deleted");
          }
          if (user.isDeleted) {
            throw new  AppError(status.UNAUTHORIZED, "Forbidden: Your account is deleted");
          }
          if(authRoles.length > 0 && !authRoles.includes(user.role)){
            throw new  AppError(status.FORBIDDEN, "Forbidden: You do not have permission to access this resource");
          }
          
        }

        const accessToken = CookieUtils.getCookie(req, "accessToken");
        if (!accessToken) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized: Access token is missing",
          );
        }
        

      }
       const accessToken = CookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized: Access token is missing",
        );
      }
      const verifiedToken= JwtUtils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET);
      if (!verifiedToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized: Invalid access token",
        );
      }
      if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden: You do not have permission to access this resource",
        );
      }
      next();
    } catch (error: any) {
      next(error);
    }
  };
