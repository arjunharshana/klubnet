import React from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-text">
      {}
      <div className="w-full max-w-md rounded-xl bg-white p-12 text-center shadow-lg">
        {}
        <Users className="mx-auto h-16 w-16 text-primary" />

        {}
        <h1 className="mt-4 text-4xl font-bold text-text">KlubNet</h1>

        {}
        <p className="mt-2 text-lg text-text">Your campus, connected.</p>

        {}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/login"
            className="rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition hover:bg-opacity-90"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-secondary px-6 py-3 font-bold text-secondary-foreground transition hover:bg-opacity-90"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
