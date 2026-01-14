"use client";

import { useState } from 'react';
import Image from 'next/image';

export default function ImageMagnifier({
    src,
    alt,
    width,
    height,
    magnifierHeight = 150,
    magnifierWidth = 150,
    zoomLevel = 2
}) {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [xy, setXY] = useState([0, 0]);
    const [imgSize, setImgSize] = useState([0, 0]);
    const [showLens, setShowLens] = useState(false);

    return (
        <div
            className="relative w-full h-full overflow-hidden cursor-none"
            onMouseEnter={(e) => {
                const elem = e.currentTarget;
                const { width, height } = elem.getBoundingClientRect();
                setImgSize([width, height]);
                setShowMagnifier(true);
            }}
            onMouseLeave={() => {
                setShowMagnifier(false);
            }}
            onMouseMove={(e) => {
                // Update cursor position
                const elem = e.currentTarget;
                const { top, left } = elem.getBoundingClientRect();
                const x = e.pageX - left - window.pageXOffset;
                const y = e.pageY - top - window.pageYOffset;
                setXY([x, y]);
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                priority
            />

            {showMagnifier && (
                <div
                    style={{
                        display: "block",
                        position: "absolute",
                        pointerEvents: "none",
                        height: `${magnifierHeight}px`,
                        width: `${magnifierWidth}px`,
                        top: `${xy[1] - magnifierHeight / 2}px`,
                        left: `${xy[0] - magnifierWidth / 2}px`,
                        opacity: "1",
                        border: "1px solid lightgray",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        backgroundImage: `url('${src}')`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: `${imgSize[0] * zoomLevel}px ${imgSize[1] * zoomLevel}px`,
                        backgroundPositionX: `${-xy[0] * zoomLevel + magnifierWidth / 2}px`,
                        backgroundPositionY: `${-xy[1] * zoomLevel + magnifierHeight / 2}px`,
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        zIndex: 100
                    }}
                />
            )}
        </div>
    );
}
