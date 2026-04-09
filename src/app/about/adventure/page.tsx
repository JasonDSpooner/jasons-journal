"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

interface Player {
  x: number
  y: number
  vx: number
  vy: number
  isJumping: boolean
  frame: number
}

interface Obstacle {
  x: number
  y: number
  type: "hole" | "snake" | "log"
}

export default function AdventurePage() {
  const { theme } = useTheme()
  const t = themeClasses[theme]
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [player, setPlayer] = useState<Player>({ x: 50, y: 200, vx: 0, vy: 0, isJumping: false, frame: 0 })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [scrollX, setScrollX] = useState(0)

  const GAME_WIDTH = 800
  const GROUND_Y = 250
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const SPEED = 5

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setGameOver(false)
    setPlayer({ x: 50, y: GROUND_Y, vx: 0, vy: 0, isJumping: false, frame: 0 })
    setScrollX(0)
    setObstacles([])
  }

  const generateObstacles = useCallback(() => {
    const newObstacles: Obstacle[] = []
    for (let i = 0; i < 10; i++) {
      const types: Obstacle["type"][] = ["hole", "snake", "log"]
      newObstacles.push({
        x: 400 + i * 200 + Math.random() * 100,
        y: GROUND_Y,
        type: types[Math.floor(Math.random() * types.length)]
      })
    }
    return newObstacles
  }, [])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    if (obstacles.length === 0) {
      setObstacles(generateObstacles())
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault()
        setPlayer(prev => {
          if (!prev.isJumping) {
            return { ...prev, vy: JUMP_FORCE, isJumping: true }
          }
          return prev
        })
      }
      if (e.key === "ArrowLeft") {
        setPlayer(prev => ({ ...prev, vx: -SPEED }))
      }
      if (e.key === "ArrowRight") {
        setPlayer(prev => ({ ...prev, vx: SPEED }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setPlayer(prev => ({ ...prev, vx: 0 }))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted, gameOver, obstacles.length, generateObstacles])

  useEffect(() => {
    if (!gameStarted || gameOver) return

    const gameLoop = setInterval(() => {
      setPlayer(prev => {
        let newY = prev.y + prev.vy
        let newVy = prev.vy + GRAVITY
        let isJumping = true

        if (newY >= GROUND_Y) {
          newY = GROUND_Y
          newVy = 0
          isJumping = false
        }

        return {
          ...prev,
          y: newY,
          vy: newVy,
          isJumping,
          frame: (prev.frame + 1) % 4
        }
      })

      setScrollX(prev => prev + 3)
      setScore(prev => prev + 1)

      setObstacles(prev => {
        const visibleObstacles = prev.filter(o => o.x - scrollX > -100)
        if (visibleObstacles.length < 3) {
          const types: Obstacle["type"][] = ["hole", "snake", "log"]
          const lastX = visibleObstacles.length > 0 
            ? Math.max(...visibleObstacles.map(o => o.x))
            : scrollX + GAME_WIDTH
          visibleObstacles.push({
            x: lastX + 200 + Math.random() * 150,
            y: GROUND_Y,
            type: types[Math.floor(Math.random() * types.length)]
          })
        }
        return visibleObstacles
      })
    }, 1000 / 60)

    return () => clearInterval(gameLoop)
  }, [gameStarted, gameOver, scrollX])

  useEffect(() => {
    if (!gameStarted) return

    const hitObstacle = obstacles.some(o => {
      const relX = o.x - scrollX
      const playerLeft = player.x
      const playerRight = player.x + 30
      return relX > playerLeft - 30 && relX < playerRight + 10
    })

    if (hitObstacle && player.y >= GROUND_Y - 5) {
      setGameOver(true)
      setHighScore(prev => Math.max(prev, score))
    }
  }, [player, obstacles, scrollX, gameStarted, score])

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border} sticky top-0 z-10`}>
        <Link href="/about" className={`text-sm ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
          ← About Jason
        </Link>
        <div className={`font-bold ${t.text}`}>High Score: {highScore}</div>
      </nav>

      <div className="container mx-auto p-8">
        <div className={`${t.card} p-6 rounded-xl border ${t.border} mb-6 text-center`}>
          <h1 className={`text-4xl font-bold mb-4 ${t.text}`}>🎮 The Lost Explorer</h1>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Arrow keys to move, Space or Up to jump. Avoid obstacles!
          </p>
        </div>

        <div className={`${t.card} rounded-xl border ${t.border} overflow-hidden mx-auto`} style={{ width: GAME_WIDTH, maxWidth: "100%" }}>
          <div 
            className={`relative h-64 overflow-hidden ${theme === "dark" ? "bg-amber-900" : "bg-amber-200"}`}
            style={{ 
              backgroundImage: "linear-gradient(to bottom, #87CEEB 0%, #87CEEB 60%, #228B22 60%, #228B22 100%)"
            }}
          >
            {!gameStarted ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-bold text-xl hover:opacity-90 transition"
                >
                  ▶️ Start Game
                </button>
              </div>
            ) : gameOver ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                <h2 className="text-white text-3xl font-bold mb-4">Game Over!</h2>
                <p className="text-white text-xl mb-4">Score: {score}</p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg font-bold hover:opacity-90 transition"
                >
                  🔄 Play Again
                </button>
              </div>
            ) : (
              <>
                <div className="absolute top-4 right-4 text-white font-bold text-xl">
                  Score: {score}
                </div>

                {obstacles.map((obs, i) => {
                  const relX = obs.x - scrollX
                  if (relX < -50 || relX > GAME_WIDTH + 50) return null
                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{ left: relX, top: obs.y }}
                    >
                      {obs.type === "hole" && (
                        <div className="w-12 h-12 bg-black rounded-full" />
                      )}
                      {obs.type === "snake" && (
                        <div className="text-3xl">🐍</div>
                      )}
                      {obs.type === "log" && (
                        <div className="w-16 h-6 bg-amber-700 rounded" />
                      )}
                    </div>
                  )
                })}

                <div
                  className="absolute transition-all"
                  style={{ 
                    left: player.x, 
                    top: player.y,
                    transform: player.vx < 0 ? "scaleX(-1)" : "scaleX(1)"
                  }}
                >
                  <div className="text-4xl">
                    {player.isJumping ? "🏃" : ["🏃‍♂️", "🏃", "🏃‍♂️", "🏃"][player.frame]}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`mt-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          <p>Inspired by Pitfall and Pacman. Use keyboard or tap screen to play on mobile.</p>
          <p className="mt-2">Can you beat the high score?</p>
        </div>

        <div className="mt-8 text-center">
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
