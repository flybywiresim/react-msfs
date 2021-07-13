import React, { useEffect, useRef, useState } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { BingMap } from './BingMap';
import { CanvasLayer, CanvasLayerController } from './CanvasLayer';
import { bearingToRad, degToRad } from '../utils';
import { SimVarProvider } from '../hooks';
import { Route } from './Route';
import { Icon } from './Icon';

export type BingMapProps = {
    bingConfigFolder: string;
    mapId: string;
    centerLla: { lat: number; long: number };
    range?: number;
    heading?: number;
    rotation?: number;
    children?: React.ReactNode;
};

const DEFAULT_RANGE = 80;

export const CanvasMap: React.FC<BingMapProps> = ({
    bingConfigFolder,
    mapId,
    centerLla,
    range = DEFAULT_RANGE,
    rotation = 0,
    children = null,
}) => {
    const [mapLayerController, setMapLayerController] = useState<CanvasLayerController>();
    const [iconLayerController, setIconLayerController] = useState<CanvasLayerController>();
    const [updateIcons, setUpdateIcons] = useState(false);

    const mapContainerRef = useRef<HTMLDivElement>(null);

    let mapSize;
    if (mapContainerRef.current) {
        mapSize = Math.hypot(mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
    }

    const triggerRedrawIcons = () => setUpdateIcons(!updateIcons);

    const redrawIcons = () => {
        iconLayerController?.use((canvas, context) => {
            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            React.Children.forEach(children, (child: React.ReactElement) => {
                if (child.type === Icon) {
                    const mapLatLong = new LatLon(centerLla.lat, centerLla.long);
                    const startLatLong = new LatLon(child.props.positionLatLong.lat, child.props.positionLatLong.long);

                    const distanceToStart = mapLatLong.distanceTo(startLatLong) / (1.29 * range);
                    const angleToStart = bearingToRad(mapLatLong.initialBearingTo(startLatLong)) || 0;

                    const x = (canvas.clientWidth / 2) + distanceToStart * Math.cos(angleToStart);
                    const y = (canvas.clientWidth / 2) + distanceToStart * -Math.sin(angleToStart);

                    context.save();
                    context.translate(x, y);
                    context.rotate(degToRad(child.props.rotation));
                    context.translate(-child.props.iconWidth / 2, -child.props.iconHeight / 2);
                    if (child.props.icon && child.props.icon.complete) {
                        context.drawImage(child.props.icon, 0, 0, child.props.iconWidth, child.props.iconHeight);
                    }
                    if (child.props.text) {
                        let textX;
                        let textY;
                        switch (child.props.textPosition) {
                        case 'top':
                            context.textBaseline = 'bottom';
                            context.textAlign = 'center';
                            textX = child.props.iconHeight / 2;
                            textY = 0;
                            break;
                        case 'left':
                            context.textBaseline = 'middle';
                            context.textAlign = 'right';
                            textX = -child.props.iconWidth / 4;
                            textY = child.props.iconHeight / 2;
                            break;
                        case 'bottom':
                            context.textBaseline = 'top';
                            context.textAlign = 'center';
                            textX = child.props.iconHeight / 2;
                            textY = child.props.iconWidth * 0.75;
                            break;
                        case 'right':
                        default:
                            context.textBaseline = 'middle';
                            context.textAlign = 'left';
                            textX = child.props.iconWidth * 1.25;
                            textY = child.props.iconHeight / 2;
                        }
                        context.fillStyle = child.props.textFill;
                        context.font = `${child.props.fontSize}px ${child.props.fontFamily}`;
                        context.fillText(child.props.text, textX, textY);
                    }
                    context.restore();
                }
            });
        });
    };

    useEffect(redrawIcons, [updateIcons, centerLla, range, children, iconLayerController]);

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
                <CanvasLayer onUpdatedDrawingCanvasController={setMapLayerController} containerRef={mapContainerRef} />
                <CanvasLayer onUpdatedDrawingCanvasController={setIconLayerController} containerRef={mapContainerRef} />
                <BingMap configFolder={bingConfigFolder} mapId={mapId} centerLla={centerLla} range={range} />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >
                    <SimVarProvider>
                        {React.Children.map(children, (child: any) => {
                            if (child.type === Route) {
                                return React.cloneElement(child, { layerController: mapLayerController, centerLla, range, rotation });
                            }
                            if (child.type === Icon) {
                                return React.cloneElement(child, { triggerRedrawIcons });
                            }
                            return child;
                        })}
                    </SimVarProvider>
                </div>
            </div>
        </div>
    );
};
