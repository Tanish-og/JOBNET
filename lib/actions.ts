"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signIn(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  // Validate required fields
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { error } = await supabase.auth.signInWithPassword({
    email: email.toString(),
    password: password.toString(),
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

export async function signUp(prevState: any, formData: FormData) {
  // Check if formData is valid
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  // Validate required fields
  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const { data, error } = await supabase.auth.signUp({
    email: email.toString(),
    password: password.toString(),
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      data: {
        full_name: fullName.toString(),
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user && data.user.email_confirmed_at) {
    // User is immediately confirmed (development mode), redirect to dashboard
    revalidatePath("/dashboard")
    redirect("/dashboard")
  } else {
    // Email confirmation required, don't redirect
    return { success: "Please check your email to confirm your account before signing in" }
  }
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function updateProfile(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const fullName = formData.get("fullName") as string
  const bio = formData.get("bio") as string
  const linkedinUrl = formData.get("linkedinUrl") as string
  const skills = formData.get("skills") as string
  const walletAddress = formData.get("walletAddress") as string

  if (!fullName) {
    return { error: "Full name is required" }
  }

  try {
    const profileData: any = {
      full_name: fullName,
      bio: bio || null,
      linkedin_url: linkedinUrl || null,
      wallet_address: walletAddress || null,
      skills: skills || null,
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase.from("users").select("id").eq("id", user.id).single()

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase.from("users").update(profileData).eq("id", user.id)
      if (error) {
        return { error: error.message }
      }
    } else {
      // Create new profile
      const { error } = await supabase.from("users").insert({ id: user.id, email: user.email, ...profileData })
      if (error) {
        return { error: error.message }
      }
    }

    revalidatePath("/profile")
    return { success: "Profile updated successfully!" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function postJob(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    console.log("[v0] auth.getUser error:", userErr.message)
    return { error: "Authentication error. Please sign in again." }
  }
  if (!user) {
    return { error: "Not authenticated" }
  }

  const title = formData.get("title")
  const description = formData.get("description")
  const jobType = formData.get("jobType")
  const location = formData.get("location")
  const remoteAllowed = formData.get("remoteAllowed") === "on"
  const requiredSkills = formData.get("requiredSkills")
  const salaryMin = formData.get("salaryMin")
  const salaryMax = formData.get("salaryMax")
  const budgetMin = formData.get("budgetMin")
  const budgetMax = formData.get("budgetMax")

  // Blockchain payment fields
  const transactionHash = formData.get("transactionHash")
  const walletAddress = formData.get("walletAddress")
  const blockchain = formData.get("blockchain")

  if (!title || !description || !jobType) {
    return { error: "Title, description, and job type are required" }
  }

  // Require payment details before posting
  if (!transactionHash || !walletAddress || !blockchain) {
    return { error: "Payment verification required. Please complete the blockchain payment." }
  }

  // Prepare full payload (for advanced schema)
  const fullJobData: any = {
    posted_by: user.id,
    title: title.toString(),
    description: description.toString(),
    job_type: jobType.toString(),
    location: location?.toString() || null,
    skills_required: requiredSkills?.toString() || null,
    status: "active",
    remote_allowed: remoteAllowed,
  }

  if (jobType === "freelance" || jobType === "contract") {
    if (budgetMin) fullJobData.budget_min = Number.parseFloat(budgetMin.toString())
    if (budgetMax) fullJobData.budget_max = Number.parseFloat(budgetMax.toString())
  } else {
    if (salaryMin) fullJobData.salary_min = Number.parseFloat(salaryMin.toString())
    if (salaryMax) fullJobData.salary_max = Number.parseFloat(salaryMax.toString())
  }

  // Minimal payload (for basic schema)
  const minimalJobData: any = {
    posted_by: user.id,
    title: title.toString(),
    description: description.toString(),
    job_type: jobType.toString(),
    location: location?.toString() || null,
    skills_required: requiredSkills?.toString() || null,
  }
  if (salaryMin) minimalJobData.salary_min = Number.parseFloat(salaryMin.toString())
  if (salaryMax) minimalJobData.salary_max = Number.parseFloat(salaryMax.toString())

  // Try full insert first, then retry with minimal fields if schema is simpler
  let jobId: string | null = null
  try {
    const { data: job1, error: err1 } = await supabase.from("jobs").insert(fullJobData).select().single()
    if (err1) {
      console.log("[v0] jobs insert (full) failed:", err1.message)
      // Retry with minimal columns in case schema misses advanced fields
      const { data: job2, error: err2 } = await supabase.from("jobs").insert(minimalJobData).select().single()
      if (err2) {
        console.log("[v0] jobs insert (minimal) failed:", err2.message)
        if (err2.message.toLowerCase().includes("relation") || err2.message.toLowerCase().includes("does not exist")) {
          return {
            error: "Database not initialized. Please run the SQL to create the jobs table in Supabase and try again.",
          }
        }
        if (err2.message.toLowerCase().includes("foreign key")) {
          return {
            error: "Your account isn’t linked in the users table yet. Sign out and sign in again, then try posting.",
          }
        }
        return { error: err2.message }
      }
      jobId = job2!.id
    } else {
      jobId = job1!.id
    }
  } catch (e: any) {
    console.log("[v0] jobs insert threw:", e?.message || e)
    return { error: "Could not create job. Please try again." }
  }

  // Record payment (non-blocking). If the payments table or columns aren’t there yet, we don’t fail the post.
  try {
    const amount = blockchain?.toString() === "solana" ? 0.0001 : 0.00001
    const currency =
      blockchain?.toString() === "solana" ? "SOL" : blockchain?.toString() === "polygon" ? "MATIC" : "ETH"

    const adminWallet =
      blockchain?.toString() === "solana"
        ? "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
        : "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4"

    const { error: payErr } = await supabase.from("payments").insert({
      user_id: user.id,
      job_id: jobId,
      transaction_hash: transactionHash.toString(),
      blockchain: blockchain.toString(),
      amount,
      currency,
      status: "confirmed",
      admin_wallet: adminWallet,
      user_wallet: walletAddress.toString(),
    })
    if (payErr) {
      console.log("[v0] payments insert failed (non-blocking):", payErr.message)
    }
  } catch (e: any) {
    console.log("[v0] payments insert threw (non-blocking):", e?.message || e)
  }

  revalidatePath("/jobs")
  redirect(`/jobs/${jobId}`)
}
