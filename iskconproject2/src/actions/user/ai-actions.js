'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getAiSuggestions(bookingData) {
  try {
    // Use Admin client to see ALL bookings for context
    const supabase = await createSupabaseServerClient({ admin: true });

    // 1. Fetch all rooms
    const { data: allRooms } = await supabase
      .from('rooms')
      .select('id, name')
      .eq('is_active', true);

    // 2. Fetch existing bookings for the requested date
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('room_id, start_time, end_time')
      .eq('date', bookingData.date)
      .in('status', ['pending', 'approved']);

    // 3. Construct Context for AI
    const roomList = allRooms.map(r => `${r.name} (ID: ${r.id})`).join(', ');
    const bookingsList = existingBookings.map(b =>
      `Room ID ${b.room_id}: ${b.start_time} to ${b.end_time}`
    ).join('; ');

    console.log("AI Context - Bookings:", bookingsList);

    const prompt = `
      I am a booking assistant. A user wants to book a room but the slot is taken.
      
      User Request:
      - Date: ${bookingData.date}
      - Desired Room ID: ${bookingData.room_id}
      - Desired Time: ${bookingData.start_time} - ${bookingData.end_time}
      
      Context:
      - Available Rooms: ${roomList}
      - Existing Bookings on ${bookingData.date}: ${bookingsList || "None"}

      Task:
      Suggest 3 alternative slots. 
      Prioritize: 
      1. The same room at a nearby time.
      2. A different room at the same time.
      3. A different room at a nearby time.

      Rules:
      - Do NOT suggest a slot that overlaps with an existing booking for that room.
      - A booking cannot start before 09:00 or end after 18:00.
      - Each slot must be the same duration as the user's request.
      - Return EXACTLY 3 suggestions if possible.

      Output JSON only:
      {
        "suggestions": [
          {
            "roomId": "...",
            "roomName": "...",
            "date": "YYYY-MM-DD",
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "reason": "Available at same time in different room" 
          }
        ]
      }
    `;

    // 4. Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini Raw Response:", text);

    // Clean markdown manually if needed, though responseMimeType usually handles it.
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '');
    const parsed = JSON.parse(cleanText);

    return { success: true, data: parsed.suggestions };

  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return { success: false, error: "Failed to generate suggestions." };
  }
}
