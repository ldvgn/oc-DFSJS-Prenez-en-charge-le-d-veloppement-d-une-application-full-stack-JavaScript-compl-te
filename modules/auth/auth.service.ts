import { UserRepository } from "../users/user.repository";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  /**
   * Check the login credentials.
   *
   * @param identifier Email or username allowing to identify an user
   * @param password Password's user
   * @returns User without password or null
   */
  async login(identifier: string, password: string) {
    const user = await this.userRepository.findByEmailOrUsername(identifier);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _hash, ...publicUser } = user;
    return publicUser;
  }
}
