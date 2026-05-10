-- referral_balance on users + payout_requests table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS referral_balance numeric(12,2) NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.payout_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount     numeric(12,2) NOT NULL,
  wallet     text NOT NULL,
  status     text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user own payout_requests" ON public.payout_requests
  FOR ALL USING (auth.uid() = user_id);
