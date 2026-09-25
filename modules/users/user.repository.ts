import { prisma } from "@/lib/prisma";

export class UserRepository {
  /**
   * Find someone with his email or username
   *
   * @param identifier Email or username allowing to identify an user
   * @returns
   */
  async findByEmailOrUsername(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }
}
