import type { SVGProps } from 'react'

/** Набор лёгких линейных иконок (currentColor) — единый премиальный стиль. */
type P = SVGProps<SVGSVGElement>

const base = {
	fill: 'none',
	stroke: 'currentColor',
	strokeWidth: 1.7,
	strokeLinecap: 'round' as const,
	strokeLinejoin: 'round' as const,
	viewBox: '0 0 24 24',
}

export const ChevronDown = (p: P) => (
	<svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>
)
export const ArrowRight = (p: P) => (
	<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const ArrowUpRight = (p: P) => (
	<svg {...base} {...p}><path d="M7 17 17 7M8 7h9v9" /></svg>
)
export const ArrowUp = (p: P) => (
	<svg {...base} {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
)
export const Phone = (p: P) => (
	<svg {...base} {...p}><path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1 3.2 2 2 0 0 1 3 1h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7.1 8.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7A2 2 0 0 1 21 16.5Z" /></svg>
)
export const Mail = (p: P) => (
	<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
)
export const MapPin = (p: P) => (
	<svg {...base} {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
)
export const Clock = (p: P) => (
	<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const Download = (p: P) => (
	<svg {...base} {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
)
export const FileText = (p: P) => (
	<svg {...base} {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
)
export const Globe = (p: P) => (
	<svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" /></svg>
)
export const Menu = (p: P) => (
	<svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const Close = (p: P) => (
	<svg {...base} {...p}><path d="M6 6 18 18M18 6 6 18" /></svg>
)
export const Play = (p: P) => (
	<svg {...base} {...p} fill="currentColor" stroke="none"><path d="M8 5v14l11-7z" /></svg>
)
export const Dot = (p: P) => (
	<svg {...p} viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
)
export const Live = (p: P) => (
	<svg {...base} {...p}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4M3.5 3.5a12 12 0 0 0 0 17M20.5 3.5a12 12 0 0 1 0 17" /></svg>
)
