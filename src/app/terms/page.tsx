"use client"

import Link from "next/link"
import { useTheme, themeClasses } from "@/components/ThemeProvider"

export default function TermsOfService() {
  const { theme } = useTheme()
  const t = themeClasses[theme]

  return (
    <div className={`min-h-screen ${t.bg} transition-colors`}>
      <nav className={`${t.nav} shadow-sm p-4 flex justify-between items-center ${t.border}`}>
        <Link href="/" className="text-blue-500 hover:underline">← Back to Home</Link>
        <h1 className={`text-xl font-bold ${t.text}`}>Terms of Service</h1>
      </nav>

      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className={`${t.card} p-8 rounded-xl border ${t.border}`}>
          <h1 className={`text-3xl font-bold mb-6 ${t.text}`}>Terms of Service</h1>
          <p className={`text-sm mb-8 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            Last updated: April 8, 2026
          </p>

          <div className={`space-y-6 ${t.text}`}>
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                By accessing and using Jason&apos;s Journal (&quot;the Service&quot;), you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Jason&apos;s Journal is a personal journaling application that provides AI-powered tools for content generation, 
                skill tracking, and personal organization. The Service includes features such as:
              </p>
              <ul className={`list-disc list-inside mt-2 ml-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <li>Markdown journaling with calendar organization</li>
                <li>AI text and image generation via third-party APIs</li>
                <li>Personal skill portfolio management</li>
                <li>Gallery for storing generated images</li>
                <li>Cloud synchronization capabilities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                You may sign in using Google or GitHub authentication. You are responsible for maintaining the confidentiality 
                of your account and for all activities that occur under your account. You agree to notify us immediately 
                of any unauthorized use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                You retain ownership of all content you create, upload, or store in the Service (&quot;User Content&quot;). 
                By using the Service, you grant us a limited license to store and process your content solely for the purpose 
                of providing the Service to you.
              </p>
              <p className={`leading-relaxed mt-3 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                You are solely responsible for your User Content and represent that you have all necessary rights to use, 
                store, and share such content. Do not store sensitive personal information such as financial data, 
                medical records, or passwords in the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. AI-Generated Content</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                The Service uses third-party AI providers (including Pollinations.ai) to generate text and images. 
                You acknowledge that:
              </p>
              <ul className={`list-disc list-inside mt-2 ml-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <li>AI-generated content may not always be accurate or appropriate</li>
                <li>You are responsible for reviewing and verifying any AI-generated content before use</li>
                <li>We do not guarantee the quality, accuracy, or appropriateness of AI-generated content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Prohibited Uses</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                You agree not to use the Service to:
              </p>
              <ul className={`list-disc list-inside mt-2 ml-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <li>Generate or store illegal, harmful, or offensive content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>Attempt to gain unauthorized access to the Service or its systems</li>
                <li>Use the Service in any way that could damage, disable, or impair the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Data Storage and Backup</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Your data is primarily stored locally in your browser. Optional cloud synchronization is available 
                through Vercel KV. While we make reasonable efforts to ensure data integrity, you are responsible 
                for maintaining backups of your important data. We recommend regularly exporting your data using 
                the built-in export functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                The Service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent permitted by law, 
                we shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of or inability to use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                We may modify these Terms at any time. We will notify users of significant changes by updating 
                the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes 
                acceptance of the modified Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p className={`leading-relaxed ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                If you have any questions about these Terms, please contact us through the application or 
                reach out via the contact information provided in your account settings.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className={`border-t ${t.border} py-6 mt-12`}>
        <div className="container mx-auto px-6 text-center">
          <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
            © {new Date().getFullYear()} Jason&apos;s Journal. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/privacy" className="text-sm text-blue-500 hover:underline">Privacy Policy</Link>
            <Link href="/" className="text-sm text-blue-500 hover:underline">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
