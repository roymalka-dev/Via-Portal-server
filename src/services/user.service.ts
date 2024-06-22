import { IUser, User } from "@/models/users/user.model";

const userServices = {
  getUserByMail: async (email: string): Promise<IUser | null> => {
    try {
      return await User.findOne({ email }).exec();
    } catch (error) {
      throw new Error(`Error getting user by email: ${error}`);
    }
  },

  getUserById: async (id: string): Promise<IUser | null> => {
    try {
      return await User.findById(id).exec();
    } catch (error) {
      throw new Error(`Error getting user by ID: ${error}`);
    }
  },

  addUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    authorizations: string[];
  }): Promise<IUser> => {
    try {
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      throw new Error(`Error adding user: ${error}`);
    }
  },

  editUser: async (
    email: string,
    authorizations: string[],
    firstName: string,
    lastName: string
  ): Promise<IUser | null> => {
    try {
      return await User.findOneAndUpdate(
        { email },
        { authorizations, firstName, lastName },
        { new: true }
      ).exec();
    } catch (error) {
      throw new Error(`Error editing user: ${error}`);
    }
  },
  getAllUsers: async (): Promise<IUser[]> => {
    try {
      return await User.find({}).exec();
    } catch (error) {
      throw new Error(`Error getting all users: ${error}`);
    }
  },
  getAllUsersAsAssignees: async (): Promise<string[]> => {
    try {
      const users = await User.find({}).exec();
      return users.map((user) => `${user.firstName} ${user.lastName}`);
    } catch (error) {
      throw new Error(`Error getting all users as assignee: ${error}`);
    }
  },
};

export { User, IUser, userServices };
