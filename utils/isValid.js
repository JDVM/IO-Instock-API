// A simple utility function to validate email address
function isValidEmail(email) {
  const regex = /^[\w._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

// A simple utility function to validate US phone number format
function isValidPhoneNumber(phone) {
  const regex = /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/; // matches format like +1 (123) 456-7890
  return regex.test(phone);
}

module.exports = { isValidEmail, isValidPhoneNumber };
