export interface SkyGradient {
  from: string;
  via: string;
  to: string;
}

/**
 * Signature detail: the hero band's gradient mirrors the real sky over the
 * city being viewed — its actual weather code and day/night state — instead
 * of a fixed decorative background.
 */
export function getSkyGradient(weatherCode: number, isDay: boolean): SkyGradient {
  const isClear = weatherCode <= 1;
  const isCloudy = weatherCode === 2 || weatherCode === 3;
  const isFog = weatherCode === 45 || weatherCode === 48;
  const isSnow =
    (weatherCode >= 71 && weatherCode <= 77) || weatherCode === 85 || weatherCode === 86;
  const isStorm = weatherCode >= 95;
  const isRain =
    (weatherCode >= 51 && weatherCode <= 67) || weatherCode === 80 || weatherCode === 81 || weatherCode === 82;

  if (isStorm) {
    return { from: "#2b2d42", via: "#4a4e69", to: "#8d99ae" };
  }
  if (isSnow) {
    return isDay
      ? { from: "#8fa8c4", via: "#d9e6f2", to: "#f5f7fa" }
      : { from: "#1e2a3a", via: "#3c4f66", to: "#7c92a8" };
  }
  if (isFog) {
    return isDay
      ? { from: "#a9b4bc", via: "#cbd3d8", to: "#eef2f6" }
      : { from: "#232a30", via: "#3d454c", to: "#6b747b" };
  }
  if (isRain) {
    return isDay
      ? { from: "#4a6a80", via: "#7593a6", to: "#c4d3dc" }
      : { from: "#151c26", via: "#28374a", to: "#4a5e73" };
  }
  if (isCloudy) {
    return isDay
      ? { from: "#6d8ba3", via: "#a9c1d1", to: "#eef2f6" }
      : { from: "#1a2331", via: "#2f3f52", to: "#5a6c80" };
  }
  if (isClear) {
    return isDay
      ? { from: "#3a7ca5", via: "#7ec4e8", to: "#fbe9c9" }
      : { from: "#0b1120", via: "#1c2b4a", to: "#4a3a6b" };
  }
  return { from: "#3a7ca5", via: "#bcdcf0", to: "#f5f7fa" };
}
