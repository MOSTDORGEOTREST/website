import React, { useEffect } from "react";

import "./LabsVideo.css";
import "../About/About.jsx";
import ReactHlsPlayer from "../../hlsPlayer";
import arrowDown from "../About/arrow-down.svg";
import useWindowDimensions from "../../windowResizeHook";

export default function LabsVideo() {
  const { width } = useWindowDimensions();

  const gridWrapper = React.useRef();

  const aboutCard = React.useRef();

  const player1Ref = React.useRef();
  const player2Ref = React.useRef();
  const player3Ref = React.useRef();
  const player4Ref = React.useRef();
  const player5Ref = React.useRef();
  const player6Ref = React.useRef();
  const player7Ref = React.useRef();
  const player8Ref = React.useRef();
  const player9Ref = React.useRef();

  function playVideo() {
    player1Ref.current.play();
    player2Ref.current.play();
    player3Ref.current.play();
    player4Ref.current.play();
    player5Ref.current.play();
    player6Ref.current.play();
    player7Ref.current.play();
    player8Ref.current.play();
    player9Ref.current.play();
  }

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

  useEffect(()=>{
    if (gridWrapper.current && gridWrapper.current.parentNode.classList.contains("show")) {
      gridWrapper.current.style.height = "fit-content"
    }
  }, [width])

  // function toggleControls() {
  // 	playerRef.current.controls = !playerRef.current.controls
  // }

  useEffect(() => {
    setTimeout(() => {
      playVideo();
    }, 5000);

    // setTimeout(()=>{
    //   aboutCard.current.click();
    // }, 10)    
    
  }, []);

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
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/1/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player1Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование физических свойств
                  </h3>
                </div>
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/2/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player2Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование физических свойств
                  </h3>
                </div>
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/3/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player3Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование механических свойств
                  </h3>
                </div>
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/4/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player4Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">Регистрация образцов</h3>
                </div>
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/5/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player5Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование химических свойств
                  </h3>
                </div>
                {/* <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/6/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player6Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование механических свойств
                  </h3>
                </div> */}
                {/* <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/7/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player7Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование динамических свойств
                  </h3>
                </div> */}
                <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/8/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player8Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">
                    Исследование скальных грунтов
                  </h3>
                </div>
                {/* <div className="labs-card">
                  <div className="labs-card__video">
                    <ReactHlsPlayer
                      src="https://dev.mdgt.ru:8443/OnlineStream/9/index.m3u8"
                      autoPlay={true}
                      controls={false}
                      width="100%"
                      height="auto"
                      playerRef={player9Ref}
                      muted={true}
                      preload="true"
                      loop={true}
                      playsInline="playsinline"
                      webkit-playsinline="webkit-playsinline"
                      role="region"
                      data-setup={{
                        controls: false,
                        loop: "true",
                        autoplay: true,
                        preload: "true",
                      }}
                    />
                  </div>
                  <h3 className="labs-card__title">Учебный класс</h3>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
