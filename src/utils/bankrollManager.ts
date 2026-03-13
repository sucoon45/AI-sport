interface BankrollConfig {
    totalBankroll: number;
    betPercentage: number; // e.g. 2 for 2%
    maxLossPerDay: number;
    dailyNetProfit: number;
    stoppedToday: boolean;
}

export class BankrollManager {
    private config: BankrollConfig;

    constructor(config: BankrollConfig) {
        this.config = config;
    }

    canBet(): boolean {
        if (this.config.stoppedToday) return false;
        if (this.config.dailyNetProfit <= -this.config.maxLossPerDay) return false;
        return true;
    }

    calculateStake(): number {
        if (!this.canBet()) return 0;

        const stake = (this.config.betPercentage / 100) * this.config.totalBankroll;
        return Math.floor(stake * 100) / 100; // Round to 2 decimals
    }

    updateProfit(netResult: number) {
        this.config.dailyNetProfit += netResult;
        this.config.totalBankroll += netResult;

        if (this.config.dailyNetProfit <= -this.config.maxLossPerDay) {
            console.log('Daily stop-loss reached. Stopping automation.');
            this.config.stoppedToday = true;
        }

        return this.config;
    }

    getStats() {
        return {
            total: this.config.totalBankroll,
            dailyProfit: this.config.dailyNetProfit,
            isHalted: this.config.stoppedToday
        };
    }
}
