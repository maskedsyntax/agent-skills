export const secondsToFrames = (seconds: number, fps: number): number =>
  Math.round(seconds * fps);

export type ShotSpec = {
  id: string;
  from: number;
  duration: number;
};

export const layoutShots = (
  shots: {id: string; seconds: number}[],
  fps: number,
  overlap = 0,
): ShotSpec[] => {
  const laid: ShotSpec[] = [];
  shots.forEach((shot) => {
    const previous = laid[laid.length - 1];
    const from = previous ? previous.from + previous.duration - overlap : 0;
    laid.push({
      id: shot.id,
      from,
      duration: secondsToFrames(shot.seconds, fps),
    });
  });
  return laid;
};

export const totalFrames = (shots: ShotSpec[]): number => {
  const last = shots[shots.length - 1];
  return last ? last.from + last.duration : 0;
};
