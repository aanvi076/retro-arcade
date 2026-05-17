import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Howl, Howler } from 'howler';

const AudioContext = createContext();

const PLAYLIST = [
  { name: "Chillhop Radio", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
  { name: "Lounge Radio", url: "https://streams.ilovemusic.de/iloveradio16.mp3" },
  { name: "Local Lofi Beat", url: "/lofi.mp3" },
];

export const AudioProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const musicRef = useRef(null);
  const initialized = useRef(false);

  const initTrack = (index, playImmediately = true) => {
    if (musicRef.current) {
      musicRef.current.unload();
    }
    
    const track = new Howl({
      src: [PLAYLIST[index].url],
      loop: true,
      volume: 0.15,
      html5: true // IMPORTANT: Must be true to stream endless radio links!
    });
    
    musicRef.current = track;
    if (playImmediately && !isMuted && initialized.current) {
      track.play();
    }
  };

  useEffect(() => {
    initTrack(currentTrackIndex, false);

    const handleFirstInteraction = () => {
      if (!initialized.current) {
        initialized.current = true;
        if (musicRef.current && !isMuted) {
          musicRef.current.play();
        }
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      if (musicRef.current) musicRef.current.unload();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    initTrack(nextIndex, true);
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, nextTrack, currentTrackName: PLAYLIST[currentTrackIndex].name }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
