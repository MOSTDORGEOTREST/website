/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.pdf' {
	const src: string
	export default src
}

declare module '*.xlsx' {
	const src: string
	export default src
}
