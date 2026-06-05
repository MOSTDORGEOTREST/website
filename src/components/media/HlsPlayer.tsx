import Hls, { type HlsConfig } from 'hls.js'
import { useEffect, type RefObject, type VideoHTMLAttributes } from 'react'

interface HlsPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
	src: string
	autoPlay?: boolean
	hlsConfig?: Partial<HlsConfig>
	playerRef: RefObject<HTMLVideoElement | null>
}

/**
 * Проигрыватель HLS на hls.js. Логика инициализации/восстановления потоков
 * сохранена из исходного компонента без изменений.
 */
export function HlsPlayer({ hlsConfig, playerRef, src, autoPlay, ...props }: HlsPlayerProps) {
	useEffect(() => {
		let hls: Hls | undefined
		const video = playerRef.current

		function initPlayer() {
			if (hls != null) hls.destroy()

			const newHls = new Hls({
				enableWorker: false,
				backBufferLength: 30,
				liveBackBufferLength: 30,
				maxBufferLength: 30,
				...hlsConfig,
			})

			if (video != null) newHls.attachMedia(video)

			newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
				newHls.loadSource(src)
				newHls.on(Hls.Events.MANIFEST_PARSED, () => {
					if (autoPlay) {
						playerRef.current
							?.play()
							.catch(() =>
								console.log('Unable to autoplay prior to user interaction with the dom.')
							)
					}
				})
			})

			newHls.on(Hls.Events.ERROR, (_event, data) => {
				if (data.fatal) {
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							newHls.startLoad()
							break
						case Hls.ErrorTypes.MEDIA_ERROR:
							newHls.recoverMediaError()
							break
						default:
							initPlayer()
							break
					}
				}
			})

			hls = newHls
		}

		if (Hls.isSupported()) initPlayer()

		return () => {
			if (hls != null) hls.destroy()
			if (video != null) {
				video.pause()
				video.removeAttribute('src')
				video.load()
			}
		}
	}, [autoPlay, hlsConfig, playerRef, src])

	if (Hls.isSupported()) {
		return <video ref={playerRef} {...props} />
	}

	// Запасной вариант — нативный HLS (Safari).
	return (
		<video
			muted
			ref={playerRef}
			src={src}
			autoPlay={autoPlay}
			{...props}
			onLoadedMetadata={(e) => {
				;(e.target as HTMLVideoElement).play()
			}}
			onPause={(e) => {
				;(e.target as HTMLVideoElement).play()
			}}
		/>
	)
}
