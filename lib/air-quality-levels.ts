import type { AirQualityLevel } from "./types";

export const AQI_LEVEL_LABELS: Record<AirQualityLevel, string> = {
  bon: "Bon",
  moyen: "Moyen",
  degrade: "Dégradé",
  mauvais: "Mauvais",
  "tres-mauvais": "Très mauvais",
  extreme: "Extrême",
};

export const AQI_LEVEL_ADVICE: Record<AirQualityLevel, string> = {
  bon: "L'air est sain, profitez pleinement des activités en extérieur.",
  moyen: "Qualité de l'air acceptable pour la majorité des personnes.",
  degrade: "Les personnes sensibles devraient réduire les efforts prolongés en extérieur.",
  mauvais: "Réduisez les activités physiques prolongées en extérieur.",
  "tres-mauvais": "Évitez les efforts en extérieur, en particulier les personnes sensibles.",
  extreme: "Limitez au maximum les sorties en extérieur.",
};

export const AQI_LEVEL_COLOR_VAR: Record<AirQualityLevel, string> = {
  bon: "var(--color-aqi-bon)",
  moyen: "var(--color-aqi-moyen)",
  degrade: "var(--color-aqi-degrade)",
  mauvais: "var(--color-aqi-mauvais)",
  "tres-mauvais": "var(--color-aqi-tres-mauvais)",
  extreme: "var(--color-aqi-extreme)",
};
