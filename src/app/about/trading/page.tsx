"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

export default function TradingPage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
        <Link href="/about" className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
          ← About Jason
        </Link>
        <a href="mailto:jasondspooner@gmail.com" className="text-blue-500 hover:underline text-sm">Contact →</a>
      </nav>

      <div className="container mx-auto p-8">
        <div className={`${t.card} p-8 rounded-xl border ${t.border} mb-8`}>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">📈</span>
            <div>
              <h1 className={`text-3xl font-bold ${t.text}`}>Crypto Trading on Hyperliquid with Python</h1>
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                Automated trading strategies on the Hyperliquid network
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
            <h2 className={`text-xl font-bold mb-4 ${t.text}`}>🔮 Futures Trading</h2>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Futures trading allows buying or selling cryptocurrencies at a set price in the future, profiting from price changes without owning the asset. Using margin trading, I borrow funds to amplify trades — $100 controls $1,000 with 10x leverage.
            </p>
            <p className={`mt-4 text-sm ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
              ⚠️ High leverage is risky due to potential losses or liquidation.
            </p>
          </div>

          <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
            <h2 className={`text-xl font-bold mb-4 ${t.text}`}>⛓️ Hyperliquid Network</h2>
            <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Hyperliquid is a decentralized exchange (DEX) where users trade directly on a blockchain, without intermediaries. The Hyperliquid L1 blockchain supports fast, low-cost trading with up to 200,000 orders per second and no gas fees.
            </p>
            <p className={`mt-4 text-sm ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>
              ✅ I use Hyperliquid for its speed, security, and support for meme coins with up to 40x leverage.
            </p>
          </div>
        </div>

        <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
          <h2 className={`text-xl font-bold mb-4 ${t.text}`}>🤖 The Trading Bot</h2>
          <p className={`mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            My custom Python trading bot automates buying and selling on Hyperliquid using predefined strategies. Strategies use technical indicators (RSI, Bollinger Bands) to trigger buy/sell signals. I backtest with historical data and use machine learning to optimize settings.
          </p>
          
          <h3 className={`font-semibold mb-3 ${t.text}`}>Current Bot Testing Configurations:</h3>
          <ul className="space-y-2">
            {[
              { name: "Binance Top 50 Pairs - Demo", status: "Dry-run testing" },
              { name: "Hyperliquid Top 50 Pairs - Demo", status: "Meme coins & stablecoins" },
              { name: "Hyperliquid Top 7 Pairs - Demo ($100)", status: "Simulated balance" },
              { name: "Gold Trading via PAGX Token - Demo", status: "Gold-tied token" },
              { name: "Hyperliquid Top 7 Pairs - Live ($100)", status: "Real trading" },
            ].map((config, i) => (
              <li key={i} className={`flex items-center gap-3 p-3 rounded-lg ${theme === "dark" ? "bg-slate-700" : "bg-gray-50"}`}>
                <span className="text-green-500">●</span>
                <span className={t.text}>{config.name}</span>
                <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {config.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-8`}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <h2 className={`text-xl font-bold ${t.text}`}>Recent Results</h2>
          </div>
          <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-green-900/20 border border-green-700" : "bg-green-50 border border-green-200"}`}>
            <p className="text-green-500 font-bold text-2xl mb-2">95% Win Rate</p>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              Recent demo tests show impressive results. Live trading ongoing.
            </p>
          </div>
        </div>

        <div className={`${t.card} p-6 rounded-xl border ${t.border}`}>
          <h2 className={`text-xl font-bold mb-4 ${t.text}`}>💡 Conclusion</h2>
          <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            Using Hyperliquid and my trading bot, I trade meme coins and stablecoins efficiently with automation and data-driven strategies. Hyperliquid's fast, decentralized platform and MetaMask's secure wallet streamline fund management, while AI optimizes trading decisions.
          </p>
          <p className={`mt-4 text-sm ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`}>
            ⚠️ Remember: crypto trading is risky. Only invest what you can afford to lose.
          </p>
        </div>

        <div className={`mt-8 flex flex-wrap gap-4 justify-center`}>
          <a 
            href="mailto:jasondspooner@gmail.com"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            ✉️ Contact for More Info
          </a>
          <Link 
            href="/about"
            className={`px-6 py-3 rounded-lg border ${t.border} hover:bg-gray-50 dark:hover:bg-slate-700 transition`}
          >
            ← Back to About
          </Link>
        </div>
      </div>
    </div>
  )
}
