import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

import './FloatVideo.css'

import close from '../Navigation/close-fill-fff.svg'

export default function FloatVideo() {
	const [videoLoaded, setVideoLoaded] = useState(false)
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

	return (
		<>
			{videoLoaded ? (
				<>
					<div
						className="float-video__wrapper"
						onClick={(event) => {
							event.currentTarget.classList.toggle(
								'float-video__wrapper_expanded'
							)
							const videoItem = event.currentTarget.querySelector(
								'.float-video__video'
							)
							if (videoItem) {
								videoItem.muted = !videoItem.muted
								videoItem.currentTime = 0
							}
						}}
					>
						<div className="video__close" onClick={onCloseVideo}>
							<img src={close} alt="close" />
						</div>

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
