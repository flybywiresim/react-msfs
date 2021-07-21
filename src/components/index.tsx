import React, { useEffect, useRef, useState } from 'react';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { CanvasLayer, CanvasLayerController } from './CanvasLayer';
import { degToRad, GeoArc, latLonToPx } from '../utils';
import { Geometry } from './Geometry';
import { BingMap } from './BingMap';
import { Icon } from './Icon';
import { SimVarProvider } from '../hooks';

declare class LatLongAlt {
    lat: number;

    long: number;

    constructor(lat: number, long: number);
}

type CanvasMapProps = {
    bingConfigFolder: string;
    mapId: string;
    centerLla: LatLongAlt;
    showMap?: boolean;
    range?: number;
    heading?: number;
    rotation?: number;
    children?: React.ReactNode;
};

const DEFAULT_RANGE = 80;

export const CanvasMap: React.FC<CanvasMapProps> = ({
    bingConfigFolder,
    mapId,
    centerLla,
    showMap = true,
    range = DEFAULT_RANGE,
    rotation = 0,
    children = null,
}) => {
    const [mapLayerController, setMapLayerController] = useState<CanvasLayerController>();
    const [iconLayerController, setIconLayerController] = useState<CanvasLayerController>();
    const [updateIcons, setUpdateIcons] = useState(false);
    const [updateGeometry, setUpdateGeometry] = useState(false);
    const [mapCenter, setMapCenter] = useState(new LatLon(centerLla.lat, centerLla.long));

    const mapContainerRef = useRef<HTMLDivElement>(null);

    let mapSize = 100;
    let mapRange = range;
    if (mapContainerRef.current) {
        mapSize = Math.hypot(mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
        mapRange = range / (mapContainerRef.current.clientHeight / mapSize);
    }

    const triggerRepaintIcons = () => setUpdateIcons(!updateIcons);

    const repaintIcons = () => {
        iconLayerController?.use((canvas, context) => {
            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            React.Children.forEach(children, (child: React.ReactElement) => {
                if (child && child.type === Icon) {
                    const coords = new LatLon(child.props.position.lat, child.props.position.long);
                    const [x, y] = latLonToPx(coords, mapCenter, range, mapSize);

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

    const triggerRepaintGeometry = () => setUpdateGeometry(!updateGeometry);

    const repaintGeometry = () => {
        mapLayerController?.use((canvas, context) => {
            context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

            React.Children.forEach(children, (child: React.ReactElement) => {
                if (child && child.type === Geometry) {
                    if (child.props.geoPaths.length < 1) return;

                    const newPath = new Path2D();
                    newPath.moveTo(...latLonToPx(child.props.geoPaths[0].start, mapCenter, range, mapSize));

                    for (const path of child.props.geoPaths) {
                        const [endX, endY] = latLonToPx(path.end, mapCenter, range, mapSize);

                        if (path instanceof GeoArc) {
                            const [controlX, controlY] = latLonToPx(path.control, mapCenter, range, mapSize);
                            newPath.arcTo(controlX, controlY, endX, endY, (path.radius * mapSize) / (3.02 * range));
                        } else {
                            newPath.lineTo(endX, endY);
                        }
                    }

                    context.beginPath();
                    context.lineWidth = child.props.outlineWidth ?? 1;
                    context.strokeStyle = child.props.outlineColor ?? 'white';
                    context.stroke(newPath);

                    context.beginPath();
                    context.lineWidth = child.props.strokeWidth ?? 1;
                    context.strokeStyle = child.props.strokeColor ?? 'white';
                    context.stroke(newPath);
                }
            });
        });
    };

    useEffect(repaintIcons, [updateIcons, centerLla, range, children, iconLayerController]);
    useEffect(repaintGeometry, [updateGeometry, centerLla, range, children, mapLayerController]);

    useEffect(() => {
        if (centerLla.lat !== mapCenter.lat || centerLla.long !== mapCenter.lon) {
            setMapCenter(new LatLon(centerLla.lat, centerLla.long));
        }
    }, [centerLla]);

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
                <CanvasLayer onUpdatedDrawingCanvasController={setMapLayerController} canvasSize={mapSize} />
                <CanvasLayer onUpdatedDrawingCanvasController={setIconLayerController} canvasSize={mapSize} />
                {showMap && <BingMap configFolder={bingConfigFolder} mapId={mapId} centerLla={centerLla} range={mapRange} />}
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
                            if (!child) return child;
                            if (child.type === Geometry) {
                                return React.cloneElement(child, { triggerRepaintGeometry });
                            }
                            if (child.type === Icon) {
                                return React.cloneElement(child, { triggerRepaintIcons });
                            }
                            return child;
                        })}
                    </SimVarProvider>
                </div>
            </div>
        </div>
    );
};
