import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { redirect, json } from "@remix-run/node";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { checkUserSession, sessionStorage } from "~/utils/session.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.authenticate("user-pass", request);
  if (!user) {
    return json(
      { error: "User doesn't exist or password is incorrect" },
      { status: 400 }
    );
  }

  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  session.set("user", user);
  const headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session),
  });

  if (user.admin) return redirect("/admin", { headers });
  return redirect("/dash", { headers });
}

export async function loader({ request }: LoaderFunctionArgs) {
  await checkUserSession(request);
  return null;
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white py-4 px-8 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <nav>
            <Link to="/" className="text-white font-medium hover:underline">
              Main page
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Sign In
          </h2>

          {actionData?.error && (
            <div className="text-red-600 text-sm mb-4">{actionData.error}</div>
          )}

          <Form method="post">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                autoComplete="current-password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {!isLoading ? "Sign In" : "Logging in..."}
            </button>
          </Form>

          <div className="mt-4 text-center">
            <span className="text-gray-600">Dont have an account? </span>
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-semibold"
            >
              Register here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
