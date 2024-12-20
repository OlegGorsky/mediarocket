import { Pool } from 'pg';

const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

export const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255),
        photo_url TEXT,
        points INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id BIGINT REFERENCES users(id),
        referee_id BIGINT REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(referrer_id, referee_id)
      );

      CREATE TABLE IF NOT EXISTS channel_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id),
        channel_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, channel_id)
      );

      CREATE TABLE IF NOT EXISTS promo_codes (
        id SERIAL PRIMARY KEY,
        code VARCHAR(255) UNIQUE,
        points INTEGER,
        is_active BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS promo_code_usage (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id),
        promo_code_id INTEGER REFERENCES promo_codes(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, promo_code_id)
      );
    `);
  } finally {
    client.release();
  }
};

export const db = pool;