import React, { useEffect } from 'react';
import { GeoPath } from '../utils';

interface GeoPathProps {
    geoPaths: GeoPath[];
    strokeWidth?: number;
    strokeColor?: string;
    outlineWidth?: number;
    outlineColor?: string;

    // Inherited from CanvasMap
    triggerRepaintGeometry?: () => void;
}

export const Geometry: React.FC<GeoPathProps> = ({
    geoPaths,
    strokeWidth,
    strokeColor,
    outlineWidth,
    outlineColor,
    triggerRepaintGeometry,
}) => {
    useEffect(triggerRepaintGeometry, [
        geoPaths,
        strokeWidth,
        strokeColor,
        outlineWidth,
        outlineColor,
    ]);

    return <></>;
};
