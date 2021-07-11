import React, { useState, createContext } from "react";

export const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [audio, setAudio] = useState(null);
  return (
    <AudioContext.Provider value={{ audio, setAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
