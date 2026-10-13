export function parseStay(checkInValue, checkOutValue) {
  const checkIn = new Date(checkInValue);
  const checkOut = new Date(checkOutValue);
  if (!checkInValue || !checkOutValue || Number.isNaN(+checkIn) || Number.isNaN(+checkOut)) {
    const error = new Error('Valid checkIn and checkOut dates are required.');
    error.statusCode = 400; throw error;
  }
  if (checkOut <= checkIn) {
    const error = new Error('checkOut must be after checkIn.');
    error.statusCode = 400; throw error;
  }
  if (checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
    const error = new Error('checkIn cannot be in the past.');
    error.statusCode = 400; throw error;
  }
  const nights = Math.ceil((checkOut - checkIn) / 86400000);
  return { checkIn, checkOut, nights };
}
