ALTER TABLE users
ADD COLUMN IF NOT EXISTS username TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_username_unique'
      AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users
    ADD CONSTRAINT users_username_unique UNIQUE (username);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS users_username_idx ON users (username);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Users can read all usernames'
  ) THEN
    CREATE POLICY "Users can read all usernames"
      ON users
      FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Users can update own username'
  ) THEN
    CREATE POLICY "Users can update own username"
      ON users
      FOR UPDATE
      USING (auth.uid() = id);
  END IF;
END $$;
