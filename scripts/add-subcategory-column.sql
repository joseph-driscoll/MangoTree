-- Add subcategory column to generated_content table
ALTER TABLE generated_content 
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_generated_content_subcategory 
ON generated_content(subcategory);

-- Update existing records to have a default subcategory based on type
UPDATE generated_content 
SET subcategory = CASE 
  WHEN type = 'website' THEN 'hero'
  WHEN type = 'email' THEN 'promotional'
  WHEN type = 'social' THEN 'posts'
  WHEN type = 'messages' THEN 'welcome'
  WHEN type = 'listings' THEN 'product'
  WHEN type = 'reviews' THEN 'positive'
  WHEN type = 'blog' THEN 'how-to'
  ELSE 'general'
END
WHERE subcategory IS NULL;
