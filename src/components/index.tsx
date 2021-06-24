import React, { FC, RefObject, useEffect, useRef, useState } from 'react';
import { BingMap } from './BingMap';
import { CanvasLayer, CanvasLayerController } from './CanvasLayer';
import { useUpdate } from '../hooks';
import map from '../../../../Pages/map';

export type BingMapProps = {
    bingConfigFolder: string;
    mapId: string;
    centerLla: { lat: number; long: number };
    range?: number;
    heading?: number;
    rotation?: number;
};

const DEFAULT_RANGE = 80;

const rotation = 0;

const colors = ['blue', 'red', 'green', 'yellow', 'purple'];

export const CanvasMap: FC<BingMapProps> = ({
    bingConfigFolder,
    mapId,
    centerLla,
    range = DEFAULT_RANGE,
    rotation = 0
}) => {
    const [layerController, setLayerController] = useState<CanvasLayerController>();

    const mapContainerRef = useRef<HTMLDivElement>(null);

    useUpdate((deltaTime: number) => {
        layerController?.use((canvas, context) => {
            rotation += 1000 * deltaTime;
            rotation %= 360;

            context.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
            // context.rotate(rotation * (Math.PI / 180));
            const colorIndex = Math.round(Math.random() * colors.length);
            // console.log(`color: ${colorIndex}`);
            context.fillStyle = colors[colorIndex];
            context.fillRect(10, 10, 50, 50);
        });
    });

    let mapSize;
    if (mapContainerRef.current) {
        mapSize = Math.hypot(mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
    }
    return (
        <div ref={mapContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                style={{
                    transform: `rotateZ(${rotation}deg) translateX(-50%) translateY(-50%)`,
                    transformOrigin: '0 0',
                    width: mapSize,
                    height: mapSize,
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                }}
            >
                <CanvasLayer onUpdatedDrawingCanvasController={setLayerController} />
                <BingMap configFolder={bingConfigFolder} mapId={mapId} centerLla={centerLla} range={range} />
            </div>
        </div>
    );
};
