export function convertTimeString(time) {
  const [minutes, seconds] = time.split(":");

  const totalSeconds = Number(minutes) * 60 + Number(seconds);

  return totalSeconds;
}
