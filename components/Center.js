import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from 'lodash';
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistAtomState, playlistIdState } from '../atoms/playlistAtom';
import useSpotify from "../hooks/useSpotify";
import Songs from "../components/Songs";
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
];

function Center() {
  const { data: session } = useSession();
  // console.log(session?.user.image);
  const SpotifyApi = useSpotify();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistAtomState);

  useEffect(() => {
    // everytime refresh the page and show different gradient colors
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    SpotifyApi.getPlaylist(playlistId).then((data) => {
      setPlaylist(data.body);
    }).catch(error => alert(error));
  }, [playlistId, SpotifyApi]);

  console.log(playlist)
  return (
    <div className=" flex-grow text-white">
      <header className="absolute top-5 right-8">
        <div
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center bg-gray-800 space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2"
        >
          {(session?.user.image) ? (
            <img
              src={session?.user.image}
              alt="User_image"
              className="rounded-full w-10 h-10"
            />
          ) : (
            <Avatar
              className="cursor-pointer w-10 h-10">
              {session?.user.email[0]}
            </Avatar>
          )}

          <h2>
            {session?.user.name}
          </h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 `}>
        <img
          src={playlist?.images[0].url}
          alt="playlist_images"
          className="h-44 w-44 shadow-2xl"
        />
        <div>
          <p >
            PLAYLIST
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-3xl">{playlist?.name}</h1>
        </div>
      </section>

      <div className="h-screen overflow-y-scroll scrollbar-hide">
        <Songs />
      </div>
    </div>
  )
}

export default Center
