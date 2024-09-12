"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Play, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Toast } from "../../components/ui/toast";
import { toast } from "../../hooks/use-toast";

type Song = {
  id: string;
  url: string;
  title: string;
  votes: number;
  userVote: "up" | "down" | null;
};

export default function Component() {
  const [songs, setSongs] = useState<Song[]>([
    {
      id: "1",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      title: "Rick Astley - Never Gonna Give You Up",
      votes: 5,
      userVote: null,
    },
    {
      id: "2",
      url: "https://www.youtube.com/watch?v=L_jWHffIx5E",
      title: "Smash Mouth - All Star",
      votes: 3,
      userVote: null,
    },
  ]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(inputUrl);
    if (videoId) {
      const newSong: Song = {
        id: videoId,
        url: inputUrl,
        title: `YouTube Video ${videoId}`, // You'd typically fetch the actual title from YouTube API
        votes: 0,
        userVote: null,
      };
      setSongs([...songs, newSong]);
      setInputUrl("");
      toast({
        title: "Song added",
        description: "Your song has been added to the queue.",
      });
    }
  };

  const handleVote = (id: string, voteType: "up" | "down") => {
    setSongs(
      songs.map((song) => {
        if (song.id === id) {
          const voteChange =
            song.userVote === voteType ? -1 : song.userVote === null ? 1 : 2;
          return {
            ...song,
            votes: song.votes + (voteType === "up" ? voteChange : -voteChange),
            userVote: song.userVote === voteType ? null : voteType,
          };
        }
        return song;
      })
    );
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setSongs(songs.filter((s) => s.id !== song.id));
  };

  const sharePage = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      Toast({
        title: "Link copied",
        description: "The page link has been copied to your clipboard.",
      });
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-400">
            Song Voting Queue
          </h1>
          <Button
            onClick={sharePage}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Page
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-grow bg-gray-800 text-gray-100 border-gray-700 focus:border-purple-500"
            />
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add Song
            </Button>
          </div>
        </form>

        {inputUrl && extractVideoId(inputUrl) && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-purple-400">
              Preview:
            </h2>
            <img
              src={`https://img.youtube.com/vi/${extractVideoId(
                inputUrl
              )}/0.jpg`}
              alt="Video thumbnail"
              className="w-full max-w-md rounded-lg"
            />
          </div>
        )}

        {currentSong && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-purple-400">
              Now Playing:
            </h2>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractVideoId(
                  currentSong.url
                )}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-purple-400">
          Upcoming Songs:
        </h2>
        <div className="space-y-4">
          {songs
            .sort((a, b) => b.votes - a.votes)
            .map((song) => (
              <Card key={song.id} className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={`https://img.youtube.com/vi/${extractVideoId(
                        song.url
                      )}/default.jpg`}
                      alt={song.title}
                      className="w-20 h-15 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-100">
                        {song.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Votes: {song.votes}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={song.userVote === "up" ? "default" : "outline"}
                      onClick={() => handleVote(song.id, "up")}
                      className={
                        song.userVote === "up"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "text-purple-400 border-purple-400 hover:bg-purple-700"
                      }
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={song.userVote === "down" ? "default" : "outline"}
                      onClick={() => handleVote(song.id, "down")}
                      className={
                        song.userVote === "down"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "text-purple-400 border-purple-400 hover:bg-purple-700"
                      }
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => playSong(song)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
