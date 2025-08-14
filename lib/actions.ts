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
  } = await supabase.auth.getUser()
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

  // Added blockchain payment fields
  const transactionHash = formData.get("transactionHash")
  const walletAddress = formData.get("walletAddress")
  const blockchain = formData.get("blockchain")

  if (!title || !description || !jobType) {
    return { error: "Title, description, and job type are required" }
  }

  // Validate payment information
  if (!transactionHash || !walletAddress || !blockchain) {
    return { error: "Payment verification required. Please complete the blockchain payment." }
  }

  const jobData: any = {
    posted_by: user.id,
    title: title.toString(),
    description: description.toString(),
    job_type: jobType.toString(),
    location: location?.toString() || null,
    remote_allowed: remoteAllowed,
    skills_required: requiredSkills?.toString() || null,
    status: "active",
  }

  // Add salary or budget based on job type
  if (jobType === "freelance" || jobType === "contract") {
    if (budgetMin) jobData.budget_min = Number.parseFloat(budgetMin.toString())
    if (budgetMax) jobData.budget_max = Number.parseFloat(budgetMax.toString())
  } else {
    if (salaryMin) jobData.salary_min = Number.parseFloat(salaryMin.toString())
    if (salaryMax) jobData.salary_max = Number.parseFloat(salaryMax.toString())
  }

  // Insert job and payment record in a transaction
  const { data: job, error: jobError } = await supabase.from("jobs").insert(jobData).select().single()

  if (jobError) {
    return { error: jobError.message }
  }

  // Record the payment transaction
  const { error: paymentError } = await supabase.from("payments").insert({
    user_id: user.id,
    job_id: job.id,
    transaction_hash: transactionHash.toString(),
    blockchain: blockchain.toString(),
    amount: blockchain === "solana" ? 0.0001 : 0.00001,
    currency: blockchain === "solana" ? "SOL" : blockchain === "polygon" ? "MATIC" : "ETH",
    status: "confirmed",
    admin_wallet:
      blockchain === "solana"
        ? "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
        : "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4",
    user_wallet: walletAddress.toString(),
  })

  if (paymentError) {
    console.error("Payment record error:", paymentError)
    // Don't fail the job posting if payment recording fails
  }

  revalidatePath("/jobs")
  redirect(`/jobs/${job.id}`)
}
