-- Add generated_by column to track which AI model generated the content
ALTER TABLE generated_content 
ADD COLUMN IF NOT EXISTS generated_by TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_generated_content_generated_by 
ON generated_content(generated_by);
