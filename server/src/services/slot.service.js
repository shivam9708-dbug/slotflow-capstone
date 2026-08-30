const { createClient } = require('@supabase/supabase-js');
const { format, addMinutes, parse, isBefore } = require('date-fns');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const generateAvailableSlots = async (dateStr, serviceId) => {
    // 1. Service ki duration fetch karo
    const { data: service } = await supabase.from('services').select('duration_minutes').eq('id', serviceId).single();
    if (!service) throw new Error('Service not found');
    const duration = service.duration_minutes;

    // 2. Us din clinic khula hai ya nahi, ye check karo
    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay(); // 0 (Sun) to 6 (Sat)
    const { data: availability } = await supabase.from('availability').select('*').eq('day_of_week', dayOfWeek).single();

    if (!availability || availability.is_closed) return []; // Clinic band hai

    // 3. Us din ki existing booked appointments fetch karo
    const { data: appointments } = await supabase
        .from('appointments')
        .select('start_time, end_time')
        .eq('appointment_date', dateStr)
        .neq('status', 'cancelled');

    // 4. Time slots generate karo aur booked wale hata do
    let currentSlotTime = parse(availability.start_time, 'HH:mm:ss', dateObj);
    const closingTime = parse(availability.end_time, 'HH:mm:ss', dateObj);
    const availableSlots = [];
    const now = new Date();

    while (addMinutes(currentSlotTime, duration) <= closingTime) {
        const slotStartStr = format(currentSlotTime, 'HH:mm:ss');
        const slotEndStr = format(addMinutes(currentSlotTime, duration), 'HH:mm:ss');

        // Past time slots hide karo (agar aaj ki booking ho rahi hai)
        if (dateStr === format(now, 'yyyy-MM-dd') && isBefore(currentSlotTime, now)) {
            currentSlotTime = addMinutes(currentSlotTime, duration);
            continue;
        }

        // Check karo ki ye slot already booked to nahi hai
        const isBooked = appointments.some(appt => (slotStartStr >= appt.start_time && slotStartStr < appt.end_time));

        if (!isBooked) {
            availableSlots.push({
                start_time: slotStartStr,
                end_time: slotEndStr,
                label: format(currentSlotTime, 'hh:mm a')
            });
        }
        currentSlotTime = addMinutes(currentSlotTime, duration);
    }
    return availableSlots;
};

module.exports = { generateAvailableSlots };