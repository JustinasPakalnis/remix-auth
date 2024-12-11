import { Link, useLoaderData } from "@remix-run/react";
import { requireUserSession } from "~/utils/session.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserSession(request);

  return { user };
}

export default function Index() {
  const user = useLoaderData<typeof loader>();
  const isAdmin = user.user.admin;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome to greatest App
        </h1>
        <p className="text-gray-600 mb-8">
          Explore our platform! Log in, create an account, or visit your
          dashboard.
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Create Account
          </Link>
          <Link
            to="/dash"
            className="block w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            Dashboard
          </Link>
          {isAdmin ? (
            <Link
              to="/admin"
              className="block w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
            >
              Admin
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
