import { useState, useEffect } from 'react';
import SlotPicker from './components/SlotPicker';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // NAYA LIVE URL
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/services');
        if(res.ok) {
          const data = await res.json();
          setServices(data);
          if(data.length > 0) setSelectedServiceId(data[0].id);
        }
      } catch (error) {
        console.error("Services fetch fail:", error);
      }
    };
    fetchServices();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingStatus({ loading: true, success: false, error: null });

    try {
      // NAYA LIVE URL
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, serviceId: selectedServiceId, date,
          startTime: selectedSlot.start_time, endTime: selectedSlot.end_time
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setBookingStatus({ loading: false, success: true, error: null });
    } catch (error) {
      setBookingStatus({ loading: false, success: false, error: error.message });
    }
  };

  if (bookingStatus.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center border border-green-100">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully scheduled for <br/>
            <span className="font-semibold text-gray-900">{date} at {selectedSlot.label}</span>.
          </p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">SlotFlow</h1>
            <span className="text-sm text-gray-500 font-medium hidden md:inline">Smart Appointment System</span>
          </div>
          <button onClick={() => setIsAdminView(!isAdminView)} className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition cursor-pointer">
            {isAdminView ? 'Go to Booking Page' : 'Admin Panel'}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isAdminView ? (
          <AdminDashboard />
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Book an Appointment</h2>
            <p className="text-gray-500 text-sm mb-6">Select a service and date to see available timings.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                <select value={selectedServiceId} onChange={(e) => { setSelectedServiceId(e.target.value); setSelectedSlot(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  {services.map(srv => (
                    <option key={srv.id} value={srv.id}>{srv.name} ({srv.duration_minutes} mins)</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input type="date" value={date} onChange={(e) => { setDate(e.target.value); setSelectedSlot(null); }} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Available Slots</h3>
              {date && selectedServiceId ? (
                <SlotPicker date={date} serviceId={selectedServiceId} onSlotSelect={(slot) => setSelectedSlot(slot)} />
              ) : (
                <div className="text-gray-400 text-sm italic">Please select a date to view slots.</div>
              )}
            </div>

            {selectedSlot && (
              <form onSubmit={handleBooking} className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Enter Details for {selectedSlot.label}</h3>
                <div className="space-y-4">
                  <input required type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 outline-none bg-white" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 outline-none bg-white" />
                    <input required type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 outline-none bg-white" />
                  </div>
                </div>
                {bookingStatus.error && <p className="text-red-500 text-sm mt-3">{bookingStatus.error}</p>}
                <button type="submit" disabled={bookingStatus.loading} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition disabled:bg-blue-400 cursor-pointer">
                  {bookingStatus.loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;