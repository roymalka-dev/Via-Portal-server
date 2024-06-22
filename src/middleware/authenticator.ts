import { RequestHandler } from "express";
import { OAuth2Client } from "google-auth-library";
import { userServices } from "@/services/user.service";
import logger from "@/logger/logger";

declare module "express-session" {
  interface SessionData {
    user: string;
    authorization: string[];
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authenticator: RequestHandler = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader)
      throw new Error("No authorization header provided");

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token)
      throw new Error("Invalid authorization header format");

    if (req?.session?.user && req?.session?.authorization) {
      return next();
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error: any) {
      return res.status(403).send({ error: error.message, status: 403 });
    }

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error("Email not found in token payload");
    }

    let user = await userServices.getUserByMail(payload.email);
    if (!user) {
      const emailDomain = payload.email.split("@")[1];

      if (emailDomain !== "ridewithvia.com") {
        throw new Error("Unauthorized domain");
      }

      const [firstName, lastNameWithDomain] = payload.email.split(".");
      const lastName = lastNameWithDomain.split("@")[0];

      const newUserDetails = {
        firstName,
        lastName,
        email: payload.email,
        authorizations: ["USER"],
      };

      await userServices.addUser(newUserDetails);
      logger.info(`New user Added: ${payload.email}`, {
        tag: "new-user",
        location: "authenticator.ts",
      });

      user = await userServices.getUserByMail(payload.email);
    }

    req.session.user = user?.email;
    req.session.authorization = user?.authorizations;

    req.session.save((error: any) => {
      if (error) {
        throw error;
      }
    });
    logger.info(`User connected: ${payload.email}`, {
      tag: "user-connected",
      location: "authenticator.ts",
    });

    next();
  } catch (error: any) {
    res.status(403).send({ error: error.message, status: 403 });
  }
};
