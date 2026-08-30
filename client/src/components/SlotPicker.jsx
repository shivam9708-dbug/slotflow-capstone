import { useState, useEffect } from 'react';

export default function SlotPicker({ date, serviceId, onSlotSelect }) {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!date || !serviceId) return;
        
        const fetchSlots = async () => {
            setLoading(true);
            setError(null);
            try {
                // Port 5001 hardcoded here
                const response = await fetch(`http://localhost:5001/api/slots?date=${date}&serviceId=${serviceId}`);
                if (!response.ok) throw new Error('Failed to fetch slots');
                
                const data = await response.json();
                setSlots(data.slots);
            } catch (err) {
                setError("Server se connect nahi ho paya. Backend chalu hai?");
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [date, serviceId]);

    if (loading) return <div className="text-blue-500 font-medium py-4">Loading available timings...</div>;
    if (error) return <div className="text-red-500 font-medium py-4">{error}</div>;
    if (slots.length === 0) return <div className="text-gray-500 py-4">Is din koi slot available nahi hai (ya clinic band hai).</div>;

    return (
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4 pt-2">
            {slots.map((slot) => (
                <button
                    key={slot.start_time}
                    onClick={() => onSlotSelect(slot)}
                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                >
                    {slot.label}
                </button>
            ))}
        </div>
    );
}