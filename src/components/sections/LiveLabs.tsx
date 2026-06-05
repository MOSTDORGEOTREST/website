import { createRef, useCallback, useEffect, useRef, useState, type RefObject } from 'react'

import offCam from '@/assets/labs/OFFCAM.png'
import { HlsPlayer } from '@/components/media/HlsPlayer'
import { syncLiveHlsVideos } from '@/components/media/labsStreamSync'
import { Section, SectionHeading } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/motion'
import { GradientMesh } from '@/components/ui/GradientMesh'
import { cn } from '@/lib/cn'
import { labStreams } from '@/data/labStreams'

const STREAM_STAGGER_MS = 700
const SYNC_FALLBACK_MS = 12000

function StreamCard({
	src,
	title,
	index,
	playerRef,
	onStreamPlaying,
}: {
	src: string
	title: string
	index: number
	playerRef: RefObject<HTMLVideoElement | null>
	onStreamPlaying: (index: number) => void
}) {
	const [loadStream, setLoadStream] = useState(false)
	const [streamReady, setStreamReady] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setLoadStream(true), index * STREAM_STAGGER_MS)
		return () => clearTimeout(timer)
	}, [index])

	const handlePlaying = () => {
		setStreamReady(true)
		onStreamPlaying(index)
	}

	return (
		<Reveal delay={(index % 3) * 0.08} className="h-full">
			<div className="glass group h-full overflow-hidden rounded-3xl p-2.5 transition-all duration-300 hover:-translate-y-1">
				<div className="relative aspect-video overflow-hidden rounded-2xl bg-ink/90">
					<img
						src={offCam}
						alt=""
						aria-hidden={streamReady}
						className={cn(
							'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
							streamReady ? 'opacity-0' : 'opacity-100'
						)}
					/>
					{loadStream && (
						<HlsPlayer
							src={src}
							playerRef={playerRef}
							autoPlay
							muted
							loop
							controls={false}
							playsInline
							preload="none"
							onPlaying={handlePlaying}
							className={cn(
								'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
								streamReady ? 'opacity-100' : 'opacity-0'
							)}
						/>
					)}
					<span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/55 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
						<span className="size-1.5 animate-pulse-glow rounded-full bg-red-500" />
						Live
					</span>
				</div>
				<h3 className="px-2 pb-1 pt-3 text-[0.95rem] font-semibold text-ink">{title}</h3>
			</div>
		</Reveal>
	)
}

export function LiveLabs() {
	const playerRefs = useRef(labStreams.map(() => createRef<HTMLVideoElement>()))
	const readyIndices = useRef(new Set<number>())
	const syncStarted = useRef(false)

	const runSync = useCallback(() => {
		if (syncStarted.current) return
		syncStarted.current = true
		syncLiveHlsVideos(playerRefs.current.map((r) => r.current))
	}, [])

	const handleStreamPlaying = useCallback(
		(index: number) => {
			readyIndices.current.add(index)
			if (readyIndices.current.size >= labStreams.length) runSync()
		},
		[runSync]
	)

	useEffect(() => {
		const lastStagger = (labStreams.length - 1) * STREAM_STAGGER_MS
		const timer = setTimeout(() => {
			if (readyIndices.current.size > 0) runSync()
		}, lastStagger + SYNC_FALLBACK_MS)
		return () => clearTimeout(timer)
	}, [runSync])

	return (
		<Section id="labs" className="relative overflow-hidden py-20 sm:py-28">
			<GradientMesh intensity="soft" />
			<div className="container-site relative">
				<SectionHeading
					eyebrow={
						<span className="inline-flex items-center gap-2">
							<span className="size-1.5 animate-pulse-glow rounded-full bg-red-500" />
							В эфире
						</span>
					}
					title="Прямая видео трансляция"
					subtitle="Наблюдайте за работой лаборатории в реальном времени — испытания идут прямо сейчас."
					align="center"
					className="mx-auto items-center text-center"
				/>

				<div className="mt-12 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{labStreams.map((stream, index) => (
						<StreamCard
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
		</Section>
	)
}
