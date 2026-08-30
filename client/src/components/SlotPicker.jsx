import { useState, useEffect } from 'react';

export default function SlotPicker({ date, serviceId, onSlotSelect }) {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (!date || !serviceId) return;
        
        setLoading(true);
        setApiError(""); // Purane errors clear karein
        
        fetch(`${import.meta.env.VITE_API_URL}/api/slots?date=${date}&serviceId=${serviceId}`)
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Server error fetching slots');
                return data;
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setSlots(data);
                } else {
                    throw new Error("API did not return a valid list of slots");
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Slot fetch error:", err);
                setApiError(err.message);
                setSlots([]);
                setLoading(false);
            });
    }, [date, serviceId]);

    if (loading) return <div className="text-sm text-gray-500 font-medium">Checking availability...</div>;
    if (apiError) return <div className="text-sm text-red-500 font-medium">⚠️ Error: {apiError}</div>;
    if (slots.length === 0) return <div className="text-sm text-gray-500">No slots available for this date.</div>;

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {slots.map((slot, index) => (
                <button
                    key={index}
                    onClick={() => onSlotSelect(slot)}
                    disabled={!slot.available}
                    className={`py-2 px-3 text-sm rounded-md border transition ${
                        slot.available 
                            ? 'bg-white border-blue-600 text-blue-600 hover:bg-blue-50 cursor-pointer' 
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {slot.label}
                </button>
            ))}
        </div>
    );
}