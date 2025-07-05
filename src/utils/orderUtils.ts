
// Generate a professional order number format (ORD-ABC123DEF456)
export const generateOrderNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ORD-';
  
  // Add 3 characters
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * 26)); // Letters only for first 3
  }
  
  // Add 3 numbers
  for (let i = 0; i < 3; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  // Add 3 more characters
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * 26)); // Letters only
  }
  
  // Add 3 more numbers
  for (let i = 0; i < 3; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  return result;
};
