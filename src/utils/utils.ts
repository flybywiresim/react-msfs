import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';

/**
 * Converts a bearing to a cartesian angle in radians
 * @param bearing
 */
export function bearingToRad(bearing: number): number {
    return ((450 - bearing) % 360) * (Math.PI / 180);
}

/**
 * Converts from degrees to radians
 * @param degrees
 */
export function degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Given canvas context, converts a LatLon coordinate to the corresponding pixel location on the canvas
 * @param latLon
 * @param mapCenter
 * @param range
 * @param canvasWidth
 */
export function latLonToPx(latLon: LatLon, mapCenter: LatLon, range: number, canvasWidth: number): [number, number] {
    const distanceToStart = (mapCenter.distanceTo(latLon)) / (3.02 * range);
    const angleToStart = bearingToRad(mapCenter.initialBearingTo(latLon)) || 0;

    const x = canvasWidth / 2 + distanceToStart * Math.cos(angleToStart);
    const y = canvasWidth / 2 + distanceToStart * -Math.sin(angleToStart);

    return [x, y];
}
