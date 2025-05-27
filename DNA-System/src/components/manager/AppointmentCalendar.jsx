import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { test } from '../../services/api/test';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await test.getAllAppointments();
      const formattedAppointments = data.map(apt => ({
        ...apt,
        start: new Date(apt.appointmentDate),
        end: new Date(moment(apt.appointmentDate).add(1, 'hours')),
        title: `${apt.testType} - ${apt.patientName}`
      }));
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title mb-4">Appointment Calendar</h5>
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </div>
    </div>
  );
};

export default AppointmentCalendar;
