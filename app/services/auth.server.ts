import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { login } from "./login";
import { create } from "./create";

export interface User {
  email: string;
  password: string;
  admin: boolean;
}

export const authenticator = new Authenticator<User | null>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    return await login(email, password);
  }),
  "user-pass"
);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const admin = form.get("admin") === "true";
    console.log(admin);

    const user = await create(email, password, admin);
    if (!user) {
      throw new Error("User already exists");
    }
    return user;
  }),
  "create-user"
);
