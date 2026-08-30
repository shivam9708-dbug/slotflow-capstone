require('dotenv').config();
const express = require('express');
const cors = require('cors');
const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Yahan '/api' ke andar saare routes map ho rahe hain
app.use('/api', appointmentRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});