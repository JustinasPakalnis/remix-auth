import { createCookieSessionStorage, redirect } from "@remix-run/node";
import type { Session } from "@remix-run/node";
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "JP-test",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
    maxAge: 10 * 60,
  },
});

export async function getSession(cookie: string) {
  return sessionStorage.getSession(cookie);
}
export async function destroySession(session: Session) {
  return sessionStorage.destroySession(session);
}

async function getSessionUser(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  return session.get("user");
}

export async function requireUserSession(request: Request) {
  const user = await getSessionUser(request);

  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function checkUserSession(request: Request) {
  const user = await getSessionUser(request);

  if (user) {
    throw redirect("/dash");
  }
  return user;
}

export async function requireAdminUserSession(request: Request) {
  const user = await getSessionUser(request);

  if (!user) {
    throw redirect("/login");
  }
  if (!user.admin) {
    throw redirect("/dash");
  }

  return user;
}
