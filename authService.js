import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Vendor from "../models/vendor.js";

export const authService = {
  async register(data) {
    const { role, email, password } = data;

    const existingUser = await (role === "vendor" ? Vendor : User).findOne({
      email,
    });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserData = { ...data, password: hashedPassword };

    const model = role === "vendor" ? Vendor : User;
    const newUser = new model(newUserData);
    await newUser.save();
    return newUser;
  },

  async login({ email, password }) {
    // Try to find the user in User model
    let user = await User.findOne({ email });
    let role = "user";

    // If not found in User, try Vendor
    if (!user) {
      user = await Vendor.findOne({ email });
      role = "vendor";
    }

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return { user, role };
  },
};
