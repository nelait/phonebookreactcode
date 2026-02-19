import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from './useAppointments';
import { isUpcoming, isPast, isDueSoon, isToday, formatDate, formatTime } from '../../utils/dateHelpers';

export const AppointmentsScreen = () => {
  const {
    appointments,
    allAppointments,
    search,
    setSearch,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    successMessage,
    remove,
  } = useAppointments();

  const [searchInput, setSearchInput] = useState(search);

  const upcomingCount = allAppointments.filter((a) => isUpcoming(a.date, a.time)).length;
  const pastCount = allAppointments.filter((a) => isPast(a.date, a.time)).length;

  const handleSearch = (e) => {
    e.preventDefault();
    setFilter('');
    setCategoryFilter('');
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleFilter = (f) => {
    setSearch('');
    setSearchInput('');
    setCategoryFilter('');
    setFilter(f);
  };

  const handleCategoryChange = (cat) => {
    setSearch('');
    setSearchInput('');
    setFilter('');
    setCategoryFilter(cat);
  };

  const handleDelete = (appt) => {
    if (window.confirm('Delete this appointment?')) {
      remove(appt.id);
    }
  };

  return (
    <>
      {successMessage && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {successMessage}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>Appointments</h1>
          <p className="subtitle">
            {upcomingCount} upcoming, {pastCount} past
          </p>
        </div>
        <div className="header-actions">
          <Link to="/appointments/reminders" className="btn btn-secondary">
            🔔 Reminders
          </Link>
          <Link to="/appointments/add" className="btn btn-primary">
            <span>＋</span> Add Appointment
          </Link>
        </div>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: 0 }}>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search appointments..."
            className="search-input"
          />
          <button type="submit" className="btn btn-secondary">Search</button>
          {search && (
            <button type="button" onClick={handleClear} className="btn btn-ghost">Clear</button>
          )}
        </form>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${!filter && !categoryFilter ? 'active' : ''}`}
            onClick={() => handleFilter('')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => handleFilter('past')}
          >
            Past
          </button>
        </div>

        {categories.length > 0 && (
          <div className="category-filter">
            <label htmlFor="cat-select">Category:</label>
            <select
              id="cat-select"
              value={categoryFilter}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {appointments.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📅</span>
          <h2>No appointments found</h2>
          <p>
            {search
              ? 'Try a different search term.'
              : filter
              ? `No ${filter} appointments found.`
              : categoryFilter
              ? 'No appointments found in this category.'
              : 'Add your first appointment to get started!'}
          </p>
          {!search && !filter && !categoryFilter && (
            <Link to="/appointments/add" className="btn btn-primary">＋ Add Appointment</Link>
          )}
        </div>
      ) : (
        <div className="cards-list">
          {appointments.map((appt) => {
            const upcoming = isUpcoming(appt.date, appt.time);
            const dueSoon = isDueSoon(appt.date, appt.time);
            const today = isToday(appt.date);
            const catClass = `category-${appt.category.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div
                key={appt.id}
                className={`appointment-card ${upcoming ? 'upcoming' : 'past'} ${dueSoon ? 'due-soon' : ''}`}
              >
                <div className="appointment-header">
                  <div className="appointment-datetime">
                    <div className="appointment-date">
                      {formatDate(appt.date)}
                      {today && <span className="today-badge">Today</span>}
                    </div>
                    <div className="appointment-time">{formatTime(appt.time)}</div>
                  </div>

                  <div className="appointment-content">
                    <h3 className="appointment-title">{appt.title}</h3>
                    {appt.description && (
                      <p className="appointment-description">{appt.description}</p>
                    )}
                    {appt.location && (
                      <div className="appointment-location">📍 {appt.location}</div>
                    )}
                  </div>

                  <div className="appointment-meta">
                    <span className={`category-badge ${catClass}`}>{appt.category}</span>
                    {dueSoon && <span className="due-soon-badge">Due Soon!</span>}
                    {appt.reminderSent && <span className="reminder-badge">🔔 Reminded</span>}
                  </div>
                </div>

                <div className="card-actions">
                  <Link
                    to={`/appointments/edit?id=${encodeURIComponent(appt.id)}`}
                    className="btn btn-sm btn-secondary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(appt)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
