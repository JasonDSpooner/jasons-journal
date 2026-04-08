"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

export default function Privacy() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/" className="text-blue-500 hover:underline">← Home</Link>
        <h1 className={`text-xl font-bold ${t.text}`}>Privacy Policy</h1>
      </nav>

      <main className="container mx-auto p-8 max-w-3xl">
        <div className={`${t.card} p-8 rounded-xl border ${t.border}`}>
          <h2 className={`text-2xl font-bold mb-6 ${t.text}`}>Privacy Policy</h2>
          <p className="text-sm text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>1. Data Collection</h3>
              <p className="text-sm opacity-70">
                Jason&apos;s Journal stores all your data locally on your device. We do not collect, store, 
                or transmit any personal information to external servers. Your journal entries, 
                gallery images, and preferences remain on your device.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>2. Local Storage</h3>
              <p className="text-sm opacity-70">
                All data is stored using IndexedDB, a local database in your browser. This data 
                includes: journal entries, AI-generated images, media profile information, 
                and mailbox messages. You can export or delete this data at any time.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>3. AI Services</h3>
              <p className="text-sm opacity-70">
                The app uses Pollinations.ai for AI text and image generation. When you use 
                these features, your prompts are sent to Pollinations.ai. We do not control 
                their data practices. For AI key integration (future feature), each user 
                will provide their own API key.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>4. Data Encryption</h3>
              <p className="text-sm opacity-70">
                Currently, data at rest is protected by your device&apos;s security. Future updates 
                will include optional end-to-end encryption for journal entries. Enable device 
                encryption and biometric locks for maximum security.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>5. Data Export</h3>
              <p className="text-sm opacity-70">
                You can export all your data as JSON or Markdown at any time from the app settings. 
                This includes journal entries, gallery images metadata, and profile information.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>6. Third-Party Services</h3>
              <p className="text-sm opacity-70">
                The app may use Vercel for hosting. Vercel may collect basic analytics data. 
                No personal journal content is transmitted to Vercel.
              </p>
            </section>

            <section>
              <h3 className={`text-lg font-semibold mb-2 ${t.text}`}>7. Contact</h3>
              <p className="text-sm opacity-70">
                For privacy concerns, please contact us through the app&apos;s mailbox feature 
                or via the contact information in your Media profile.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h3 className={`text-lg font-semibold mb-4 ${t.text}`}>Your Rights</h3>
            <ul className="list-disc list-inside text-sm opacity-70 space-y-2">
              <li>Right to access your data</li>
              <li>Right to export your data</li>
              <li>Right to delete your data</li>
              <li>Right to control app permissions</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}