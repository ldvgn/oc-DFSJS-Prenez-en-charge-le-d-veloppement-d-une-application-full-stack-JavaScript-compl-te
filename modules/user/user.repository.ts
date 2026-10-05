import { prisma } from "@/lib/prisma";
import type { User } from "@/prisma/generated/prisma/client";

export class UserRepository {
  /**
   * Returns a single user.
   *
   * @param username - Username
   * @returns The user, or `null` if not found
   */
  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  /**
   * Returns a single user.
   *
   * @param email - User email
   * @returns The user, or `null` if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}

export const userRepository = new UserRepository();
