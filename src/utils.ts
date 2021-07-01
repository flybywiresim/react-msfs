/**
 * Converts a bearing to a cartesian angle in radians
 * @param bearing
 */
export const bearingToRad = (bearing) => ((450 - bearing) % 360) * (Math.PI / 180);

/**
 * Converts from degrees to radians
 * @param degrees
 */
export const degToRad = (degrees) => (degrees * Math.PI) / 180;
