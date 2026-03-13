import { chromium, Browser, Page } from 'playwright';

interface BetDetails {
    matchId: string;
    homeTeam: string;
    awayTeam: string;
    marketType: string;
    odds: number;
    stake: number;
}

export class SportyBetBot {
    private browser: Browser | null = null;
    private page: Page | null = null;

    async init() {
        this.browser = await chromium.launch({ headless: false }); // Visible for debugging initially
        this.page = await this.browser.newPage();
    }

    async login(username: string, password: string) {
        if (!this.page) return false;
        await this.page.goto('https://www.sportybet.com/ng/login');

        // Select specific selectors for SportyBet (Update as necessary)
        await this.page.fill('input[name="phone"]', username);
        await this.page.fill('input[name="password"]', password);
        await this.page.click('button[type="submit"]');

        // Wait for successful login (look for user profile element)
        await this.page.waitForSelector('.user-profile-icon', { timeout: 10000 });
        return true;
    }

    async placeBet(bet: BetDetails) {
        if (!this.page) return false;

        // Search for the match
        await this.page.goto(`https://www.sportybet.com/ng/search?query=${bet.homeTeam}`);
        await this.page.waitForSelector('.match-item');

        // Select the match (complex logic needed here to find the exact match and market)
        const matchFound = await this.page.locator(`.match-item:has-text("${bet.awayTeam}")`);
        await matchFound.click();

        // Select market (e.g., Home Win)
        const market = await this.page.locator(`.market-item:has-text("${bet.marketType}")`);
        await market.click();

        // Enter stake in slip
        await this.page.fill('.bet-slip-input', bet.stake.toString());

        // Check if odds have changed
        const currentOdds = await this.page.innerText('.current-odds');
        if (parseFloat(currentOdds) < bet.odds * 0.95) {
            console.log('Odds changed too much. Cancelling bet.');
            return false;
        }

        // Confirm bet
        await this.page.click('.place-bet-button');
        console.log(`Bet placed successfully for ${bet.homeTeam} vs ${bet.awayTeam}`);
        return true;
    }

    async close() {
        if (this.browser) await this.browser.close();
    }
}
