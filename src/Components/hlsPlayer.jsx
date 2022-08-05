import React, { useEffect } from 'react'
import Hls from 'hls.js'

function ReactHlsPlayer({
	hlsConfig,
	playerRef = React.createRef(),
	src,
	autoPlay,
	...props
}) {
	useEffect(() => {
		let hls

		function _initPlayer() {
			if (hls != null) {
				hls.destroy()
			}

			const newHls = new Hls({
				enableWorker: false,
				...hlsConfig,
			})

			if (playerRef.current != null) {
				newHls.attachMedia(playerRef.current)
			}

			newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
				newHls.loadSource(src)

				newHls.on(Hls.Events.MANIFEST_PARSED, () => {
					if (autoPlay) {
						playerRef?.current
							?.play()
							.catch(() =>
								console.log(
									'Unable to autoplay prior to user interaction with the dom.'
								)
							)
					}
				})
			})

			newHls.on(Hls.Events.ERROR, function (event, data) {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							newHls.startLoad()
							break
						case Hls.ErrorTypes.MEDIA_ERROR:
							newHls.recoverMediaError()
							break
						default:
							_initPlayer()
							break
					}
				}
			})

			hls = newHls
		}

		// Check for Media Source support
		if (Hls.isSupported()) {
			_initPlayer()
		}

		return () => {
			if (hls != null) {
				hls.destroy()
			}
		}
	}, [autoPlay, hlsConfig, playerRef, src])

	// If Media Source is supported, use HLS.js to play video
	if (Hls.isSupported()) {
		return <video ref={playerRef} {...props} />
	}

	// Fallback to using a regular video player if HLS is supported by default in the user's browser
	return (
		<video
			muted
			ref={playerRef}
			src={src}
			autoPlay={autoPlay}
			{...props}
			onLoadedMetadata={(event) => {
				event.target.play()
			}}
			onPause={(event) => {
				event.target.play()
			}}
			type="application/x-mpegURL"
		/>
	)
}

export default ReactHlsPlayer
