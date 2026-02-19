import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContacts } from './useContacts';

export const PhonebookScreen = () => {
  const { contacts, allContacts, search, setSearch, successMessage, remove } = useContacts();
  const [searchInput, setSearchInput] = useState(search);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
  };

  const handleDelete = (contact) => {
    if (window.confirm(`Delete ${contact.name}?`)) {
      remove(contact.id);
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
          <h1>My Contacts</h1>
          <p className="subtitle">
            {allContacts.length} contact{allContacts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link to="/add" className="btn btn-primary">
          <span>＋</span> Add Contact
        </Link>
      </div>

      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, phone, or email…"
          className="search-input"
        />
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
        {search && (
          <button type="button" onClick={handleClear} className="btn btn-ghost">
            Clear
          </button>
        )}
      </form>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h2>No contacts found</h2>
          <p>{search ? 'Try a different search term.' : 'Add your first contact to get started!'}</p>
          {!search && (
            <Link to="/add" className="btn btn-primary">
              ＋ Add Contact
            </Link>
          )}
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
                    <span className="avatar">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                    {c.name}
                  </td>
                  <td>{c.phone}</td>
                  <td>{c.email || '—'}</td>
                  <td>
                    <span className="badge">{c.category}</span>
                  </td>
                  <td className="td-actions">
                    <Link
                      to={`/edit?id=${encodeURIComponent(c.id)}`}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(c)}
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
    </>
  );
};
