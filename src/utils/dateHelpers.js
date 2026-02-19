export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const isUpcoming = (date, time) => {
  const dt = new Date(`${date}T${time}`);
  return dt.getTime() > Date.now();
};

export const isPast = (date, time) => {
  return !isUpcoming(date, time);
};

export const isToday = (dateStr) => {
  const today = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

export const isDueSoon = (date, time) => {
  const dt = new Date(`${date}T${time}`);
  const now = Date.now();
  const in24Hours = now + 24 * 60 * 60 * 1000;
  return dt.getTime() > now && dt.getTime() <= in24Hours;
};

export const getNowDateString = () => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const getNowTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const getCreatedAt = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};
