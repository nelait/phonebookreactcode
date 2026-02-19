import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateAppointmentId } from '../../utils/idGenerator';
import { isUpcoming, isPast, isDueSoon, isToday, getCreatedAt } from '../../utils/dateHelpers';
import mockAppointments from '../../mocks/appointments.json';

export const useAppointments = () => {
  const [appointments, setAppointments] = useLocalStorage('appointments', mockAppointments);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const getFiltered = () => {
    let result = appointments;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    } else if (filter === 'upcoming') {
      result = result.filter((a) => isUpcoming(a.date, a.time));
    } else if (filter === 'past') {
      result = result.filter((a) => isPast(a.date, a.time));
    } else if (categoryFilter) {
      result = result.filter((a) => a.category === categoryFilter);
    }

    result.sort((a, b) => {
      const aTime = new Date(`${a.date}T${a.time}`).getTime();
      const bTime = new Date(`${b.date}T${b.time}`).getTime();
      const now = Date.now();
      const aUp = aTime > now;
      const bUp = bTime > now;

      if (aUp !== bUp) return bUp ? 1 : -1;
      if (aUp) return aTime - bTime;
      return bTime - aTime;
    });

    return result;
  };

  const categories = [...new Set(appointments.map((a) => a.category))].sort();

  const getById = useCallback(
    (id) => appointments.find((a) => a.id === id) || null,
    [appointments]
  );

  const save = useCallback(
    (data) => {
      const isEditOp = data.id && appointments.some((a) => a.id === data.id);
      if (isEditOp) {
        setAppointments(appointments.map((a) => (a.id === data.id ? data : a)));
        setSuccessMessage('Appointment updated successfully!');
      } else {
        const newAppt = {
          ...data,
          id: data.id || generateAppointmentId(),
          createdAt: data.createdAt || getCreatedAt(),
          reminderSent: data.reminderSent || false,
        };
        setAppointments([...appointments, newAppt]);
        setSuccessMessage('Appointment added successfully!');
      }
    },
    [appointments, setAppointments]
  );

  const remove = useCallback(
    (id) => {
      setAppointments(appointments.filter((a) => a.id !== id));
      setSuccessMessage('Appointment deleted successfully!');
    },
    [appointments, setAppointments]
  );

  const markReminderSent = useCallback(
    (id) => {
      setAppointments(
        appointments.map((a) => (a.id === id ? { ...a, reminderSent: true } : a))
      );
    },
    [appointments, setAppointments]
  );

  const getDueSoon = useCallback(
    () => appointments.filter((a) => isDueSoon(a.date, a.time)),
    [appointments]
  );

  const getTodayAppointments = useCallback(
    () => appointments.filter((a) => isToday(a.date)),
    [appointments]
  );

  return {
    appointments: getFiltered(),
    allAppointments: appointments,
    search,
    setSearch,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    categories,
    successMessage,
    setSuccessMessage,
    getById,
    save,
    remove,
    markReminderSent,
    getDueSoon,
    getTodayAppointments,
  };
};
