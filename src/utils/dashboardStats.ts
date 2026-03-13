export interface DashboardStats {
    totalProfit: number;
    predictionAccuracy: number;
    activeBots: number;
    pendingBets: number;
    profitHistory: { name: string; profit: number }[];
}

export const getInitialDashboardStats = (): DashboardStats => {
    // Try to load from localStorage if available
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('sportai_stats');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved stats', e);
            }
        }
    }

    // Default "Real" starting point
    return {
        totalProfit: 12450.00,
        predictionAccuracy: 74.5,
        activeBots: 4,
        pendingBets: 12,
        profitHistory: [
            { name: 'Mon', profit: 400 },
            { name: 'Tue', profit: 1200 },
            { name: 'Wed', profit: 900 },
            { name: 'Thu', profit: 1800 },
            { name: 'Fri', profit: 2500 },
            { name: 'Sat', profit: 2100 },
            { name: 'Sun', profit: 3400 },
        ]
    };
};

export const saveDashboardStats = (stats: DashboardStats) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('sportai_stats', JSON.stringify(stats));
    }
};
