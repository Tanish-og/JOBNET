import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import JobPostForm from "@/components/jobs/job-post-form"

export default async function PostJobPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let profile = null
  try {
    const { data } = await supabase.from("users").select("wallet_address").eq("id", user.id).single()
    profile = data
  } catch (error) {
    // Database tables don't exist yet - allow posting without wallet check for now
    console.log("Database tables not set up yet:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/jobs">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white">Post a Job</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create Job Posting</h2>
            <p className="text-slate-400">
              Find the perfect candidate for your project. All job postings require a small platform fee to ensure
              quality listings.
            </p>
          </div>

          {profile && !profile?.wallet_address && (
            <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-4 mb-6">
              <h3 className="text-amber-400 font-medium mb-2">Wallet Connection Required</h3>
              <p className="text-amber-300/80 text-sm mb-3">
                To post a job, you need to connect your wallet for the platform fee payment. Please update your profile
                with your wallet address first.
              </p>
              <Link href="/profile">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Connect Wallet in Profile
                </Button>
              </Link>
            </div>
          )}

          {!profile && (
            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6">
              <h3 className="text-blue-400 font-medium mb-2">Database Setup Required</h3>
              <p className="text-blue-300/80 text-sm">
                Please run the database setup scripts in your Supabase dashboard to enable full functionality.
              </p>
            </div>
          )}

          <JobPostForm hasWallet={!!profile?.wallet_address} />
        </div>
      </main>
    </div>
  )
}
