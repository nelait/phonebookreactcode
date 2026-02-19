import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateContactId } from '../../utils/idGenerator';
import mockContacts from '../../mocks/contacts.json';

export const useContacts = () => {
  const [contacts, setContacts] = useLocalStorage('contacts', mockContacts);
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredContacts = search
    ? contacts.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      })
    : contacts;

  const getById = useCallback(
    (id) => contacts.find((c) => c.id === id) || null,
    [contacts]
  );

  const save = useCallback(
    (contactData) => {
      const isEdit = contactData.id && contacts.some((c) => c.id === contactData.id);
      if (isEdit) {
        setContacts(contacts.map((c) => (c.id === contactData.id ? contactData : c)));
        setSuccessMessage('Contact updated successfully!');
      } else {
        const newContact = {
          ...contactData,
          id: contactData.id || generateContactId(),
        };
        setContacts([...contacts, newContact]);
        setSuccessMessage('Contact added successfully!');
      }
    },
    [contacts, setContacts]
  );

  const remove = useCallback(
    (id) => {
      setContacts(contacts.filter((c) => c.id !== id));
      setSuccessMessage('Contact deleted successfully!');
    },
    [contacts, setContacts]
  );

  return {
    contacts: filteredContacts,
    allContacts: contacts,
    search,
    setSearch,
    successMessage,
    setSuccessMessage,
    getById,
    save,
    remove,
  };
};
