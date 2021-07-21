import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { GeoPath } from './GeoPath';

/**
 * Converts a bearing to a cartesian angle in radians
 * @param bearing
 */
export const bearingToRad = (bearing: number): number => ((450 - bearing) % 360) * (Math.PI / 180);

/**
 * Converts from degrees to radians
 * @param degrees
 */
export const degToRad = (degrees: number): number => (degrees * Math.PI) / 180;

/**
 * Given canvas context, converts a LatLon coordinate to the corresponding pixel location on the canvas
 * @param latLon
 * @param mapCenter
 * @param range
 * @param canvasWidth
 */
export const latLonToPx = (latLon: LatLon, mapCenter: LatLon, range: number, canvasWidth: number): [number, number] => {
    const distanceToStart = (mapCenter.distanceTo(latLon)) / (3.02 * range);
    const angleToStart = bearingToRad(mapCenter.initialBearingTo(latLon)) || 0;

    const x = canvasWidth / 2 + distanceToStart * Math.cos(angleToStart);
    const y = canvasWidth / 2 + distanceToStart * -Math.sin(angleToStart);

    return [x, y];
};
