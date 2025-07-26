import { motion } from 'framer-motion';

interface ProgressBarProps {
    value: number;
    max: number;
    className?: string;
}

export const ProgressBar = ({ value, max, className = '' }: ProgressBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div className={`w-full bg-white/10 rounded-full h-2 overflow-hidden ${className}`}>
            <motion.div
                className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
            />
        </div>
    );
};
