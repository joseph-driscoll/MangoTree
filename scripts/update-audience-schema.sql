-- Create audiences table for better normalization
CREATE TABLE IF NOT EXISTS public.content_audiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES public.generated_content(id) ON DELETE CASCADE NOT NULL,
    audience VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.content_audiences ENABLE ROW LEVEL SECURITY;

-- Create RLS policy
CREATE POLICY "Users can manage their content audiences" ON public.content_audiences
    FOR ALL USING (
        content_id IN (
            SELECT id FROM public.generated_content 
            WHERE user_id = auth.uid()
        )
    );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_content_audiences_content_id ON public.content_audiences(content_id);
CREATE INDEX IF NOT EXISTS idx_content_audiences_audience ON public.content_audiences(audience);

-- Migrate existing data (if any exists with JSON arrays)
DO $$
DECLARE
    content_record RECORD;
    audience_item TEXT;
    audience_array TEXT[];
BEGIN
    FOR content_record IN 
        SELECT id, audience 
        FROM public.generated_content 
        WHERE audience IS NOT NULL 
        AND audience != ''
        AND audience != 'null'
    LOOP
        BEGIN
            -- Try to parse as JSON array
            audience_array := ARRAY(SELECT json_array_elements_text(content_record.audience::json));
            
            -- Insert each audience
            FOREACH audience_item IN ARRAY audience_array
            LOOP
                INSERT INTO public.content_audiences (content_id, audience)
                VALUES (content_record.id, trim(audience_item))
                ON CONFLICT DO NOTHING;
            END LOOP;
            
        EXCEPTION WHEN OTHERS THEN
            -- If not JSON, treat as comma-separated string
            audience_array := string_to_array(content_record.audience, ',');
            
            FOREACH audience_item IN ARRAY audience_array
            LOOP
                INSERT INTO public.content_audiences (content_id, audience)
                VALUES (content_record.id, trim(audience_item))
                ON CONFLICT DO NOTHING;
            END LOOP;
        END;
    END LOOP;
END $$;
