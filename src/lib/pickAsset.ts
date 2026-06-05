/**
 * Находит URL ассета из результата import.meta.glob по уникальному фрагменту
 * имени файла. Позволяет ссылаться на файлы с кириллицей/пробелами без точного
 * перепечатывания имён (имена сохраняются как есть).
 */
export function pickByToken(files: Record<string, string>, token: string): string {
	const key = Object.keys(files).find((k) => k.includes(token))
	if (!key) throw new Error(`Asset not found for token: ${token}`)
	return files[key]
}
