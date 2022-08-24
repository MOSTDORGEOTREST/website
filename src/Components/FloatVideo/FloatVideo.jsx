import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import './FloatVideo.css'

import close from '../Navigation/close-fill-fff.svg'
import min from './minimize.svg'

export default function FloatVideo() {
	const [videoLoaded, setVideoLoaded] = useState(false)
	const [videoPlay, setVideoPlay] = useState(false)
	const [videoOpened, setVideoOpened] = useState(false)
	const [videoLink, setVideoLink] = useState('')

	useEffect(() => {
		import('./sample.mp4').then((sample) => {
			setVideoLink(sample.default)
			setVideoLoaded(true)
		})
	}, [])

	function onCloseVideo() {
		setVideoLoaded(false)
	}

	function onMinimizeVideo(event) {
		event.stopPropagation()

		const videoItem = event.currentTarget.parentNode.querySelector(
			'.float-video__video'
		)
		if (!videoItem) return

		setVideoOpened(false)
		setVideoPlay(false)
		videoItem.pause()
		videoItem.currentTime = 0
		videoItem.muted = true
	}

	return (
		<>
			{videoLoaded ? (
				<>
					<div
						className={
							videoOpened
								? 'float-video__wrapper float-video__wrapper_expanded'
								: 'float-video__wrapper'
						}
						onClick={(event) => {
							const videoItem = event.currentTarget.querySelector(
								'.float-video__video'
							)
							if (!videoItem) return

							if (videoOpened) {
								if (!videoPlay) {
									videoItem.play()
									setVideoPlay(true)
								}
								if (videoPlay) {
									videoItem.pause()
									setVideoPlay(false)
								}
								return
							}

							if (!videoPlay) videoItem.play()
							videoItem.muted = false
							videoItem.currentTime = 0
							setVideoPlay(true)
							setVideoOpened(true)
						}}
					>
						{videoOpened ? (
							<div className="video__close" onClick={onMinimizeVideo}>
								<img src={min} alt="close" />
							</div>
						) : (
							<div className="video__close" onClick={onCloseVideo}>
								<img src={close} alt="close" />
							</div>
						)}

						<video
							className="float-video__video"
							id="floatVideo"
							autoPlay={true}
							preload="auto"
							loop={true}
							src={videoLink}
							disablePictureInPicture
							playsInline="playsinline"
							webkit-playsinline="webkit-playsinline"
							muted={true}
							type="video/mp4"
							onLoadedMetadata={(event) => {
								event.target.play()
							}}
						></video>
					</div>
				</>
			) : null}
		</>
	)
}
