import { useState } from "react";
import useSpotify from './useSpotify';
import { currentTrackIdState } from '../atoms/songAtom';
import { useEffect } from "react";
import { useRecoilState } from 'recoil';

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const FetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            }
          }
        ).then(res => res.json());

        setSongInfo(trackInfo);
      }
    }
    FetchSongInfo();
  }, [currentTrackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo
