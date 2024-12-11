import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export interface User {
  email: string;
  password: string;
  admin: boolean;
}
export async function create(
  email: string,
  password: string,
  admin: boolean
): Promise<User | null> {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      admin: admin,
    },
  });

  return newUser;
}
