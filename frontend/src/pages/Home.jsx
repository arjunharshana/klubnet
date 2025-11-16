import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      {}
      <div className="w-full max-w-md rounded-xl bg-white p-12 text-center shadow-lg">
        {}
        <Users className="mx-auto h-16 w-16 text-blue-600" />

        {}
        <h1 className="mt-4 text-4xl font-bold text-gray-800">KlubNet</h1>

        {}
        <p className="mt-2 text-lg text-gray-600">Your campus, connected.</p>

        {}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-gray-200 px-6 py-3 font-bold text-gray-800 transition hover:bg-gray-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
