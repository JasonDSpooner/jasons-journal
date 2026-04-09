"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

interface WizardStep {
  title: string
  description: string
  highlight?: string
  action?: { label: string; href: string }
}

const wizardSteps: WizardStep[] = [
  {
    title: "Welcome to Jason's Journal",
    description: "Your personal AI-powered journal and creative space. This wizard will show you around and help you get started with your own Pollinations.ai account.",
    highlight: "intro"
  },
  {
    title: "Bring Your Own Pollinations",
    description: "This app uses Pollinations.ai for AI text and image generation. To use your own account's quota and features, you'll need your own API key. Get one free at pollinations.ai!",
    highlight: "api-key"
  },
  {
    title: "Dashboard",
    description: "Your central hub! View stats, recent entries, and quick access to all features.",
    highlight: "/dashboard"
  },
  {
    title: "Journal",
    description: "Write and organize your thoughts with markdown support. Each entry can include AI-generated content.",
    highlight: "/journal"
  },
  {
    title: "Gallery",
    description: "View and manage all your AI-generated images in one place.",
    highlight: "/gallery"
  },
  {
    title: "AI Tools",
    description: "Generate text and images using AI. Enter prompts and watch creativity come to life!",
    highlight: "/ai"
  },
  {
    title: "Almost Ready!",
    description: "Head to Settings to add your Pollinations.ai API key, then start creating!",
    highlight: "/settings"
  }
]

export function OnboardingWizard() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const { theme } = useTheme()
  const t = themeClasses[theme]

  useEffect(() => {
    const hasSeenWizard = localStorage.getItem("has-seen-onboarding-wizard")
    if (!hasSeenWizard) {
      setIsOpen(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem("has-seen-onboarding-wizard", "true")
      setIsOpen(false)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem("has-seen-onboarding-wizard", "true")
    setIsOpen(false)
  }

  if (!isOpen) return null

  const step = wizardSteps[currentStep]
  const isLastStep = currentStep === wizardSteps.length - 1

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"} rounded-2xl border max-w-lg w-full p-6 relative`}>
        <button
          onClick={handleSkip}
          className={`absolute top-4 right-4 text-2xl ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
        >
          ×
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-blue-500">Step {currentStep + 1} of {wizardSteps.length}</span>
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {step.highlight === "api-key" && (
          <div className={`mb-4 p-4 rounded-lg ${theme === "dark" ? "bg-purple-900/30 border border-purple-500/30" : "bg-purple-50 border border-purple-200"}`}>
            <p className={`text-sm font-medium ${theme === "dark" ? "text-purple-300" : "text-purple-700"}`}>
              🐝 Bring Your Own Pollinations (BYOP)
            </p>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Use your own API key to access your Pollinations.ai account benefits!
            </p>
          </div>
        )}

        {step.highlight === "intro" && (
          <div className={`mb-4 p-4 rounded-lg ${theme === "dark" ? "bg-blue-900/30 border border-blue-500/30" : "bg-blue-50 border border-blue-200"}`}>
            <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              ✨ Jason's Journal
            </p>
            <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              A showcase of Jason Spoor's work through AI-powered journaling and image generation
            </p>
          </div>
        )}

        <h2 className={`text-2xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {step.title}
        </h2>
        <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {step.description}
        </p>

        {step.action && (
          <Link
            href={step.action.href}
            className="block mb-4 text-blue-500 hover:underline"
          >
            {step.action.label} →
          </Link>
        )}

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={handlePrev}
              className={`px-4 py-2 rounded-lg ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            {isLastStep ? "Get Started!" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function resetWizard() {
  localStorage.removeItem("has-seen-onboarding-wizard")
}