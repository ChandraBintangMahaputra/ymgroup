import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import Modal from './Modal';
import { FaPlay } from "react-icons/fa";


interface VideoPlayerProps {
    url: string;
  }

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handlePlayClick = () => {
    setIsPlaying(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsPlaying(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    setCursorPosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    if (!isModalOpen) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isModalOpen]);

  return (
    <div className="relative w-full pt-[56.25%]">
      <ReactPlayer
        url={url}
        playing={isPlaying}
        muted={isMuted}
        loop={true}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
      />
      {!isModalOpen && (
        <div
          className="absolute top-0 left-0 w-full h-full flex justify-center items-center cursor-pointer z-10"
          onClick={handlePlayClick}
        >
          <button
            className="bg-black bg-opacity-70 text-white p-4 rounded-full"
            style={{
              transform: `translate(${cursorPosition.x * 0.02}px, ${cursorPosition.y * 0.02}px)`,
            }}
          >
            <FaPlay className="h-12 w-12 text-white" />
          </button>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={handleModalClose}>
        <div className="relative w-full h-0 pb-[56.25%]">
          <ReactPlayer
            url={url}
            playing={false}
            muted={false}
            loop={true}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>
      </Modal>
    </div>
  );
};

export default VideoPlayer;
