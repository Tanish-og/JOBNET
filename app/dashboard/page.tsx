import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, Briefcase, Users, Plus } from "lucide-react"
import { signOut } from "@/lib/actions"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user, redirect to login
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile from our custom users table
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">JobNet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <form action={signOut}>
                <Button type="submit" variant="ghost" className="text-slate-300 hover:text-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name || user.email}!</h1>
          <p className="text-slate-400">Ready to discover new opportunities and connect with professionals?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/jobs/post">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Post a Job</h3>
                  <p className="text-slate-400 text-sm">Find the perfect candidate</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/jobs">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Browse Jobs</h3>
                  <p className="text-slate-400 text-sm">Discover opportunities</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/network">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Network</h3>
                  <p className="text-slate-400 text-sm">Connect with professionals</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Profile Completion */}
        {(!profile?.bio || !profile?.skills || profile?.skills?.length === 0) && (
          <div className="bg-amber-500/10 border border-amber-500/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-amber-400 mb-2">Complete Your Profile</h3>
            <p className="text-amber-300/80 mb-4">
              Add your bio and skills to get better job matches and networking opportunities.
            </p>
            <Link href="/profile">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">Complete Profile</Button>
            </Link>
          </div>
        )}

        {/* Recent Activity Placeholder */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <p className="text-slate-400">No recent activity yet. Start by posting a job or updating your profile!</p>
        </div>
      </main>
    </div>
  )
}
