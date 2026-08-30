const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.get('/services', appointmentController.getServices);
router.get('/slots', appointmentController.getAvailableSlots);
router.post('/book', appointmentController.bookAppointment);

router.get('/appointments', appointmentController.getAllAppointments);
module.exports = router;