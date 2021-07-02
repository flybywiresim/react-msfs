import React, { useEffect, useState } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import { CanvasLayerController } from './CanvasLayer';
import { bearingToRad, degToRad } from '../utils';

interface AircraftProps {
    iconPath: string;
    iconWidth: number;
    iconHeight: number;
    positionLatLong: { lat: number, long: number };
    rotation: number;

    // Inherited from CanvasMap
    layerController?: CanvasLayerController;
    centerLla?: { lat: number, long: number };
    range?: number;
}

export const Icon: React.FC<AircraftProps> = ({ iconPath, iconWidth, iconHeight, positionLatLong, rotation, layerController, centerLla, range }) => {
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    const updatePosition = () => {
        const mapLatLong = new LatLon(centerLla.lat, centerLla.long);
        const startLatLong = new LatLon(positionLatLong.lat, positionLatLong.long);

        const distanceToStart = mapLatLong.distanceTo(startLatLong) / (1.29 * range);
        const angleToStart = bearingToRad(mapLatLong.initialBearingTo(startLatLong)) || 0;

        setDx(distanceToStart * Math.cos(angleToStart));
        setDy(distanceToStart * -Math.sin(angleToStart));
    };

    const repaint = () => {
        const icon = new Image();
        icon.src = iconPath;

        layerController?.use((canvas, context) => {
            const [x, y] = [(canvas.clientWidth / 2) + dx, (canvas.clientHeight / 2) + dy];

            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            context.save();
            context.translate(x, y);
            context.rotate(degToRad(rotation));
            context.translate(-iconWidth / 2, -iconHeight / 2);
            context.drawImage(icon, 0, 0, iconWidth, iconHeight);
            context.restore();
        });
    };

    useEffect(updatePosition, [positionLatLong, centerLla, range]);
    useEffect(repaint, [dx, dy, iconPath, iconWidth, iconHeight, rotation, layerController]);

    return <></>;
};
