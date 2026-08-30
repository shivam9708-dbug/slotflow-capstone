const slotService = require('../services/slot.service');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Services fetch karne ka naya function
exports.getServices = async (req, res) => {
    try {
        const { data, error } = await supabase.from('services').select('*').eq('is_active', true);
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { date, serviceId } = req.query;
        if (!date || !serviceId) return res.status(400).json({ error: 'Date and Service ID are required' });
        
        const slots = await slotService.generateAvailableSlots(date, serviceId);
        res.json({ slots });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { name, email, phone, serviceId, date, startTime, endTime } = req.body;
        
        let { data: customer } = await supabase.from('customers').select('id').eq('email', email).single();
        if (!customer) {
            const { data: newCustomer } = await supabase.from('customers').insert([{ name, email, phone }]).select().single();
            customer = newCustomer;
        }

        const { data: appointment, error } = await supabase.from('appointments').insert([{
            customer_id: customer.id,
            service_id: serviceId,
            appointment_date: date,
            start_time: startTime,
            end_time: endTime
        }]).select();

        if (error) {
            if (error.code === '23505') return res.status(409).json({ error: 'This slot was just booked by someone else.' });
            throw error;
        }

        res.status(201).json({ message: 'Appointment confirmed', appointment });
    } catch (error) {
        res.status(500).json({ error: 'Failed to book appointment' });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        // Supabase ka kamaal: Ye ek hi baar mein appointments ke sath customer aur service ka naam bhi le aayega
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id, appointment_date, start_time,
                customers ( name, phone ),
                services ( name )
            `)
            .order('appointment_date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};