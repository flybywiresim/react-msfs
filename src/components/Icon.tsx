/* eslint-disable lines-between-class-members */
import React, { useEffect } from 'react';

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
    moving?: boolean;
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
    moving = false,
    text,
    textFill,
    textPosition,
    fontFamily,
    fontSize,
    triggerRepaintIcons,
}) => {
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

    if (moving) useEffect(triggerRepaintIcons, [position]);

    return <></>;
};
