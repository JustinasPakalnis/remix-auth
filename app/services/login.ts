import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";

export interface User {
  id: number;
  email: string;
  password: string;
  admin: boolean;
}
export async function login(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  return user;
}
