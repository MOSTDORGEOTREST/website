/** Выравнивает live HLS-потоки по общей точке на таймлайне. */
export function syncLiveHlsVideos(videos) {
  const active = videos.filter(
    (v) => v && v.readyState >= 2 && v.seekable.length > 0
  );
  if (active.length === 0) return;

  const syncTime = Math.min(
    ...active.map((v) => {
      const end = v.seekable.end(v.seekable.length - 1);
      return end - 0.5;
    })
  );

  active.forEach((v) => {
    const start = v.seekable.start(0);
    const end = v.seekable.end(v.seekable.length - 1);
    const target = Math.max(start, Math.min(syncTime, end - 0.1));
    if (Math.abs(v.currentTime - target) > 0.05) {
      v.currentTime = target;
    }
  });

  return Promise.all(active.map((v) => v.play().catch(() => {})));
}
