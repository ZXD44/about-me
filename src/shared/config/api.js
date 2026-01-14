import { PLAYLIST_URLS } from '../../features/music-player/data/playlist';

// Helper to extract YouTube Video ID
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Transform URLs to Player Objects
const processPlaylist = (urls) => {
  return urls.map((url, index) => {
    const videoId = getYouTubeVideoId(url);
    return {
      id: index + 1,
      title: "Loading...", // Title will be fetched by player
      videoId: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      url: url
    };
  }).filter(item => item.videoId); // Filter out invalid URLs
};

export const API_CONFIG = {
  QR_API_URL: "https://www.pp-qr.com/api/0968237098",

  // YouTube Music Playlist Config
  // แก้ไขเพลงที่ไฟล์: src/features/music-player/data/playlist.js
  YOUTUBE_PLAYLIST: processPlaylist(PLAYLIST_URLS),

  // Default settings
  DEFAULT_VOLUME: 10,
  AUTO_LOOP: true,
  SHUFFLE_PLAYLIST: true
};
