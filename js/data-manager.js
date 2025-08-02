/**
 * Data Manager - Handles Bitcoin historical data fetching and caching
 */
class DataManager {
    constructor() {
        this.bitcoinData = [];
        this.cacheKey = 'crypto_boy_bitcoin_data';
        this.apiBaseUrl = 'https://api.coingecko.com/api/v3';
        this.isLoading = false;
    }

    /**
     * Initialize data manager and load cached data or fetch new data
     */
    async initialize() {
        console.log('Initializing DataManager...');
        
        // Try to load cached data first
        const cachedData = this.loadFromCache();
        if (cachedData && cachedData.length > 0) {
            console.log('Using cached Bitcoin data');
            this.bitcoinData = cachedData;
            return true;
        }

        // Fetch fresh data if no cache
        return await this.fetchBitcoinData();
    }

    /**
     * Fetch Bitcoin historical data from CoinGecko API
     */
    async fetchBitcoinData() {
        if (this.isLoading) return false;
        
        this.isLoading = true;
        console.log('Fetching Bitcoin historical data...');

        try {
            // Get data from 2013 to current date
            const fromDate = Math.floor(new Date('2013-01-01').getTime() / 1000);
            const toDate = Math.floor(Date.now() / 1000);
            
            const url = `${this.apiBaseUrl}/coins/bitcoin/market_chart/range?vs_currency=usd&from=${fromDate}&to=${toDate}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Process and format the data
            this.bitcoinData = data.prices.map(pricePoint => ({
                timestamp: pricePoint[0],
                date: new Date(pricePoint[0]),
                price: pricePoint[1],
                formattedDate: new Date(pricePoint[0]).toISOString().split('T')[0]
            }));

            // Cache the data
            this.saveToCache();
            
            console.log(`Loaded ${this.bitcoinData.length} data points`);
            this.isLoading = false;
            return true;

        } catch (error) {
            console.error('Error fetching Bitcoin data:', error);
            this.isLoading = false;
            
            // Fallback to sample data if API fails
            this.loadSampleData();
            return true; // Return true since we have sample data
        }
    }

    /**
     * Load sample data for development/testing
     */
    loadSampleData() {
        console.log('Loading sample Bitcoin data...');
        
        // Generate sample data from 2013 to 2025
        const startDate = new Date('2013-01-01');
        const endDate = new Date('2025-12-31');
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        this.bitcoinData = [];
        let currentPrice = 13.50; // Starting price in 2013
        
        for (let i = 0; i < daysDiff; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            // Simulate realistic Bitcoin price movements
            const volatility = 0.05; // 5% daily volatility
            const trend = 0.0001; // Slight upward trend
            const randomChange = (Math.random() - 0.5) * 2 * volatility;
            
            currentPrice *= (1 + trend + randomChange);
            currentPrice = Math.max(currentPrice, 0.01); // Minimum price
            
            this.bitcoinData.push({
                timestamp: date.getTime(),
                date: date,
                price: currentPrice,
                formattedDate: date.toISOString().split('T')[0]
            });
        }
        
        console.log(`Generated ${this.bitcoinData.length} sample data points`);
        
        // Cache the sample data
        this.saveToCache();
    }

    /**
     * Get price data for a specific date
     */
    getPriceForDate(date) {
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);
        
        const dataPoint = this.bitcoinData.find(point => {
            const pointDate = new Date(point.date);
            pointDate.setHours(0, 0, 0, 0);
            return pointDate.getTime() === targetDate.getTime();
        });
        
        return dataPoint ? dataPoint.price : null;
    }

    /**
     * Get price data for a date range
     */
    getPriceRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return this.bitcoinData.filter(point => {
            const pointDate = new Date(point.date);
            return pointDate >= start && pointDate <= end;
        });
    }

    /**
     * Get all available dates
     */
    getAvailableDates() {
        return this.bitcoinData.map(point => point.formattedDate);
    }

    /**
     * Get min and max prices for a date range
     */
    getPriceBounds(startDate, endDate) {
        const range = this.getPriceRange(startDate, endDate);
        if (range.length === 0) return { min: 0, max: 0 };
        
        const prices = range.map(point => point.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    }

    /**
     * Save data to localStorage cache
     */
    saveToCache() {
        try {
            localStorage.setItem(this.cacheKey, JSON.stringify(this.bitcoinData));
            console.log('Data cached successfully');
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    /**
     * Load data from localStorage cache
     */
    loadFromCache() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                // Convert date strings back to Date objects
                return data.map(point => ({
                    ...point,
                    date: new Date(point.date)
                }));
            }
        } catch (error) {
            console.error('Error loading from cache:', error);
        }
        return null;
    }

    /**
     * Clear cached data
     */
    clearCache() {
        try {
            localStorage.removeItem(this.cacheKey);
            console.log('Cache cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
} 