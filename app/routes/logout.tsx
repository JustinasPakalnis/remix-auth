import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/utils/session.server";
import type { ActionFunctionArgs } from "@remix-run/node";
export async function action({ request }: ActionFunctionArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}
