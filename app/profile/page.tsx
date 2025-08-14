import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/profile/profile-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, MapPin, LinkIcon, Wallet } from "lucide-react"
import Link from "next/link"

export default async function ProfilePage() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-white">Profile Settings</h1>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sticky top-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">{profile?.full_name || "Your Name"}</h2>
                <p className="text-slate-400 text-sm mb-4">{user.email}</p>

                {profile?.location && (
                  <div className="flex items-center justify-center text-slate-400 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </div>
                )}

                {profile?.linkedin_url && (
                  <div className="flex items-center justify-center text-slate-400 text-sm mb-2">
                    <LinkIcon className="w-4 h-4 mr-1" />
                    LinkedIn Connected
                  </div>
                )}

                {profile?.wallet_address && (
                  <div className="flex items-center justify-center text-slate-400 text-sm mb-4">
                    <Wallet className="w-4 h-4 mr-1" />
                    Wallet Connected
                  </div>
                )}

                {profile?.bio && <p className="text-slate-300 text-sm leading-relaxed">{profile.bio}</p>}

                {profile?.skills && profile.skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 6).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {profile.skills.length > 6 && (
                        <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs rounded-full">
                          +{profile.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
              <ProfileForm profile={profile} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
