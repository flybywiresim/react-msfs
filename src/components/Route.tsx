import React, { useEffect, useState } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import { CanvasLayerController } from './CanvasLayer';
import { bearingToRad, degToRad } from '../utils';

export interface Leg {
    wpt1: WayPoint;
    wpt2: WayPoint;
}

export interface Transition {
    radius: number;
}

interface RouteProps {
    legs: Leg[];
    transitions: Transition[];
    strokeWidth: number;
    strokeColor: string;
    outlineWidth: number;
    outlineColor: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;

    // Inherited from CanvasMap
    layerController?: CanvasLayerController;
    centerLla?: { lat: number, long: number };
    range?: number;
    rotation?: number;
}

/**
 * Draws route with given parameters on the map CanvasLayer
 * @param legs List of legs
 * @param transitions List of transitions, Transition at index n is the transition before leg at index n
 * @param strokeWidth Route stroke width
 * @param strokeColor Route stroke color
 * @param outlineWidth Route outline width (must be larger than strokeWidth to be visible)
 * @param outlineColor Route outline color
 * @param fontFamily Waypoint identifier font family
 * @param fontSize Waypoint identifier font size
 * @param fontColor Waypoint identifier font color
 * @param centerLla (Inherited from CanvasMap)
 * @param range (Inherited from CanvasMap)
 * @param rotation (Inherited from CanvasMap)
 * @param layerController (Inherited from CanvasMap)
 */
export const Route: React.FC<RouteProps> = ({
    legs, transitions, strokeWidth, strokeColor, outlineWidth, outlineColor,
    fontFamily, fontSize, fontColor, centerLla, range, rotation, layerController,
}) => {
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    const latLonFromWaypoint = (waypoint: WayPoint) => new LatLon(waypoint.infos.coordinates.lat, waypoint.infos.coordinates.long);

    const updatePosition = () => {
        const mapLatLong = new LatLon(centerLla.lat, centerLla.long);
        const startLatLong = latLonFromWaypoint(legs[0].wpt1);

        const distanceToStart = (mapLatLong.distanceTo(startLatLong)) / (1.29 * range);
        const angleToStart = bearingToRad(mapLatLong.initialBearingTo(startLatLong)) || 0;

        setDx(distanceToStart * Math.cos(angleToStart));
        setDy(distanceToStart * -Math.sin(angleToStart));
    };

    const repaint = () => {
        layerController?.use((canvas, context) => {
            let [x, y] = [(canvas.clientWidth / 2) + dx, (canvas.clientHeight / 2) + dy];

            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            context.moveTo(x, y);
            context.beginPath();
            context.font = `${fontSize}px ${fontFamily}`;
            context.fillStyle = fontColor;
            for (let i = 0; i < legs.length - 1; i++) {
                const leg1wpt1 = latLonFromWaypoint(legs[i].wpt1);
                const leg1wpt2 = latLonFromWaypoint(legs[i].wpt2);
                const leg2wpt1 = latLonFromWaypoint(legs[i + 1].wpt1);
                const leg2wpt2 = latLonFromWaypoint(legs[i + 1].wpt2);
                const leg1dist = (leg1wpt1.distanceTo(leg1wpt2) * canvas.clientWidth) / (1852 * range);
                const leg1angle = bearingToRad(leg1wpt1.initialBearingTo(leg1wpt2));
                const leg2dist = (leg2wpt1.distanceTo(leg2wpt2) * canvas.clientWidth) / (1852 * range);
                const leg2angle = bearingToRad(leg2wpt1.initialBearingTo(leg2wpt2));

                context.arcTo(
                    x += leg1dist * Math.cos(leg1angle),
                    y += leg1dist * -Math.sin(leg1angle),
                    x + leg2dist * Math.cos(leg2angle),
                    y + leg2dist * -Math.sin(leg2angle),
                    (transitions[i].radius * canvas.clientWidth) / range,
                );

                context.save();
                context.translate(x, y);
                context.rotate(degToRad(-rotation));
                context.translate(-x, -y);
                context.fillText(legs[i].wpt2.ident, x, y);
                context.restore();
            }
            context.lineWidth = outlineWidth;
            context.strokeStyle = outlineColor;
            context.stroke();
            context.lineWidth = strokeWidth;
            context.strokeStyle = strokeColor;
            context.stroke();
        });
    };

    useEffect(updatePosition, [centerLla, range, layerController]);
    useEffect(repaint, [
        dx, dy, legs, transitions, strokeWidth, strokeColor, outlineWidth,
        outlineColor, fontFamily, fontSize, fontColor, rotation, layerController,
    ]);

    return <></>;
};
