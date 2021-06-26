import React from 'react';

interface AircraftProps {
    iconPath: string;
    rotation: number;
    style?: React.CSSProperties;
}

export const Aircraft: React.FC<AircraftProps> = ({ iconPath, rotation, style }) => (
    <img
        src={iconPath}
        alt=""
        style={{
            transform: `rotateZ(${rotation}deg)`,
            transformOrigin: 'center',
            position: 'absolute',
            zIndex: 5,
            ...style,
        }}
    />
);
