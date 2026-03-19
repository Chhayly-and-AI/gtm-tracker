-- db/setup.sql

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  phase INT NOT NULL CHECK (phase BETWEEN 0 AND 3),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  sort_order INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  store_name TEXT,
  source TEXT,
  contact TEXT,
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','replied','call_scheduled','onboarding','active','paying','churned')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Metrics table
CREATE TABLE IF NOT EXISTS metrics (
  id SERIAL PRIMARY KEY,
  week INT NOT NULL CHECK (week BETWEEN 1 AND 8),
  metric_name TEXT NOT NULL
    CHECK (metric_name IN ('dms_sent','replies','conversations','posts','upwork_proposals','inbound_leads')),
  value INT NOT NULL DEFAULT 0,
  logged_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (week, metric_name)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed Phase 0 tasks (14 items)
INSERT INTO tasks (phase, title, sort_order) VALUES
(0, 'Deploy DataConcierge to Vercel', 1),
(0, 'Set up Neon DB + load example client', 2),
(0, 'Buy domain and point to Vercel', 3),
(0, 'Record 60-90s demo video', 4),
(0, 'Rewrite LinkedIn headline + summary', 5),
(0, 'Set up Upwork profile + gig', 6),
(0, 'Write LinkedIn launch post', 7),
(0, 'Build landing page with demo video + email form', 8),
(0, 'Set up inbound auto-reply', 9),
(0, 'Add "How we handle your data" section to landing page', 10),
(0, 'Join 3-5 communities', 11),
(0, 'Publish LinkedIn launch post', 12),
(0, 'Set up CRM spreadsheet', 13),
(0, 'Create Fiverr gig (optional)', 14);

-- Seed Phase 1 tasks (5 items)
INSERT INTO tasks (phase, title, sort_order) VALUES
(1, 'Send 15+ DMs per week (3 weeks running)', 1),
(1, 'Publish 2+ LinkedIn posts per week', 2),
(1, 'Leave 10+ community comments per week', 3),
(1, 'Reach 3+ conversations (Week 3 checkpoint)', 4),
(1, 'Convert 3-5 interested leads', 5);

-- Seed Phase 2 tasks (5 items)
INSERT INTO tasks (phase, title, sort_order) VALUES
(2, 'Onboard 3-5 pilot clients with real data', 1),
(2, 'Configure dashboard + suggested questions per client', 2),
(2, 'Collect first round of feedback', 3),
(2, 'Document "aha moment" per client', 4),
(2, 'Have Day 14 pricing conversation with each client', 5);

-- Seed Phase 3 tasks (4 items)
INSERT INTO tasks (phase, title, sort_order) VALUES
(3, 'Review usage data for all pilot clients', 1),
(3, 'Complete feedback calls with each client', 2),
(3, 'Score validation scorecard', 3),
(3, 'Make go/no-go decision', 4);
