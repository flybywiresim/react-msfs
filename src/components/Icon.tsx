import React, { useEffect } from 'react';

interface IconProps {
    icon?: HTMLImageElement;
    iconWidth?: number;
    iconHeight?: number;
    positionLatLong: { lat: number, long: number };
    rotation?: number;
    moving?: boolean;
    text?: string;
    textFill?: string;
    textPosition?: string;
    fontFamily?: string;
    fontSize?: number;

    // Inherited from CanvasMap
    triggerRedrawIcons?: () => void;
}

/**
 * Places an icon with given parameters on the icon CanvasLayer.
 * An icon can be drawn with or without text, as well as without
 * an image to simply place text on the Canvas.
 * @param icon HTMLImageElement, will not draw unless loaded
 * @param iconWidth px
 * @param iconHeight px
 * @param positionLatLong
 * @param rotation degrees
 * @param moving
 * @param text
 * @param textFill
 * @param textPosition top, left, bottom, right
 * @param fontFamily
 * @param fontSize
 * @param triggerRedrawIcons (Inherited from CanvasMap)
 */
export const Icon: React.FC<IconProps> = ({
    icon, iconWidth, iconHeight, positionLatLong, rotation = 0, moving = false,
    text, textFill, textPosition, fontFamily, fontSize, triggerRedrawIcons,
}) => {
    if (moving) useEffect(triggerRedrawIcons, [positionLatLong]);
    useEffect(triggerRedrawIcons, [
        icon, iconWidth, iconHeight, rotation, text,
        textFill, textPosition, fontFamily, fontSize,
    ]);

    return <></>;
};
