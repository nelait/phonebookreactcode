import { nanoid } from 'nanoid';

export const generateId = (prefix) => {
  return `${prefix}${nanoid(20)}`;
};

export const generateContactId = () => generateId('c_');
export const generateAppointmentId = () => generateId('a_');
export const generateTaskId = () => generateId('t_');
export const generateStockId = () => generateId('s_');
export const generateWebsiteId = () => generateId('w_');
