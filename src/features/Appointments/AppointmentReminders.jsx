import { Link } from 'react-router-dom';
import { useAppointments } from './useAppointments';
import { formatDate, formatTime } from '../../utils/dateHelpers';

export const AppointmentReminders = () => {
  const { getDueSoon, getTodayAppointments, markReminderSent } = useAppointments();
  const dueSoon = getDueSoon();
  const todayAppts = getTodayAppointments();

  const handleMarkReminded = (id) => {
    markReminderSent(id);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Appointment Reminders</h1>
          <p className="subtitle">Upcoming appointments and reminders</p>
        </div>
        <Link to="/appointments" className="btn btn-ghost">← Back to Appointments</Link>
      </div>

      {dueSoon.length > 0 && (
        <div className="reminder-section">
          <h2 className="section-title">Due Within 24 Hours</h2>
          <div className="reminder-list">
            {dueSoon.map((appt) => (
              <div key={appt.id} className="reminder-card urgent">
                <div className="reminder-header">
                  <div className="reminder-time">
                    <div className="reminder-date">{formatDate(appt.date)}</div>
                    <div className="reminder-clock">{formatTime(appt.time)}</div>
                  </div>
                  <div className="reminder-content">
                    <h3>{appt.title}</h3>
                    {appt.description && <p>{appt.description}</p>}
                    {appt.location && <div className="location">📍 {appt.location}</div>}
                  </div>
                  <div className="reminder-actions">
                    {!appt.reminderSent ? (
                      <button
                        onClick={() => handleMarkReminded(appt.id)}
                        className="btn btn-sm btn-primary"
                      >
                        Mark as Reminded
                      </button>
                    ) : (
                      <span className="reminded-badge-text">✅ Reminded</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {todayAppts.length > 0 && (
        <div className="reminder-section">
          <h2 className="section-title">Today's Appointments</h2>
          <div className="reminder-list">
            {todayAppts.map((appt) => (
              <div key={appt.id} className="reminder-card today">
                <div className="reminder-header">
                  <div className="reminder-time">
                    <div className="reminder-date">Today</div>
                    <div className="reminder-clock">{formatTime(appt.time)}</div>
                  </div>
                  <div className="reminder-content">
                    <h3>{appt.title}</h3>
                    {appt.description && <p>{appt.description}</p>}
                    {appt.location && <div className="location">📍 {appt.location}</div>}
                  </div>
                  <div className="reminder-actions">
                    {!appt.reminderSent ? (
                      <button
                        onClick={() => handleMarkReminded(appt.id)}
                        className="btn btn-sm btn-primary"
                      >
                        Mark as Reminded
                      </button>
                    ) : (
                      <span className="reminded-badge-text">✅ Reminded</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dueSoon.length === 0 && todayAppts.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔔</span>
          <h2>No upcoming reminders</h2>
          <p>You don't have any appointments due soon or today.</p>
          <Link to="/appointments/add" className="btn btn-primary">Schedule New Appointment</Link>
        </div>
      )}
    </>
  );
};
