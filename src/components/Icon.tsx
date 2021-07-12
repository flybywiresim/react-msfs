import React, { useEffect } from 'react';

interface IconProps {
    icon?: HTMLImageElement;
    iconWidth: number;
    iconHeight: number;
    positionLatLong: { lat: number, long: number };
    rotation?: number;
    moving?: boolean;

    // Inherited from CanvasMap
    triggerRedrawIcons?: () => void;
}

/**
 * Places an icon with given parameters on the icon CanvasLayer
 * @param icon Pre-loaded HTMLImageElement
 * @param iconWidth Width of icon in px
 * @param iconHeight Height of icon in px
 * @param positionLatLong Latitude and Longitude of icon
 * @param rotation Rotation of icon in degrees
 * @param moving Flag to prevent constant re-painting of geostationary icons.
 * @param triggerRedrawIcons (Inherited from CanvasMap)
 */
export const Icon: React.FC<IconProps> = ({
    icon, iconWidth, iconHeight, positionLatLong,
    rotation = 0, moving = false, triggerRedrawIcons,
}) => {
    if (moving) useEffect(triggerRedrawIcons, [positionLatLong]);
    useEffect(triggerRedrawIcons, [icon, iconWidth, iconHeight, rotation]);

    return <></>;
};
