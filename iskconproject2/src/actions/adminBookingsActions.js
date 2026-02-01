"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server"


export async function getAllBookings() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })

  if (error) {
    console.error("Fetch bookings error:", error.message)
    throw new Error("Failed to fetch bookings")
  }

  return data
}


export async function approveBooking(id) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("bookings")
    .update({ status: "approved" })
    .eq("id", id)

  if (error) {
    console.error("Approve booking error:", error.message)
    throw new Error("Approve failed")
  }
}


export async function rejectBooking(id) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from("bookings")
    .update({ status: "rejected" })
    .eq("id", id)

  if (error) {
    console.error("Reject booking error:", error.message)
    throw new Error("Reject failed")
  }
}
