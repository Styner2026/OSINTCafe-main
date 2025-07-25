import React, { useEffect, useRef, useState } from 'react';
import { allLyrics, LyricItem } from '../data/lyrics';

interface LyricsDisplayProps {
    currentTrack: number;
    isPlaying: boolean;
}/**
 * Component for displaying and animating song lyrics
 */
const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ currentTrack, isPlaying }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const lyricsContainerRef = useRef<HTMLDivElement>(null);

    // Current song data
    const currentSong = allLyrics[currentTrack];

    // Handle scrolling for all tracks
    useEffect(() => {
        if (isPlaying && lyricsContainerRef.current) {
            let animationId: number;

            // Add initial delay before scrolling starts (5 seconds)
            const delayTimeout = setTimeout(() => {
                const animate = () => {
                    setScrollPosition(prevPos => {
                        if (!lyricsContainerRef.current) return prevPos;

                        // Get the parent container (the one with overflow hidden)
                        const parentContainer = lyricsContainerRef.current.parentElement;
                        if (!parentContainer) return prevPos;

                        // Get the total scrollable height
                        const containerHeight = parentContainer.clientHeight;
                        const contentHeight = lyricsContainerRef.current.scrollHeight;
                        const maxScroll = Math.max(0, contentHeight - containerHeight + 50); // Add some padding

                        // If there's no content to scroll, don't animate
                        if (maxScroll <= 0) return 0;

                        // Slower scrolling speed for better readability
                        const increment = 0.5;
                        const newPos = prevPos + increment;

                        // Reset when we reach the bottom, with a small pause
                        if (newPos >= maxScroll) {
                            // Add a delay before restarting
                            setTimeout(() => {
                                setScrollPosition(0);
                            }, 3000);
                            return maxScroll;
                        }

                        return newPos;
                    });

                    if (isPlaying) {
                        animationId = requestAnimationFrame(animate);
                    }
                };

                // Start the animation after delay
                animationId = requestAnimationFrame(animate);
            }, 5000); // 5-second delay before scrolling starts

            return () => {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                }
                if (delayTimeout) {
                    clearTimeout(delayTimeout);
                }
                setScrollPosition(0); // Reset scroll position when stopped
            };
        } else if (!isPlaying) {
            // Reset scroll position when not playing
            setScrollPosition(0);
        }
    }, [isPlaying]);

    // Render a single lyric item
    const renderLyricItem = (item: LyricItem, index: number) => {
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
    };

    // Apply scroll transform
    useEffect(() => {
        if (lyricsContainerRef.current) {
            if (isPlaying) {
                lyricsContainerRef.current.style.transform = `translateY(-${scrollPosition}px)`;
                lyricsContainerRef.current.style.transition = 'none';
            } else {
                lyricsContainerRef.current.style.transform = 'translateY(0)';
                lyricsContainerRef.current.style.transition = 'transform 0.5s ease-out';
            }
        }
    }, [scrollPosition, isPlaying]);

    return (
        <div className="flex flex-col h-full">
            <h4 className="text-xl font-bold text-cyber-blue mb-4 text-center">
                {currentSong.title}
            </h4>
            <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
                <div className="w-full h-full relative overflow-hidden">
                    <div
                        ref={lyricsContainerRef}
                        className="text-center text-gray-300 leading-relaxed text-sm absolute top-0 left-0 w-full px-4"
                    >
                        {currentSong.lyrics.map(renderLyricItem)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LyricsDisplay;
