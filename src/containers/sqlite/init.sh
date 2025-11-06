#!/bin/sh
echo "Setting up database..."

sqlite3 /data/users.db <<EOF
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  twofa_method TEXT DEFAULT NULL,
  password_hash TEXT NOT NULL,
  settings JSON DEFAULT '{}',
  blocked JSON DEFAULT '{}',
  experience_point REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT 1,
  created_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS room_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  role TEXT DEFAULT 'member',
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_matches (
  user_id INTEGER PRIMARY KEY,
  match_won INTEGER DEFAULT 0,
  match_played INTEGER DEFAULT 0,
  history JSON DEFAULT '{}',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tmp_2fa_codes (
  user_id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS totp_2fa (
  user_id TEXT PRIMARY KEY,
  secret TEXT NOT NULL
);

INSERT OR IGNORE INTO rooms (room_id, name, description, is_public, created_by)
VALUES ('general', 'General Chat', 'Public chat room for everyone', 1, NULL);

CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_room_members_room_id ON room_members(room_id);
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members(user_id);

SELECT 'Users count: ' || COUNT(*) FROM users;
SELECT 'Rooms count: ' || COUNT(*) FROM rooms;
SELECT 'Room members count: ' || COUNT(*) FROM room_members;
SELECT 'Messages count: ' || COUNT(*) FROM messages;
EOF

echo "Database setup complete."

tail -f /dev/null
