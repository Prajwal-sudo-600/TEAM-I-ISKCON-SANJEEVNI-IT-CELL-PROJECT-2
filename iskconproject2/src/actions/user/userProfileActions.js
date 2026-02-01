'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'


export async function getProfile() {
  const supabase = await createSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, data: null }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code === 'PGRST116') {
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
      })
      .select()
      .single()

    if (insertError) {
      console.error(insertError)
      return { success: false, data: null }
    }


    return {
      success: true,
      data: {
        ...newProfile,
        email: user.email
      }
    }
  }

  if (error) {
    console.error(error)
    return { success: false, data: null }
  }


  return {
    success: true,
    data: {
      ...data,
      email: user.email
    }
  }
}




export async function upsertProfile(profileData) {
  try {
    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const payload = {
      id: user.id,
      full_name: profileData.full_name,
      phone: profileData.phone, // MATCHES DB
      address: profileData.address,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(payload)

    if (error) {
      console.error(error)
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error(err)
    return { success: false }
  }
}



export async function logout() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
}
