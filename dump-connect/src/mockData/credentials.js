// Mock credentials for testing
export const validCredentials = [
  {
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    name: 'John Citizen'
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin Manager'
  },
  {
    email: 'citizen@dumpconnect.com',
    password: 'citizen123',
    role: 'user',
    name: 'Jane Citizen'
  },
  {
    email: 'municipal@dumpconnect.com',
    password: 'municipal123',
    role: 'admin',
    name: 'Municipal Admin'
  }
]

export function validateCredentials(email, password) {
  const user = validCredentials.find(u => u.email === email && u.password === password)
  return user || null
}
