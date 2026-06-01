import React, { useEffect, useRef } from "react";

import "./LabsVideo.css";
import "../About/About.jsx";
import ReactHlsPlayer from "../../hlsPlayer";
import arrowDown from "../About/arrow-down.svg";
import useWindowDimensions from "../../windowResizeHook";
import offCamImg from "./OFFCAM.png";
import { syncLiveHlsVideos } from "./labsStreamSync";

const STREAM_STAGGER_MS = 700;
const SYNC_FALLBACK_MS = 12000;

const STREAMS = [
  {
    src: "https://mdgt.ru/hls/1/index.m3u8",
    title: "Исследование физических свойств",
  },
  {
    src: "https://mdgt.ru/hls/2/index.m3u8",
    title: "Регистрация образцов",
  },
  {
    src: "https://mdgt.ru/hls/3/index.m3u8",
    title: "Исследование механических свойств",
  },
  {
    src: "https://mdgt.ru/hls/4/index.m3u8",
    title: "Исследование физических свойств",
  },
  {
    src: "https://mdgt.ru/hls/5/index.m3u8",
    title: "Исследование химических свойств",
  },
  {
    src: "https://mdgt.ru/hls/6/index.m3u8",
    title: "Исследование скальных грунтов",
  },
];

function getVideos(playerRefs) {
  return playerRefs.map((ref) => ref.current).filter(Boolean);
}

function LabsStreamCard({
  src,
  title,
  index,
  playerRef,
  onStreamPlaying,
}) {
  const [loadStream, setLoadStream] = React.useState(false);
  const [streamReady, setStreamReady] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setLoadStream(true),
      index * STREAM_STAGGER_MS
    );
    return () => clearTimeout(timer);
  }, [index]);

  const handlePlaying = () => {
    setStreamReady(true);
    onStreamPlaying(index);
  };

  return (
    <div className="labs-card">
      <div className="labs-card__video labs-card__video--stream">
        <img
          src={offCamImg}
          alt=""
          className={`labs-card__poster${
            streamReady ? " labs-card__poster--hidden" : ""
          }`}
          aria-hidden={streamReady}
        />
        {loadStream && (
          <ReactHlsPlayer
            className={`labs-card__player${
              streamReady ? " labs-card__player--visible" : ""
            }`}
            src={src}
            autoPlay={true}
            controls={false}
            width="100%"
            height="auto"
            playerRef={playerRef}
            muted={true}
            preload="none"
            loop={true}
            playsInline="playsinline"
            webkit-playsinline="webkit-playsinline"
            role="region"
            onPlaying={handlePlaying}
            data-setup={{
              controls: false,
              loop: "true",
              autoplay: true,
              preload: "none",
            }}
          />
        )}
      </div>
      <h3 className="labs-card__title">{title}</h3>
    </div>
  );
}

export default function LabsVideo() {
  const { width } = useWindowDimensions();

  const gridWrapper = React.useRef();
  const aboutCard = React.useRef();
  const playerRefs = useRef(STREAMS.map(() => React.createRef()));
  const readyIndices = useRef(new Set());
  const syncStarted = useRef(false);

  const runSync = React.useCallback(() => {
    if (syncStarted.current) return;
    syncStarted.current = true;
    syncLiveHlsVideos(getVideos(playerRefs.current));
  }, []);

  const handleStreamPlaying = React.useCallback(
    (index) => {
      readyIndices.current.add(index);
      if (readyIndices.current.size >= STREAMS.length) {
        runSync();
      }
    },
    [runSync]
  );

  useEffect(() => {
    const lastStagger = (STREAMS.length - 1) * STREAM_STAGGER_MS;
    const timer = setTimeout(() => {
      if (readyIndices.current.size > 0) {
        runSync();
      }
    }, lastStagger + SYNC_FALLBACK_MS);

    return () => clearTimeout(timer);
  }, [runSync]);

  function showGrid(event) {
    event.preventDefault();
    event.stopPropagation();
    const accordionContent = event.currentTarget.parentNode.childNodes[1];

    if (event.currentTarget.parentNode.classList.contains("show")) {
      accordionContent.style.height = 0 + "px";
      event.currentTarget.parentNode.classList.remove("show");
    } else {
      accordionContent.style.height = accordionContent.scrollHeight + "px";
      event.currentTarget.parentNode.classList.add("show");
    }
  }

  useEffect(() => {
    if (
      gridWrapper.current &&
      gridWrapper.current.parentNode.classList.contains("show")
    ) {
      gridWrapper.current.style.height = "fit-content";
    }
  }, [width]);

  return (
    <>
      <div className="home-labs">
        <div className="home-blur"></div>
        <div className="labs-content">
          <div className="about-docs__card-wrapper w-50 show">
            <div className="about-docs__card" ref={aboutCard} onClick={showGrid}>
              <div className="docs__card-title">
                <h3 className="docs__card-title_main">
                  Прямая видео трансляция
                </h3>
              </div>
              <div className="docs__card-btn">
                <img src={arrowDown} alt="expand" />
              </div>
            </div>
            <div className="labs-grid__wrapper" ref={gridWrapper}>
              <div className="labs-grid">
                {STREAMS.map((stream, index) => (
                  <LabsStreamCard
                    key={stream.src}
                    src={stream.src}
                    title={stream.title}
                    index={index}
                    playerRef={playerRefs.current[index]}
                    onStreamPlaying={handleStreamPlaying}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
