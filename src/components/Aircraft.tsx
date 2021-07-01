import React, { useEffect, useState } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js';
import { useSimVar } from '../hooks';
import { CanvasLayerController } from './CanvasLayer';
import { bearingToRad } from '../utils';

interface AircraftProps {
    iconPath: string;
    centerLla?: { lat: number, long: number };
    range?: number;
    rotation?: number;
    layerController?: CanvasLayerController;
    style?: React.CSSProperties;
}

export const Aircraft: React.FC<AircraftProps> = ({ iconPath, centerLla, range, style }) => {
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    const [headingTrue] = useSimVar('A:PLANE HEADING DEGREES TRUE', 'Degrees');
    const [latitude] = useSimVar('A:PLANE LATITUDE', 'Degrees');
    const [longitude] = useSimVar('A:PLANE LONGITUDE', 'Degrees');

    const updatePosition = () => {
        const mapLatLong = new LatLon(centerLla.lat, centerLla.long);
        const planeLatLong = new LatLon(latitude, longitude);

        const distance = mapLatLong.distanceTo(planeLatLong) / (1.29 * range);
        const angle = bearingToRad(mapLatLong.initialBearingTo(planeLatLong)) || 0;

        setDx(distance * Math.cos(angle));
        setDy(distance * -Math.sin(angle));
    };

    useEffect(updatePosition, [centerLla]);
    useEffect(updatePosition, [range]);

    return (
        <img
            src={iconPath}
            alt=""
            style={{
                transform: `rotateZ(${headingTrue}deg)`,
                transformOrigin: 'center',
                position: 'relative',
                zIndex: 5,
                left: dx,
                top: dy,
                ...style,
            }}
        />
    );
};
