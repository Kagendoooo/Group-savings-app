  // Format number as Kenyan Shilling (Ksh)
export const formatCurrency = (value) => {
    const formatted = new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 2,
    }).format(value);
    return `Ksh ${formatted}`;
  };
  
  // Format date using en-GB locale (dd/mm/yyyy, 24-hour time)
  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24-hour format
    }).format(date);
  };