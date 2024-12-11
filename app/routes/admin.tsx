import { requireAdminUserSession } from "~/utils/session.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAdminUserSession(request);

  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("search") || "";

  const where = searchQuery
    ? {
        email: {
          contains: searchQuery,
        },
      }
    : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      email: true,
      admin: true,
    },
    skip: 0,
    take: 20,
  });

  return { users, searchQuery };
}

export default function Admin() {
  const { users, searchQuery } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchParams({ search: value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100 relative p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-blue-800">Hello!</h1>
        <p className="text-lg text-blue-600 mt-2">
          Admin page only special users access
        </p>

        <div className="mt-6">
          <Form method="get" className="flex justify-center mb-6">
            <input
              type="text"
              name="search"
              placeholder="Search by email"
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-lg w-1/2"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Search
            </button>
          </Form>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Users List
          </h2>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-4 py-2">ID</th>
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.id}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.admin ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Link
          to="/"
          className="block mt-10 w-full py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          Main page
        </Link>
      </div>

      {/* Log Out Button */}
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
