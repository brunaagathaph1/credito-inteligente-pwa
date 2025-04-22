
-- Create payment methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_methods
-- Users can view all payment methods
CREATE POLICY "Anyone can view payment methods" 
  ON public.payment_methods FOR SELECT USING (true);

-- Only authenticated users can insert payment methods
CREATE POLICY "Authenticated users can insert payment methods" 
  ON public.payment_methods FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update payment methods
CREATE POLICY "Authenticated users can update payment methods" 
  ON public.payment_methods FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated users can delete payment methods
CREATE POLICY "Authenticated users can delete payment methods" 
  ON public.payment_methods FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default payment methods
INSERT INTO public.payment_methods (name, description, is_active)
VALUES 
  ('Dinheiro', 'Pagamento em espécie', true),
  ('PIX', 'Transferência via PIX', true),
  ('Cartão de Crédito', 'Pagamento via cartão de crédito', true),
  ('Cartão de Débito', 'Pagamento via cartão de débito', true),
  ('Transferência Bancária', 'Transferência entre contas', true)
ON CONFLICT (id) DO NOTHING;

-- Add reference to payment methods in payments/transactions table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES public.payment_methods(id);
  END IF;
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'transactions') THEN
    ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS payment_method_id UUID REFERENCES public.payment_methods(id);
  END IF;
END
$$;

-- Create an index on the payment_methods name for faster lookups
CREATE INDEX IF NOT EXISTS idx_payment_methods_name ON public.payment_methods(name);
