import pkg from 'pg';
const { Pool } = pkg;

const createTables = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('Creating tables...');
    
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_username_unique" UNIQUE("username")
      );
    `);

    // Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "customers" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "cpf" varchar(14) NOT NULL,
        "phone" varchar(20) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "customers_email_unique" UNIQUE("email"),
        CONSTRAINT "customers_cpf_unique" UNIQUE("cpf")
      );
    `);

    // Plans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "plans" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "type" varchar(50) NOT NULL,
        "annual_price" numeric(10,2) NOT NULL,
        "monthly_price" numeric(10,2),
        "adhesion_fee" numeric(10,2) DEFAULT '0' NOT NULL,
        "max_dependents" integer,
        "description" text,
        "features" text[],
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "subscriptions" (
        "id" serial PRIMARY KEY NOT NULL,
        "customer_id" integer NOT NULL,
        "plan_id" integer NOT NULL,
        "payment_method" varchar(50) NOT NULL,
        "payment_status" varchar(50) DEFAULT 'pending' NOT NULL,
        "total_amount" numeric(10,2) NOT NULL,
        "installments" integer DEFAULT 1 NOT NULL,
        "status" varchar(50) DEFAULT 'active' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "expires_at" timestamp
      );
    `);

    // Digital cards table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "digital_cards" (
        "id" serial PRIMARY KEY NOT NULL,
        "subscription_id" integer NOT NULL,
        "card_number" varchar(20) NOT NULL,
        "qr_code" text NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "digital_cards_card_number_unique" UNIQUE("card_number"),
        CONSTRAINT "digital_cards_subscription_id_unique" UNIQUE("subscription_id")
      );
    `);

    // Admin users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "password_hash" varchar(255) NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "admin_users_username_unique" UNIQUE("username"),
        CONSTRAINT "admin_users_email_unique" UNIQUE("email")
      );
    `);

    // WhatsApp conversions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "whatsapp_conversions" (
        "id" serial PRIMARY KEY NOT NULL,
        "phone" varchar(20),
        "name" varchar(255),
        "email" varchar(255),
        "button_type" varchar(50) NOT NULL,
        "plan_name" varchar(255),
        "doctor_name" varchar(255),
        "ip_address" varchar(45),
        "user_agent" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);

    // Insert default plans
    await pool.query(`
      INSERT INTO "plans" ("name", "type", "annual_price", "monthly_price", "adhesion_fee", "max_dependents", "description", "features", "is_active")
      VALUES 
        ('Individual', 'individual', 199.00, 19.90, 50.00, 0, 'Plano individual com cobertura completa', ARRAY['Consultas médicas', 'Exames básicos', 'Farmácia com desconto'], true),
        ('Familiar', 'familiar', 399.00, 39.90, 100.00, 4, 'Plano familiar para até 4 dependentes', ARRAY['Consultas médicas', 'Exames básicos', 'Farmácia com desconto', 'Cobertura familiar'], true),
        ('Empresarial', 'empresarial', 299.00, 29.90, 0.00, 10, 'Plano empresarial com benefícios especiais', ARRAY['Consultas médicas', 'Exames básicos', 'Farmácia com desconto', 'Atendimento prioritário'], true)
      ON CONFLICT DO NOTHING;
    `);

    console.log('Tables created successfully!');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

createTables();
