import React, { FC, useEffect, useState } from 'react';
import { BingMap } from './BingMap';
import { CanvasLayer, CanvasLayerController } from './CanvasLayer';
import { useUpdate } from '../hooks';

export type BingMapProps = {
    bingConfigFolder: string;
    mapId: string;
    centerLla: { lat: number; long: number };
    range?: number;
    heading?: number;
};

const DEFAULT_RANGE = 80;

let rotation = 0;

const colors = ['blue', 'red', 'green', 'yellow', 'purple'];

export const CanvasMap: FC<BingMapProps> = ({ bingConfigFolder, mapId, centerLla, range = DEFAULT_RANGE }) => {
    const [layerController, setLayerController] = useState<CanvasLayerController>();

    useUpdate((deltaTime: number) => {
        layerController?.use((canvas, context) => {
            rotation += 1000 * deltaTime;
            rotation %= 360;

            context.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
            // context.rotate(rotation * (Math.PI / 180));
            const colorIndex = Math.round(Math.random() * colors.length);
            console.log(`color: ${colorIndex}`);
            context.fillStyle = colors[colorIndex];
            context.fillRect(10, 10, 50, 50);
        });
    });

    return (
        <>
            <BingMap configFolder={bingConfigFolder} mapId={mapId} centerLla={centerLla} range={range} />

            <CanvasLayer onUpdatedDrawingCanvasController={setLayerController} />
        </>
    );
};
