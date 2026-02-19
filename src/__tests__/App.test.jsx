```javascript
// src/__tests__/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// ============================================================
// Mock API service
// ============================================================
const mockApi = {
  login: jest.fn(),
  logout: jest.fn(),
  getContacts: jest.fn(),
  addContact: jest.fn(),
  updateContact: jest.fn(),
  deleteContact: jest.fn(),
  searchContacts: jest.fn(),
  getAppointments: jest.fn(),
  addAppointment: jest.fn(),
  updateAppointment: jest.fn(),
  deleteAppointment: jest.fn(),
  searchAppointments: jest.fn(),
  getUpcomingAppointments: jest.fn(),
  getPastAppointments: jest.fn(),
  getAppointmentsByCategory: jest.fn(),
  markReminderSent: jest.fn(),
  getDueSoonAppointments: jest.fn(),
  getTasks: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  toggleTaskComplete: jest.fn(),
  searchTasks: jest.fn(),
  getTasksByStatus: jest.fn(),
  getStocks: jest.fn(),
  addStock: jest.fn(),
  updateStock: jest.fn(),
  deleteStock: jest.fn(),
  searchStocks: jest.fn(),
  getStocksBySector: jest.fn(),
  getGainers: jest.fn(),
  getLosers: jest.fn(),
  getPortfolioSummary: jest.fn(),
  getWebsites: jest.fn(),
  addWebsite: jest.fn(),
  updateWebsite: jest.fn(),
  deleteWebsite: jest.fn(),
  searchWebsites: jest.fn(),
  getWebsitesByCategory: jest.fn(),
  getTheme: jest.fn(),
  toggleTheme: jest.fn(),
};

jest.mock('../services/api', () => mockApi);

// ============================================================
// Mock Auth Context
// ============================================================
const mockAuthContext = {
  isAuthenticated: false,
  username: '',
  login: jest.fn(),
  logout: jest.fn(),
};

const AuthContext = React.createContext(mockAuthContext);

const AuthProvider = ({ children, value }) => (
  <AuthContext.Provider value={{ ...mockAuthContext, ...value }}>
    {children}
  </AuthContext.Provider>
);

// ============================================================
// Component stubs matching PHP views
// ============================================================

// Login Component (from login.php)
function LoginPage() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const auth = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await mockApi.login(username, password);
      if (result.success) {
        auth.login(username);
      } else {
        setError('Invalid username or password.');
      }
    } catch {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">📞</span>
          <h1>PhoneBook</h1>
          <p className="auth-subtitle">Sign in to manage your contacts</p>
        </div>
        {error && (
          <div className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </form>
        <div className="auth-footer">
          <p>Default: <code>admin</code> / <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
}

// Navbar Component (from layout.php)
function Navbar({ username }) {
  const auth = React.useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-icon">📞</span>
        <span className="nav-title">PhoneBook</span>
      </div>
      <div className="nav-links">
        <a href="/" className="nav-link">Contacts</a>
        <a href="/appointments" className="nav-link">Appointments</a>
        <a href="/tasks" className="nav-link">Tasks</a>
        <a href="/stocks" className="nav-link">Stocks</a>
        <a href="/websites" className="nav-link">Websites</a>
      </div>
      <div className="nav-right">
        <a href="/settings" className="btn btn-ghost nav-settings" title="Settings">⚙️</a>
        <span className="nav-user">👤 {username || 'User'}</span>
        <button onClick={auth.logout} className="btn btn-ghost">Logout</button>
      </div>
    </nav>
  );
}

// Contact List (from phonebook.php)
function PhonebookPage() {
  const [contacts, setContacts] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    const data = await mockApi.getContacts();
    setContacts(data || []);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const data = await mockApi.searchContacts(search);
      setContacts(data || []);
    } else {
      loadContacts();
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      await mockApi.deleteContact(id);
      setSuccess('Contact deleted successfully!');
      loadContacts();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {success && (
        <div className="alert alert-success" role="alert">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}
      <div className="page-header">
        <div>
          <h1>My Contacts</h1>
          <p className="subtitle">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <a href="/add" className="btn btn-primary">＋ Add Contact</a>
      </div>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          name="search"
          placeholder="Search by name, phone, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="btn btn-secondary">Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); loadContacts(); }} className="btn btn-ghost">
            Clear
          </button>
        )}
      </form>
      {contacts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h2>No contacts found</h2>
          <p>{search ? 'Try a different search term.' : 'Add your first contact to get started!'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Category</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td className="td-name">
                    <span className="avatar">{c.name.charAt(0).toUpperCase()}</span>
                    {c.name}
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.email || '—'}</td>
                  <td><span className="badge">{c.category}</span></td>
                  <td className="td-actions">
                    <a href={`/edit?id=${c.id}`} className="btn btn-sm btn-secondary">Edit</a>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Contact Form (from contact_form.php)
function ContactForm({ isEdit = false, initialContact = null, onSubmit }) {
  const [name, setName] = React.useState(initialContact?.name || '');
  const [phone, setPhone] = React.useState(initialContact?.phone || '');
  const [email, setEmail] = React.useState(initialContact?.email || '');
  const [category, setCategory] = React.useState(initialContact?.category || 'General');
  const [errors, setErrors] = React.useState([]);

  const categories = ['General', 'Family', 'Friends', 'Work', 'Business', 'Emergency'];

  const validate = () => {
    const errs = [];
    if (!name.trim()) errs.push('Name is required.');
    if (!phone.trim()) errs.push('Phone number is required.');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    if (onSubmit) {
      await onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim(), category, id: initialContact?.id });
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
          <p className="subtitle">{isEdit ? 'Update contact details' : 'Fill in the details below'}</p>
        </div>
        <a href="/" className="btn btn-ghost">← Back</a>
      </div>
      {errors.length > 0 && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <ul className="error-list">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name <span className="required">*</span></label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number <span className="required">*</span></label>
              <input type="tel" id="phone" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <a href="/" className="btn btn-ghost">Cancel</a>
            <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Add Contact'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Task List (from tasks.php)
function TasksPage() {
  const [tasks, setTasks] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await mockApi.getTasks();
    setTasks(data || []);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (search) {
      const data = await mockApi.searchTasks(search);
      setTasks(data || []);
    } else {
      loadTasks();
    }
  };

  const handleFilter = async (f) => {
    setFilter(f);
    if (f === 'completed') {
      const data = await mockApi.getTasksByStatus(true);
      setTasks(data || []);
    } else if (f === 'pending') {
      const data = await mockApi.getTasksByStatus(false);
      setTasks(data || []);
    } else {
      loadTasks();
    }
  };

  const handleToggle = async (id) => {
    const result = await mockApi.toggleTaskComplete(id);
    if (result?.success) {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: result.completed } : t));
      setSuccess(result.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      await mockApi.deleteTask(id);
      setSuccess('Task deleted