export interface LabStream {
	src: string
	title: string
}

/** 6 live HLS-трансляций (адреса и подписи без изменений). */
export const labStreams: LabStream[] = [
	{ src: 'https://mdgt.ru/hls/1/index.m3u8', title: 'Исследование физических свойств' },
	{ src: 'https://mdgt.ru/hls/2/index.m3u8', title: 'Регистрация образцов' },
	{ src: 'https://mdgt.ru/hls/3/index.m3u8', title: 'Исследование механических свойств' },
	{ src: 'https://mdgt.ru/hls/4/index.m3u8', title: 'Исследование физических свойств' },
	{ src: 'https://mdgt.ru/hls/5/index.m3u8', title: 'Исследование химических свойств' },
	{ src: 'https://mdgt.ru/hls/6/index.m3u8', title: 'Исследование скальных грунтов' },
]
