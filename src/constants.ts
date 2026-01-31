
// Hardcoded list of authorized admin emails.
// In a production environment, this might be managed via Firebase Custom Claims
// or a secure remote configuration.
export const ADMIN_EMAILS = [
  "admin1@company.com",
  "admin2@company.com",
  "testadmin@example.com"
  // ... up to 10 emails
].map(email => email.toLowerCase());
