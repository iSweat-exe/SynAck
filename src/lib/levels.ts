export const LEVELS = ["Débutant", "Intermédiaire", "Avancé"] as const;
export type Level = (typeof LEVELS)[number];
