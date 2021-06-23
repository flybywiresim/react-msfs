import React, { FC, useEffect, useRef, useState } from 'react';

export type CanvasLayerProps = {
    onUpdatedDrawingCanvasController: (controller: CanvasLayerController) => void,
}

export const CanvasLayer: FC<CanvasLayerProps> = ({ onUpdatedDrawingCanvasController }) => {
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
            width="100%"
            height="100%"
        />
    );
};

export type CanvasLayerControllerUsage = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;

export class CanvasLayerController {
    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D,
    ) {}

    use(func: CanvasLayerControllerUsage) {
        func(this.canvas, this.context);
    }
}
