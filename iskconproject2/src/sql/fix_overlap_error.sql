-- Trigger function to check for overlaps
-- This function runs BEFORE every INSERT or UPDATE on the 'bookings' table.
-- It works regardless of time format (HH:MM strings) because strings compare alphabetically correctly in 24h format.

CREATE OR REPLACE FUNCTION check_booking_overlap()
RETURNS TRIGGER AS $$
BEGIN
    -- Only check if the status is relevant (pending or approved)
    IF NEW.status IN ('pending', 'approved') THEN
        
        -- Check if there is an existing booking for the same room on the same date
        -- that overlaps with the new time slot.
        -- We check against both 'pending' and 'approved' to be strict.
        -- If you only want to prevent APPROVED overlaps, change status to check only against 'approved'
        IF EXISTS (
            SELECT 1 FROM bookings
            WHERE room_id = NEW.room_id
              AND date = NEW.date
              AND id != NEW.id  -- Don't check against itself during updates
              AND status IN ('pending', 'approved') -- Conflict with any active booking
              AND start_time < NEW.end_time
              AND end_time > NEW.start_time
        ) THEN
            RAISE EXCEPTION 'Booking overlaps with an existing reservation.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger
DROP TRIGGER IF EXISTS trigger_check_booking_overlap ON bookings;

CREATE TRIGGER trigger_check_booking_overlap
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_booking_overlap();
