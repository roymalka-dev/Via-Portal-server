import logger from "../logger/logger";
import { userServices } from "../services/user.service";
import { Request, Response } from "express";

export const userControllers = {
  getUserDetails: async (req: Request, res: Response) => {
    const userEmail = req.session.user || "";
    try {
      const user = await userServices.getUserByMail(userEmail);
      if (!user) {
        logger.warn(`User not found: ${userEmail}`, {
          tag: "user-not-found",
          location: "userControllers.ts",
        });
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ data: user });
    } catch (error: any) {
      logger.error(`Error getting user details`, {
        tag: "auth-error",
        location: "userControllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addUser: async (req: Request, res: Response) => {
    try {
      const newUser = await userServices.addUser(req.body);
      logger.info(`User added: ${newUser.email}`, {
        tag: "user-added",
        location: "userControllers.ts",
      });
      res.status(201).json(newUser);
    } catch (error: any) {
      logger.error(`Error adding user`, {
        tag: "auth-error",
        location: "userControllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  },

  editUser: async (req: Request, res: Response) => {
    const { authorizations, firstName, lastName, email } = req.body;
    try {
      const updatedUser = await userServices.editUser(
        email,
        authorizations,
        firstName,
        lastName
      );
      if (!updatedUser) {
        logger.warn(`User not found: ${email}`, {
          tag: "user-not-found",
          location: "userControllers.ts",
        });
        return res.status(404).json({ message: "User not found" });
      }

      logger.info(`User authorizations updated: ${email}`, {
        tag: "user-authorization-updated",
        location: "userControllers.ts",
      });

      res.status(200).json({ data: updatedUser });
    } catch (error: any) {
      logger.error(`Error editing user authorizations`, {
        tag: "auth-error",
        location: "userControllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userServices.getAllUsers();
      res.status(200).json({ data: users });
    } catch (error: any) {
      logger.error(`Error getting all users`, {
        tag: "auth-error",
        location: "userControllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getAllUsersAsAssignees: async (req: Request, res: Response) => {
    try {
      const users = await userServices.getAllUsersAsAssignees();

      res.status(200).json({ data: users });
    } catch (error: any) {
      logger.error(`Error getting all users`, {
        tag: "auth-error",
        location: "userControllers.ts",
        error: req?.session?.user + " " + error.message,
      });
      res.status(500).json({ message: "Internal server error" });
    }
  },
  verify: async (req: Request, res: Response) => {
    res.status(200).send({ message: "Authorized" });
  },
  logout: (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error("Failed to destroy session during logout", {
          tag: "error",
          location: "user.controllers.ts",
          error: err.message,
        });
        return res.status(500).send("Failed to log out");
      }

      res.clearCookie("connect.sid", { path: "/" }); // Clear the session cookie

      return res.status(200).json({ message: "Logged out successfully" });
    });
  },
};
