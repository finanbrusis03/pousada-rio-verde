-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  size VARCHAR(50),
  beds VARCHAR(100),
  amenities TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  min_nights INTEGER DEFAULT 1 CHECK (min_nights >= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  document VARCHAR(14),
  birth_date DATE,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  checkin_date DATE NOT NULL,
  checkout_date DATE NOT NULL,
  adults INTEGER NOT NULL CHECK (adults > 0),
  children INTEGER DEFAULT 0 CHECK (children >= 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled', 'expired', 'no_show')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('pix', 'credit_card', 'debit_card')),
  payment_id VARCHAR(255),
  cancellation_reason TEXT,
  cancellation_fee DECIMAL(10,2) DEFAULT 0,
  refund_amount DECIMAL(10,2) DEFAULT 0,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  method VARCHAR(20) NOT NULL CHECK (method IN ('pix', 'credit_card', 'debit_card')),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  gateway_response JSONB DEFAULT '{}',
  pix_qr_code TEXT,
  pix_expiration_date TIMESTAMP WITH TIME ZONE,
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blocked_dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_reservations_client_id ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_room_id ON reservations(room_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(checkin_date, checkout_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_room_id ON blocked_dates(room_id);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_dates ON blocked_dates(start_date, end_date);

-- Create Row Level Security (RLS) policies
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own reservations and data
CREATE POLICY "Users can view own data" ON reservations
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can insert own reservations" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own reservations" ON reservations
  FOR UPDATE USING (auth.uid() = client_id);

-- Admin can do everything
CREATE POLICY "Admin full access to reservations" ON reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.email = 'admin@rioverde.com'
    )
  );

-- Similar policies for other tables
CREATE POLICY "Users can view own profile" ON clients
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON clients
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin full access to clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.email = 'admin@rioverde.com'
    )
  );

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Insert sample data
INSERT INTO rooms (id, name, description, capacity, price, size, beds, amenities, features, images, status, min_nights) VALUES
  (uuid_generate_v4(), 'Suíte Vista Mar', 'Nossa acomodação mais exclusiva, com varanda privativa e vista panorâmica para o oceano. Ideal para casais em busca de romance e tranquilidade.', 4, 350.00, '35m²', '1 cama king size', '{"Wi-Fi grátis", "Ar-condicionado", "Café da manhã", "TV Smart", "Banheira", "Vista mar"}', '{"Varanda privativa com rede", "Frigobar abastecido", "Amenities premium", "Roupão e chinelos", "Serviço de quarto"}', '{"https://exemplo.com/suite.jpg"}', 'available', 2),
  (uuid_generate_v4(), 'Chalé Jardim Tropical', 'Chalé independente cercado por exuberante vegetação tropical. Perfeito para famílias ou grupos de amigos que buscam privacidade.', 6, 550.00, '55m²', '2 camas queen size', '{"Wi-Fi grátis", "Ar-condicionado", "Café da manhã", "TV Smart", "Banheiro privativo"}', '{"Área externa privativa", "Churrasqueira", "Cozinha equipada", "Duas suítes", "Estacionamento frontal"}', '{"https://exemplo.com/chalet.jpg"}', 'available', 1),
  (uuid_generate_v4(), 'Quarto Standard Conforto', 'Acomodação aconchegante com todo conforto essencial. Excelente custo-benefício para quem quer aproveitar a estrutura da pousada.', 2, 250.00, '22m²', '1 cama casal', '{"Wi-Fi grátis", "Ar-condicionado", "Café da manhã", "TV"}', '{"Banheiro privativo", "Frigobar", "Roupa de cama premium", "Acesso à piscina"}', '{"https://exemplo.com/standard.jpg"}', 'available', 1);

-- Create admin user (for demo purposes)
INSERT INTO auth.users (id, email, created_at) VALUES 
  (uuid_generate_v4(), 'admin@rioverde.com', NOW());
