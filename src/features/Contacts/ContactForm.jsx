import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useContacts } from './useContacts';
import { generateContactId } from '../../utils/idGenerator';

const CATEGORIES = ['General', 'Family', 'Friends', 'Work', 'Business', 'Emergency'];

export const ContactForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const { getById, save } = useContacts();
  const isEdit = Boolean(editId);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (editId) {
      const contact = getById(editId);
      if (contact) {
        setName(contact.name);
        setPhone(contact.phone);
        setEmail(contact.email);
        setCategory(contact.category);
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [editId, getById, navigate]);

  const validate = () => {
    const errs = [];
    if (!name.trim()) errs.push('Name is required.');
    if (!phone.trim()) errs.push('Phone number is required.');
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    save({
      id: editId || generateContactId(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      category,
    });
    navigate('/');
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{isEdit ? 'Edit Contact' : 'New Contact'}</h1>
          <p className="subtitle">
            {isEdit ? 'Update contact details' : 'Fill in the details below'}
          </p>
        </div>
        <Link to="/" className="btn btn-ghost">
          ← Back
        </Link>
      </div>

      {errors.length > 0 && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <ul className="error-list">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">
                Full Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-ghost">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              {isEdit ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
