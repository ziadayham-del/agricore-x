-- Migration 009: AI Assistant Tables
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL CHECK (insight_type IN ('agronomy', 'energy', 'fault', 'general')),
    summary TEXT NOT NULL,
    observations JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    confidence NUMERIC(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage conversations for their farms" ON ai_conversations
FOR ALL USING (
    farm_id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid())
);

CREATE POLICY "Users can manage messages for their conversations" ON ai_messages
FOR ALL USING (
    conversation_id IN (
        SELECT id FROM ai_conversations WHERE farm_id IN (
            SELECT farm_id FROM farm_members WHERE user_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can manage insights for their farms" ON ai_insights
FOR ALL USING (
    farm_id IN (SELECT farm_id FROM farm_members WHERE user_id = auth.uid())
);
