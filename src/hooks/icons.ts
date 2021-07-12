import { useEffect, useState } from 'react';

/**
 * Allows for pre-loading of images by triggering a state update when the image has been loaded.
 * @param imagePath
 */
export const useImageLoader = (imagePath: string) => {
    const [image, setImage] = useState<HTMLImageElement>();

    const loadImage = (path) => {
        const image = new Image();
        return new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = path;
        });
    };

    useEffect(() => {
        loadImage(imagePath).then((img) => setImage(img));
    }, []);

    return image;
};
