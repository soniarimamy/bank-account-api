export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'super_secret_key_change_this_in_production_2026',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
};

export const authConstants = {
  users: [
    {
      id: 1,
      username: 'admin',
      password: '$2b$10$YourHashedPasswordHere', // admin123 hashé
      role: 'admin',
    },
    {
      id: 2,
      username: 'user',
      password: '$2b$10$YourHashedPasswordHere', // user123 hashé
      role: 'user',
    },
  ],
};