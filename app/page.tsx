import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Headphones, Music, Users } from "lucide-react";
import RedirectButton from "./components/RedirectButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-5xl font-extrabold leading-tight lg:text-6xl">
            Let Your Fans <span className="text-purple-500">Vote</span> the
            Soundtrack
          </h1>
          <p className="mb-8 text-xl text-gray-400">
            Empower your audience to shape your live music streams
          </p>
          <RedirectButton />
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <Music className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h3 className="mb-2 text-xl font-semibold">
                Interactive Playlists
              </h3>
              <p className="text-gray-400">
                Fans vote on the next track in real-time
              </p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">Community Building</h3>
              <p className="text-gray-400">
                Engage with your audience like never before
              </p>
            </div>
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <Headphones className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
              <h3 className="mb-2 text-xl font-semibold">High Quality Audio</h3>
              <p className="text-gray-400">
                Crystal clear sound for the best experience
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-800 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Ready to revolutionize your streams?
            </h2>
            <p className="mb-8 text-xl text-gray-400">
              Join MusiVote today and create interactive music experiences
            </p>
            <div className="flex justify-center space-x-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-xs bg-gray-700 text-white"
              />
              <Button className="bg-purple-600 text-white hover:bg-purple-700">
                Get Started
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} MusiVote. All rights reserved.</p>
      </footer>
    </div>
  );
}
