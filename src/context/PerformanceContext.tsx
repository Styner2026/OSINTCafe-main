import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface PerformanceContextType {
    isLowPerformanceMode: boolean;
    enableLowPerformanceMode: () => void;
    disableLowPerformanceMode: () => void;
    deferredLoading: boolean;
    setDeferredLoading: (value: boolean) => void;
    prefetchedRoutes: string[];
    prefetchRoute: (route: string) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

interface PerformanceProviderProps {
    children: ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
    const [isLowPerformanceMode, setIsLowPerformanceMode] = useState<boolean>(false);
    const [deferredLoading, setDeferredLoading] = useState<boolean>(true);
    const [prefetchedRoutes, setPrefetchedRoutes] = useState<string[]>([]);

    // Check for device capabilities on mount
    useEffect(() => {
        // Simple heuristic to detect low-performance devices
        const isLowPerfDevice = () => {
            // Check if device is mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            // Check if CPU cores are limited
            const cpuCores = navigator.hardwareConcurrency || 4;

            // Check if memory is limited (not always available)
            const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number };
            const lowMemory = navigatorWithMemory.deviceMemory ? navigatorWithMemory.deviceMemory < 4 : false;

            return isMobile && (cpuCores <= 4 || lowMemory);
        };

        setIsLowPerformanceMode(isLowPerfDevice());
    }, []);

    const enableLowPerformanceMode = useCallback(() => {
        setIsLowPerformanceMode(true);
        setDeferredLoading(true);
    }, []);

    const disableLowPerformanceMode = useCallback(() => {
        setIsLowPerformanceMode(false);
    }, []);

    const prefetchRoute = useCallback((route: string) => {
        if (!prefetchedRoutes.includes(route)) {
            setPrefetchedRoutes(prev => [...prev, route]);

            // Create a link prefetch tag
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            link.as = 'document';
            document.head.appendChild(link);
        }
    }, [prefetchedRoutes]);

    return (
        <PerformanceContext.Provider
            value={{
                isLowPerformanceMode,
                enableLowPerformanceMode,
                disableLowPerformanceMode,
                deferredLoading,
                setDeferredLoading,
                prefetchedRoutes,
                prefetchRoute,
            }}
        >
            {children}
        </PerformanceContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePerformance = (): PerformanceContextType => {
    const context = useContext(PerformanceContext);
    if (context === undefined) {
        throw new Error('usePerformance must be used within a PerformanceProvider');
    }
    return context;
};

export default PerformanceProvider;
