import React, { FC, useEffect, useRef, useState } from 'react';

export type CanvasLayerProps = {
    onUpdatedDrawingCanvasController: (controller: CanvasLayerController) => void;
    canvasSize: number;
};

export const CanvasLayer: FC<CanvasLayerProps> = ({ onUpdatedDrawingCanvasController, canvasSize }) => {
    const canvasRef = useRef<HTMLCanvasElement>();

    const [context, setContext] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        if (canvasRef) {
            setContext(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);

    useEffect(() => {
        if (context && canvasRef.current) {
            onUpdatedDrawingCanvasController(new CanvasLayerController(canvasRef.current, context));
        } else {
            onUpdatedDrawingCanvasController(null);
        }
    }, [context]);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: 'absolute' }}
            width={canvasSize}
            height={canvasSize}
        />
    );
};

export type CanvasLayerControllerUsage = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;

export class CanvasLayerController {
    constructor(private canvas: HTMLCanvasElement, private context: CanvasRenderingContext2D) {}

    use(func: CanvasLayerControllerUsage) {
        func(this.canvas, this.context);
    }
}
