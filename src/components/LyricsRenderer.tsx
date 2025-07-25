import React from 'react';
import { LyricItem } from '../data/lyrics';

interface LyricsRendererProps {
    lyrics: LyricItem[];
    scrollPosition?: number;
    isScrolling?: boolean;
}

/**
 * Component for rendering song lyrics with proper styling
 */
const LyricsRenderer: React.FC<LyricsRendererProps> = ({
    lyrics,
    scrollPosition = 0,
    isScrolling = false
}) => {
    // Reference to get container height for scrolling calculation
    const containerRef = React.useRef<HTMLDivElement>(null);

    return (
        <div
            ref={containerRef}
            className="text-center text-gray-300 leading-relaxed text-sm overflow-y-hidden"
            style={{
                height: "200px",
                transform: isScrolling ? `translateY(-${scrollPosition}px)` : 'translateY(0)',
                transition: isScrolling ? 'none' : 'transform 0.5s ease-out'
            }}
        >
            {lyrics.map((item, index) => {
                switch (item.type) {
                    case 'heading':
                        return <p key={index} className="mb-3 font-bold text-cyber-blue">{item.text}</p>;
                    case 'subheading':
                        return <p key={index} className="mb-1 text-xs text-gray-400 italic mt-4">{item.text}</p>;
                    case 'line':
                        return <p key={index} className="mb-3">{item.text}</p>;
                    case 'note':
                        return <p key={index} className="mb-3 text-xs text-gray-400 italic">{item.text}</p>;
                    case 'spacer':
                        return <div key={index} className="h-2"></div>;
                    default:
                        return <p key={index}>{item.text}</p>;
                }
            })}
        </div>
    );
};

export default LyricsRenderer;
