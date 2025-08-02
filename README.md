# Crypto Boy - 8-Bit Bitcoin Trading Game

A retro-style Bitcoin trading game where you buy and sell Bitcoin by timing the market with real historical data.

## 🎮 Game Overview

Crypto Boy is an 8-bit style trading game that puts you in the role of a pixel-art character trading Bitcoin across different time periods. The game uses real historical Bitcoin price data from 2013 to 2025, with time advancing at one day per second.

## 🎯 How to Play

1. **Start**: The game begins at a random date between 2013 and 2025
2. **Buy**: Hold the left mouse button to buy Bitcoin with your available cash
3. **Sell**: Release the mouse button to sell all your Bitcoin holdings
4. **Goal**: Multiply your starting $100,000 by making profitable trades

## 🎨 Features

### Phase 1 (Current Implementation)
- ✅ Real Bitcoin historical data integration (CoinGecko API)
- ✅ 8-bit retro visual styling with pixel-perfect graphics
- ✅ Interactive price chart with smooth animations
- ✅ Time progression system (1 day per second)
- ✅ Random start date selection
- ✅ Basic trading mechanics (buy/sell)
- ✅ Portfolio tracking and UI updates
- ✅ Data caching to avoid API rate limits

### Planned Features (Future Phases)
- 🎮 Pixel art character with animations
- 🔊 8-bit sound effects and music
- 📊 Enhanced trading statistics
- 🏆 High score system
- 🎯 Achievement system
- 📱 Mobile touch support

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (for initial data loading)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. Wait for the Bitcoin data to load
4. Start trading!

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd crypto-bro

# Open in browser
open index.html
# or
python -m http.server 8000
# then visit http://localhost:8000
```

## 🎮 Controls

- **Left Mouse Button (Hold)**: Buy Bitcoin
- **Left Mouse Button (Release)**: Sell all Bitcoin
- **Spacebar (Hold)**: Buy Bitcoin
- **Spacebar (Release)**: Sell all Bitcoin
- **P**: Pause/Resume game
- **R**: Restart game

## 🛠️ Technical Details

### Architecture
- **Frontend**: HTML5 Canvas + Vanilla JavaScript
- **Data Source**: CoinGecko API for historical Bitcoin prices
- **Styling**: CSS with 8-bit retro theme
- **Font**: Press Start 2P (Google Fonts)

### Components
- `DataManager`: Handles Bitcoin data fetching and caching
- `ChartRenderer`: Renders 8-bit style price charts
- `GameEngine`: Manages game state and logic
- `CryptoBoyGame`: Main application controller

### Data Management
- Historical Bitcoin price data cached in localStorage
- Fallback to generated sample data if API fails
- Automatic data refresh and caching

## 🎨 Visual Style

The game features a classic 8-bit aesthetic with:
- Green-on-black color scheme
- Pixel-perfect rendering
- Retro typography (Press Start 2P font)
- Glowing borders and effects
- Grid-based chart design

## 📊 Game Mechanics

### Trading System
- Start with $100,000 USD
- Buy Bitcoin by holding mouse button
- Sell all holdings by releasing mouse button
- Real-time portfolio value calculation
- Transaction history tracking

### Time Progression
- 1 day per second game speed
- Random start date between 2013-2025
- Automatic progression through historical data
- Game ends when reaching 2025

## 🔧 Development

### Project Structure
```
crypto-bro/
├── index.html          # Main HTML file
├── styles.css          # 8-bit styling
├── js/
│   ├── data-manager.js    # Bitcoin data handling
│   ├── chart-renderer.js  # Chart rendering
│   ├── game-engine.js     # Game logic
│   └── main.js           # Application entry point
└── README.md           # This file
```

### Browser Compatibility
- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

### Performance
- 60 FPS target
- Optimized canvas rendering
- Efficient data caching
- Smooth chart animations

## 🐛 Known Issues

- API rate limits may cause initial loading delays
- Some browsers may have font rendering differences
- Mobile touch support planned for future versions

## 📈 Future Development

### Phase 2: Character & Polish
- Pixel art character sprite
- Character animations
- Enhanced visual effects
- Audio system

### Phase 3: Game Features
- Trading statistics
- High score system
- Different difficulty modes
- Achievement system

### Phase 4: Mobile & Polish
- Touch controls
- Responsive design
- Performance optimizations
- Final polish

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📄 License

This project is for educational purposes. Bitcoin price data is sourced from CoinGecko API.

## 🙏 Acknowledgments

- CoinGecko for providing Bitcoin price data
- Google Fonts for the Press Start 2P font
- The retro gaming community for inspiration

---

**Happy Trading! 🚀📈** 