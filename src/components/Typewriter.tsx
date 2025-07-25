import React, { useState, useEffect } from 'react';

interface TypewriterProps {
    lyrics: string[];
    isPlaying: boolean;
}

/**
 * Typewriter effect component for French lyrics
 */
const Typewriter: React.FC<TypewriterProps> = ({ lyrics, isPlaying }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

    useEffect(() => {
        if (isPlaying) {
            const currentLyric = lyrics[currentLyricIndex];

            if (displayedText.length < currentLyric.length) {
                // Type the next character
                const timeout = setTimeout(() => {
                    setDisplayedText(currentLyric.substring(0, displayedText.length + 1));
                }, 80);

                return () => clearTimeout(timeout);
            } else {
                // Move to next lyric after a pause
                const timeout = setTimeout(() => {
                    setCurrentLyricIndex((prev) => (prev + 1) % lyrics.length);
                    setDisplayedText('');
                }, 3000);

                return () => clearTimeout(timeout);
            }
        } else {
            // Reset when not playing
            setDisplayedText('');
            setCurrentLyricIndex(0);
        }
    }, [isPlaying, displayedText, currentLyricIndex, lyrics]);

    return (
        <div className="text-center">
            <p className="text-base font-medium text-cyber-green mb-3 break-words leading-relaxed">
                {displayedText}
                <span className="animate-pulse text-cyber-blue ml-1">|</span>
            </p>
            <div className="text-xs text-gray-400 italic">
                Cinématique, darkwave
            </div>
        </div>
    );
};

export default Typewriter;
