/* eslint-disable lines-between-class-members */
import React, { useEffect, useState } from 'react';

declare class LatLongAlt {
    lat: number;
    long: number;
    constructor(lat: number, long: number);
}

interface IconProps {
    position: LatLongAlt;
    icon?: HTMLImageElement;
    iconWidth?: number;
    iconHeight?: number;
    rotation?: number;
    text?: string;
    textFill?: string;
    textPosition?: string;
    fontFamily?: string;
    fontSize?: number;

    // Inherited from CanvasMap
    triggerRepaintIcons?: () => void;
}

export const Icon: React.FC<IconProps> = ({
    position,
    icon,
    iconWidth,
    iconHeight,
    rotation = 0,
    text,
    textFill,
    textPosition,
    fontFamily,
    fontSize,
    triggerRepaintIcons,
}) => {
    const [currentPosition, setCurrentPosition] = useState(position);

    useEffect(triggerRepaintIcons, [
        icon,
        iconWidth,
        iconHeight,
        rotation,
        text,
        textFill,
        textPosition,
        fontFamily,
        fontSize,
    ]);

    useEffect(() => {
        if (position.lat !== currentPosition.lat || position.long !== currentPosition.long) {
            setCurrentPosition(position);
            triggerRepaintIcons();
        }
    }, [position]);

    return <></>;
};
