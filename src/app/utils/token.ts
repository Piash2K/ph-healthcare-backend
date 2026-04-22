import { JwtPayload, SignOptions } from "jsonwebtoken";
import { JwtUtils } from "./jwt";
import { envVars } from "../config/env";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = JwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET!,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = JwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET!,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return refreshToken;
};

export const TokenUtils = {
  getAccessToken,
  getRefreshToken,
};