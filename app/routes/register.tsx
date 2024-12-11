import { Form, Link, useActionData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { checkUserSession } from "~/utils/session.server";
import { json, redirect } from "@remix-run/node";
import { registrationSchema } from "../schemas/authSchema";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = Object.fromEntries(await clonedRequest.formData());

  try {
    registrationSchema.parse(formData);
    const user = await authenticator.authenticate(
      "create-user",
      request.clone()
    );

    if (!user) {
      return json({ error: "User creation failed" }, { status: 400 });
    }

    return redirect("/login");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ errors: error.flatten().fieldErrors }, { status: 400 });
    } else if (error instanceof Error) {
      return json(
        { error: error.message || "An unexpected error occurred" },
        { status: 400 }
      );
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await checkUserSession(request);
  return null;
}

export default function Register() {
  const actionData = useActionData<typeof action>();

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
            Create an Account
          </h2>
          {actionData?.error && (
            <p className="text-red-600 text-sm">{actionData.error}</p>
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
                name="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {actionData?.errors?.email && (
                <p className="text-red-600 text-sm">
                  {actionData.errors.email[0]}
                </p>
              )}
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
                autoComplete="current-password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {actionData?.errors?.password && (
                <p className="text-red-600 text-sm">
                  {actionData.errors.password[0]}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirmpassword"
                id="confirmpassword"
                autoComplete="current-password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {actionData?.errors?.confirmPassword && (
                <p className="text-red-600 text-sm">
                  {actionData.errors.confirmPassword}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="admin"
                className="block text-gray-600 text-sm font-medium mb-2"
              >
                User Type
              </label>
              <select
                name="admin"
                id="admin"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select user type</option>
                <option value="true">Admin</option>
                <option value="false">Regular User</option>
              </select>
              {actionData?.errors?.admin && (
                <p className="text-red-600 text-sm">
                  {actionData.errors.admin}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register
            </button>
          </Form>

          <div className="mt-4 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login here
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
