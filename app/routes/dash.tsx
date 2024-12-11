import { requireUserSession } from "~/utils/session.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  return null;
}

export default function Dash() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Hello!</h1>
        <p className="text-lg text-gray-600 mt-2">Dashboard</p>
        <Link
          to="/"
          className="block mt-10 w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          Main page
        </Link>
      </div>
      <div className="absolute top-4 right-4">
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="px-6 py-3 text-white bg-red-500 hover:bg-red-600 rounded-lg font-semibold"
          >
            Log Out
          </button>
        </Form>
      </div>
    </div>
  );
}
