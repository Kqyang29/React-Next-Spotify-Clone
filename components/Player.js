import useSpotify from "../hooks/useSpotify";
import { useSession } from "next-auth/react";
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom';
import { useCallback, useEffect, useState } from "react";
import useSongInfo from '../hooks/useSongInfo';
import { debounce } from 'lodash';
import {
  BackwardIcon,
  ForwardIcon,
  PlayCircleIcon,
  PauseIcon,
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/solid';


function Player() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();
  console.log(songInfo);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then(data => {
        setCurrentTrackId(data.body?.item?.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then(data => {
        setIsPlaying(data.body?.is_playing);
      });
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      }
      else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  }

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => { });
    }, 100),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackId, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-500 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          src={songInfo?.album.images[0]?.url}
          alt="selected_song_image"
          className=" h-10 w-12"
        />

        <div>
          <h3 className="truncate w-32 lg:w-64">{songInfo?.name}</h3>
          <p className="text-sm text-gray-500">{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon className="button" />

        {isPlaying ? (
          <PauseIcon
            onClick={handlePlayPause}
            className="button"
          />
        ) : (
          <PlayCircleIcon
            onClick={handlePlayPause}
            className="button"
          />
        )}

        <ForwardIcon className="button" />
        <ArrowUturnLeftIcon className="button" />
      </div>

      {/* right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end">
        <SpeakerXMarkIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button" />
        <input
          className="w-20 md:w-28"
          type="range"
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button" />
      </div>

    </div>
  )
}

export default Player;
