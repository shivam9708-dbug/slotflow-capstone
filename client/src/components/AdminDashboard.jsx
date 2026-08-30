import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        // NAYA LIVE URL
        fetch(import.meta.env.VITE_API_URL + '/api/appointments')
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Today's Bookings</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm">
                            <th className="p-3 border-b">Date</th>
                            <th className="p-3 border-b">Time</th>
                            <th className="p-3 border-b">Patient Name</th>
                            <th className="p-3 border-b">Phone</th>
                            <th className="p-3 border-b">Service</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.length === 0 ? (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No appointments yet</td></tr>
                        ) : (
                            appointments.map(app => (
                                <tr key={app.id} className="border-b hover:bg-gray-50 text-sm">
                                    <td className="p-3 font-medium">{app.appointment_date}</td>
                                    <td className="p-3 text-blue-600 font-semibold">{app.start_time.slice(0,5)}</td>
                                    <td className="p-3">{app.customers?.name}</td>
                                    <td className="p-3">{app.customers?.phone}</td>
                                    <td className="p-3">{app.services?.name}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}