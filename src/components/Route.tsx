import React, { useEffect } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import { CanvasLayerController } from './CanvasLayer';
import { bearingToRad, degToRad } from '../utils';

interface RouteProps {
    centerLla?: { lat: number, long: number };
    range?: number;
    rotation?: number;
    layerController?: CanvasLayerController;
    waypoints: any[];
    strokeWidth: number;
    strokeColor: string;
    outlineWidth: number;
    outlineColor: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
}

export const Route: React.FC<RouteProps> = ({
    centerLla, range, rotation, layerController, waypoints,
    strokeWidth, strokeColor, outlineWidth, outlineColor,
    fontFamily, fontSize, fontColor,
}) => {
    useEffect(() => {
        const mapLatLong = new LatLon(centerLla.lat, centerLla.long);
        const startLatLong = new LatLon(waypoints[0].infos.coordinates.lat, waypoints[1].infos.coordinates.long);

        const distanceToStart = (mapLatLong.distanceTo(startLatLong)) / (1.29 * range);
        const angleToStart = bearingToRad(mapLatLong.initialBearingTo(startLatLong)) || 0;

        const dx = distanceToStart * Math.cos(angleToStart);
        const dy = distanceToStart * -Math.sin(angleToStart);

        layerController?.use((canvas, context) => {
            let [x, y] = [(canvas.clientWidth / 2) + dx, (canvas.clientHeight / 2) + dy];

            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            context.beginPath();
            context.moveTo(x, y);
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = fontColor;
            for (const waypoint of waypoints) {
                const distance = (waypoint.distanceInFP * canvas.clientWidth) / range;
                const angle = bearingToRad(waypoint.bearingInFP);

                context.lineTo(x += distance * Math.cos(angle), y += distance * -Math.sin(angle));

                context.save();
                context.translate(x, y);
                context.rotate(degToRad(-rotation));
                context.translate(-x, -y);
                context.fillText(waypoint.ident, x, y);
                context.restore();
            }
            context.lineWidth = outlineWidth;
            context.strokeStyle = outlineColor;
            context.stroke();
            context.lineWidth = strokeWidth;
            context.strokeStyle = strokeColor;
            context.stroke();
        });
    }, [layerController, waypoints, centerLla, range]);

    return <></>;
};
