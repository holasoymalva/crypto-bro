/**
 * Chart Renderer - Handles 8-bit style Bitcoin price chart rendering
 */
class ChartRenderer {
    constructor(canvas, dataManager) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dataManager = dataManager;
        
        // 8-bit color palette
        this.colors = {
            background: '#000000',
            grid: '#333333',
            priceLine: '#00ff00',
            priceFill: 'rgba(0, 255, 0, 0.1)',
            text: '#00ff00',
            border: '#00ff00'
        };
        
        // Chart configuration
        this.margin = { top: 40, right: 40, bottom: 60, left: 80 };
        this.chartArea = {
            x: this.margin.left,
            y: this.margin.top,
            width: this.canvas.width - this.margin.left - this.margin.right,
            height: this.canvas.height - this.margin.top - this.margin.bottom
        };
        
        // Animation properties
        this.animationSpeed = 1; // days per second
        this.currentDateIndex = 0;
        this.visibleDays = 365; // Show 1 year of data at a time
        
        // Pixel scaling for 8-bit effect
        this.pixelScale = 2;
        this.setupPixelRendering();
    }

    /**
     * Setup pixel-perfect rendering
     */
    setupPixelRendering() {
        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.msImageSmoothingEnabled = false;
    }

    /**
     * Clear the canvas
     */
    clear() {
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draw the chart grid
     */
    drawGrid() {
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([]);

        // Vertical grid lines (time)
        const timeSteps = 12;
        for (let i = 0; i <= timeSteps; i++) {
            const x = this.chartArea.x + (i / timeSteps) * this.chartArea.width;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.chartArea.y);
            this.ctx.lineTo(x, this.chartArea.y + this.chartArea.height);
            this.ctx.stroke();
        }

        // Horizontal grid lines (price)
        const priceSteps = 8;
        for (let i = 0; i <= priceSteps; i++) {
            const y = this.chartArea.y + (i / priceSteps) * this.chartArea.height;
            this.ctx.beginPath();
            this.ctx.moveTo(this.chartArea.x, y);
            this.ctx.lineTo(this.chartArea.x + this.chartArea.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Draw price labels
     */
    drawPriceLabels(minPrice, maxPrice) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';

        const priceSteps = 8;
        for (let i = 0; i <= priceSteps; i++) {
            const price = minPrice + (i / priceSteps) * (maxPrice - minPrice);
            const y = this.chartArea.y + (i / priceSteps) * this.chartArea.height;
            
            const formattedPrice = this.formatPrice(price);
            this.ctx.fillText(formattedPrice, this.chartArea.x - 10, y);
        }
    }

    /**
     * Draw time labels
     */
    drawTimeLabels(startDate, endDate) {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '8px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        const timeSteps = 6;
        for (let i = 0; i <= timeSteps; i++) {
            const date = new Date(startDate.getTime() + (i / timeSteps) * (endDate.getTime() - startDate.getTime()));
            const x = this.chartArea.x + (i / timeSteps) * this.chartArea.width;
            const y = this.chartArea.y + this.chartArea.height + 15;
            
            const formattedDate = this.formatDate(date);
            this.ctx.fillText(formattedDate, x, y);
        }
    }

    /**
     * Draw the price chart
     */
    drawPriceChart(dataPoints, minPrice, maxPrice) {
        if (dataPoints.length < 2) return;

        const points = dataPoints.map((point, index) => {
            const x = this.chartArea.x + (index / (dataPoints.length - 1)) * this.chartArea.width;
            const priceRatio = (point.price - minPrice) / (maxPrice - minPrice);
            const y = this.chartArea.y + this.chartArea.height - (priceRatio * this.chartArea.height);
            return { x, y, price: point.price };
        });

        // Draw price fill area
        this.ctx.fillStyle = this.colors.priceFill;
        this.ctx.beginPath();
        this.ctx.moveTo(this.chartArea.x, this.chartArea.y + this.chartArea.height);
        
        points.forEach(point => {
            this.ctx.lineTo(point.x, point.y);
        });
        
        this.ctx.lineTo(this.chartArea.x + this.chartArea.width, this.chartArea.y + this.chartArea.height);
        this.ctx.closePath();
        this.ctx.fill();

        // Draw price line
        this.ctx.strokeStyle = this.colors.priceLine;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        
        points.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        
        this.ctx.stroke();

        // Draw current price indicator
        if (points.length > 0) {
            const currentPoint = points[points.length - 1];
            this.drawCurrentPriceIndicator(currentPoint);
        }
    }

    /**
     * Draw current price indicator
     */
    drawCurrentPriceIndicator(point) {
        // Draw price line
        this.ctx.strokeStyle = this.colors.priceLine;
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, this.chartArea.y);
        this.ctx.lineTo(point.x, this.chartArea.y + this.chartArea.height);
        this.ctx.stroke();

        // Draw price circle
        this.ctx.setLineDash([]);
        this.ctx.fillStyle = this.colors.priceLine;
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();

        // Draw price label
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '10px "Press Start 2P"';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'bottom';
        
        const priceText = this.formatPrice(point.price);
        this.ctx.fillText(priceText, point.x + 10, point.y - 5);
    }

    /**
     * Draw chart border
     */
    drawBorder() {
        this.ctx.strokeStyle = this.colors.border;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);
        this.ctx.strokeRect(
            this.chartArea.x - 1, 
            this.chartArea.y - 1, 
            this.chartArea.width + 2, 
            this.chartArea.height + 2
        );
    }

    /**
     * Draw chart title
     */
    drawTitle() {
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('BITCOIN PRICE CHART', this.canvas.width / 2, 10);
    }

    /**
     * Format price for display
     */
    formatPrice(price) {
        if (price >= 1000) {
            return `$${(price / 1000).toFixed(1)}K`;
        } else if (price >= 1) {
            return `$${price.toFixed(2)}`;
        } else {
            return `$${price.toFixed(4)}`;
        }
    }

    /**
     * Format date for display
     */
    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            year: '2-digit' 
        });
    }

    /**
     * Render the complete chart
     */
    render(currentDate, visibleDataPoints) {
        this.clear();
        this.drawTitle();
        this.drawGrid();

        if (visibleDataPoints.length > 0) {
            const prices = visibleDataPoints.map(point => point.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            
            // Add some padding to price range
            const pricePadding = (maxPrice - minPrice) * 0.1;
            const adjustedMinPrice = Math.max(0, minPrice - pricePadding);
            const adjustedMaxPrice = maxPrice + pricePadding;

            this.drawPriceChart(visibleDataPoints, adjustedMinPrice, adjustedMaxPrice);
            this.drawPriceLabels(adjustedMinPrice, adjustedMaxPrice);
            
            if (visibleDataPoints.length > 1) {
                const startDate = visibleDataPoints[0].date;
                const endDate = visibleDataPoints[visibleDataPoints.length - 1].date;
                this.drawTimeLabels(startDate, endDate);
            }
        }

        this.drawBorder();
    }

    /**
     * Update chart with new data
     */
    update(currentDate, dataPoints) {
        this.render(currentDate, dataPoints);
    }

    /**
     * Get visible data points for current view
     */
    getVisibleDataPoints(currentDateIndex, visibleDays) {
        const allData = this.dataManager.bitcoinData;
        const startIndex = Math.max(0, currentDateIndex - visibleDays);
        const endIndex = Math.min(allData.length - 1, currentDateIndex);
        
        return allData.slice(startIndex, endIndex + 1);
    }
} 