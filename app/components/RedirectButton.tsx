"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";

export default function RedirectButton() {
  return (
    <Button
      onClick={() => signIn()}
      className="bg-purple-600 text-white hover:bg-purple-700"
    >
      Start Streaming Now
    </Button>
  );
}
