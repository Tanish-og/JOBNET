import { redirect } from "next/navigation"

export default function EditProfilePage() {
  // Redirect to the main profile page since we handle editing there
  redirect("/profile")
}
