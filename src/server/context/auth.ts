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

const getUserFromHeader = async (req: NextApiRequest): Promise<User | null> => {
  if (!req.headers.authorization) return null;

  const [grantType, token] = req.headers.authorization.split(" ");

  if (grantType.toLowerCase() !== "bearer") {
    return null;
  }

  const user = await verifyIdToken(token);
  return userFromAuth(user);
};

const getUserFromCookies = async (
  req: NextApiRequest
): Promise<User | null> => {
  const user = await fbGetUserFromAuth({ req });

  return userFromAuth(user);
};

const getUserFromApiKey = async (req: NextApiRequest): Promise<User | null> => {
  if (!req.headers["x-api-key"]) return null;

  const token = req.headers["x-api-key"] as string;

  if (!token) return null;

  const res = await container.resolve(ApikeyService).maybeGetByToken(token);

  if (!res) return null;

  return { id: res.userId };
};

export const getUser = async (req: NextApiRequest) => {
  if (req.headers.authorization) return getUserFromHeader(req);

  if (req.headers["x-api-key"]) return getUserFromApiKey(req);

  return getUserFromCookies(req);
};
