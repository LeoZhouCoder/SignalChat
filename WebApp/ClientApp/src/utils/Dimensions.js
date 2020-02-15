export const SCREEN_SMALL = "SMALL";
export const SCREEN_MEDIUM = "MEDIUM";
export const SCREEN_NORMAL = "NORMAL";
export const SCREEN_BIG = "BIG";

export const getScreenType = (width, height) => {
  if (width > 1100) return SCREEN_BIG;
  if (width > 768) return SCREEN_NORMAL;
  if (width > 500) return SCREEN_MEDIUM;
  return SCREEN_SMALL;
};
