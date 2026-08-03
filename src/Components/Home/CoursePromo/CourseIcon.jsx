import React from 'react'

export default function CourseIcon({ name }) {
	switch (name) {
		case 'calendar':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
		case 'clock':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
		case 'online':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 9h3M7 12h6" /></svg>
		case 'price':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 20V4h7a5 5 0 0 1 0 10H7M7 10h8M7 17h7" /></svg>
		case 'data':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>
		case 'forecast':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16" /><path d="m7 15 4-5 3 3 5-7" /><circle cx="7" cy="15" r="1" /><circle cx="11" cy="10" r="1" /><circle cx="14" cy="13" r="1" /><circle cx="19" cy="6" r="1" /></svg>
		case 'classification':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="7" r="2" /><circle cx="17" cy="7" r="2" /><circle cx="12" cy="17" r="2" /><path d="m8.8 8.2 2.3 6.6M15.2 8.2l-2.3 6.6M9 7h6" /></svg>
		case 'anomaly':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.7 19h18.6L12 3Z" /><path d="M12 9v4M12 16.5h.01" /></svg>
		case 'quality':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 8" /></svg>
		case 'trees':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v5M6 8h12M6 8v5M18 8v5M3 13h6v5H3zM15 13h6v5h-6zM9 18h6v3H9zM12 13v5" /></svg>
		case 'neural':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="m6.7 7 3.6 3.7M6.7 17l3.6-3.7M13.7 10.8l3.6-4.5M13.7 13.2l3.6 4.5" /></svg>
		case 'cases':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" /></svg>
		case 'code':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></svg>
		case 'certificate':
			return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M8 7h8M8 11h5M9 17l-1 4 4-2 4 2-1-4" /></svg>
		default:
			return null
	}
}