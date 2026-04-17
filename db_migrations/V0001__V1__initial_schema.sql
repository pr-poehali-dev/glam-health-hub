
CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'brand', 'salon', 'admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(30),
  city VARCHAR(100),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.brands (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p21218644_glam_health_hub.users(id),
  brand_name VARCHAR(255) NOT NULL,
  description TEXT,
  website VARCHAR(255),
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.salons (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p21218644_glam_health_hub.users(id),
  salon_name VARCHAR(255) NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(30),
  website VARCHAR(255),
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.products (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES t_p21218644_glam_health_hub.brands(id),
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  category VARCHAR(50),
  photo_url TEXT,
  stock INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.programs (
  id SERIAL PRIMARY KEY,
  salon_id INTEGER REFERENCES t_p21218644_glam_health_hub.salons(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  duration VARCHAR(100),
  price NUMERIC(12,2),
  category VARCHAR(50),
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p21218644_glam_health_hub.bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES t_p21218644_glam_health_hub.users(id),
  product_id INTEGER REFERENCES t_p21218644_glam_health_hub.products(id),
  program_id INTEGER REFERENCES t_p21218644_glam_health_hub.programs(id),
  booking_type VARCHAR(20),
  status VARCHAR(20) DEFAULT 'new',
  notes TEXT,
  contact_name VARCHAR(200),
  contact_phone VARCHAR(30),
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON t_p21218644_glam_health_hub.users(email);
CREATE INDEX IF NOT EXISTS idx_products_brand ON t_p21218644_glam_health_hub.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON t_p21218644_glam_health_hub.products(status);
CREATE INDEX IF NOT EXISTS idx_programs_salon ON t_p21218644_glam_health_hub.programs(salon_id);
CREATE INDEX IF NOT EXISTS idx_programs_status ON t_p21218644_glam_health_hub.programs(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON t_p21218644_glam_health_hub.bookings(user_id);
