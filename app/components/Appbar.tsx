"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Appbar() {
  const { data: session, status } = useSession();

  return (
    <header className="mx-auto text-white w-full px-4 py-6  bg-gray-900">
      <nav className="flex items-center justify-between  ">
        <Link href="/" className="text-2xl font-bold text-purple-500">
          MusiVote
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:text-purple-400">
            About
          </Link>
          <Link href="/features" className="hover:text-purple-400">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-purple-400">
            Pricing
          </Link>

          <div className="flex items-center space-x-2">
            {session?.user ? (
              <button
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md transition duration-300"
                onClick={() => signOut()}
                aria-label="Sign Out"
              >
                Sign Out
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md transition duration-300"
                onClick={() => signIn()}
                aria-label="Sign In"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
