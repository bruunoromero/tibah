import "reflect-metadata";
import { NextApiRequest } from "next";
import {
  AuthUser,
  getUserFromCookies as fbGetUserFromAuth,
  verifyIdToken,
} from "next-firebase-auth";
import { container } from "tsyringe";
import { User } from "~/models/user.model";
import { ApikeyService } from "../services/apikey.service";

const userFromAuth = ({ id }: AuthUser): User | null => {
  if (!id) return null;

  return { id };
};

export const getUserFromAuthorization = async (authorization: string) => {
  const [grantType, token] = authorization.split(" ");

  if (grantType.toLowerCase() !== "bearer") {
    return null;
  }

  try {
    const user = await verifyIdToken(token);
    return userFromAuth(user);
  } catch (_) {
    return null;
  }
};

export const getUserFromApiKey = async (
  token: string
): Promise<User | null> => {
  if (!token) return null;

  const res = await container.resolve(ApikeyService).maybeGetByToken(token);

  if (!res) return null;

  return { id: res.userId };
};

export const getUserFromCookies = async (
  req: NextApiRequest
): Promise<User | null> => {
  try {
    const user = await fbGetUserFromAuth({ req });

    return userFromAuth(user);
  } catch (_) {
    return null;
  }
};

export const getUser = async (req: NextApiRequest) => {
  const authorization = req.headers.authorization;
  const apiKey = req.headers["x-api-key"] as string;

  if (authorization) return getUserFromAuthorization(authorization);

  if (apiKey) return getUserFromApiKey(apiKey);

  return getUserFromCookies(req);
};
