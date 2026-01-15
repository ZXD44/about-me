import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG } from '../../../shared/config/api';
import './MusicPlayer.css';

const MusicPlayer = ({ isMobile = false }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffledPlaylist, setShuffledPlaylist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeTrackInfo, setRealTimeTrackInfo] = useState({ title: '', thumbnail: '' });

  const playerRef = useRef(null);
  const timeIntervalRef = useRef(null);

  // Initialize Playlist
  useEffect(() => {
    if (API_CONFIG.YOUTUBE_PLAYLIST?.length > 0) {
      if (API_CONFIG.SHUFFLE_PLAYLIST) {
        setShuffledPlaylist([...API_CONFIG.YOUTUBE_PLAYLIST].sort(() => Math.random() - 0.5));
      } else {
        setShuffledPlaylist(API_CONFIG.YOUTUBE_PLAYLIST);
      }
    }
  }, []);

  // Initialize YouTube API
  useEffect(() => {
    let isMounted = true;

    const createPlayer = () => {
      if (!isMounted || !shuffledPlaylist.length) return;

      // Ensure target element exists
      if (!document.getElementById('youtube-player-hidden')) return;

      playerRef.current = new window.YT.Player('youtube-player-hidden', {
        height: '0',
        width: '0',
        videoId: shuffledPlaylist[0].videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (e) => {
            if (isMounted) {
              playerRef.current = e.target;
              // Boost volume for Mobile (50), otherwise use default (usually 10-30)
              const volume = isMobile ? 50 : (API_CONFIG.DEFAULT_VOLUME || 30);
              playerRef.current.setVolume(volume);

              // Check if we should auto-play
              playerRef.current.playVideo();
              setIsLoading(false);
            }
          },
          onStateChange: (e) => {
            if (isMounted) onPlayerStateChange(e);
          },
          onError: () => {
            if (isMounted) nextSong();
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      isMounted = false;
      stopTimer();
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [shuffledPlaylist]);

  const onPlayerStateChange = (event) => {
    const { PlayerState } = window.YT;

    if (event.data === PlayerState.PLAYING) {
      setIsPlaying(true);
      setIsLoading(false);
      setDuration(playerRef.current.getDuration());

      const videoData = playerRef.current.getVideoData();
      if (videoData) {
        setRealTimeTrackInfo({
          title: videoData.title,
          thumbnail: `https://img.youtube.com/vi/${videoData.video_id}/mqdefault.jpg`
        });
      }
      startTimer();
    } else if (event.data === PlayerState.PAUSED) {
      setIsPlaying(false);
      stopTimer();
    } else if (event.data === PlayerState.ENDED) {
      nextSong();
    } else if (event.data === PlayerState.BUFFERING) {
      setIsLoading(true);
    }
  };

  const startTimer = () => {
    stopTimer();
    timeIntervalRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextSong = useCallback(() => {
    if (!shuffledPlaylist.length) return;
    setIsLoading(true);
    const newIndex = (currentSongIndex + 1) % shuffledPlaylist.length;
    setCurrentSongIndex(newIndex);
    if (playerRef.current) {
      playerRef.current.loadVideoById(shuffledPlaylist[newIndex].videoId);
    }
  }, [currentSongIndex, shuffledPlaylist]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const currentSong = shuffledPlaylist[currentSongIndex];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div style={{ display: 'none' }} id="youtube-player-container">
        <div id="youtube-player-hidden" />
      </div>

      <div className={`music-player-wrapper ${isMobile ? 'mobile' : ''}`}>
        {/* Main Floating Orb */}
        {!isExpanded && (
          <button
            className="music-toggle-btn"
            onClick={() => setIsExpanded(true)}
            aria-label="Toggle Player"
          >
            <div className={`toggle-icon ${isPlaying ? 'spinning' : ''}`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>
          </button>
        )}

        {/* Expanded UI */}
        <div className={`music-player-container ${isExpanded ? 'expanded' : 'collapsed'} ${isPlaying ? 'playing' : ''}`}>
          <button className="minimize-btn" onClick={() => setIsExpanded(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="album-cover">
            <img src={realTimeTrackInfo.thumbnail || currentSong?.thumbnail} alt="Art" />
          </div>

          <div className="song-details">
            <div className="song-title">
              {realTimeTrackInfo.title || currentSong?.title || "Loading..."}
            </div>
            <div className="time-row">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <div className="visualizer">
                <div className="vis-bar"></div>
                <div className="vis-bar"></div>
                <div className="vis-bar"></div>
                <div className="vis-bar"></div>
                <div className="vis-bar"></div>
              </div>
            </div>
          </div>

          <div className="controls-wrapper">
            <button className="void-btn primary" onClick={togglePlay}>
              {isLoading ? (
                <div className="loading-spinner" />
              ) : isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              )}
            </button>
            <button className="void-btn" onClick={nextSong}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 4l10 8-10 8V4zM19 4h2v16h-2V4z" />
              </svg>
            </button>
          </div>

          <div className="progress-wrapper">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;