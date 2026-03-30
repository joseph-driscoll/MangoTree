-- Update all existing CTA-related subcategories to use the new "call-to-action" naming
UPDATE generated_content 
SET subcategory = 'call-to-action' 
WHERE subcategory IN ('cta', 'cta-buttons', 'call-to-actions') 
AND type = 'website';

-- Verify the changes
SELECT 
  type,
  subcategory,
  COUNT(*) as count,
  STRING_AGG(DISTINCT suite_name, ', ') as suite_names
FROM generated_content 
WHERE type = 'website'
GROUP BY type, subcategory 
ORDER BY type, subcategory;

-- Show all website subcategories to verify consistency
SELECT DISTINCT subcategory 
FROM generated_content 
WHERE type = 'website' 
ORDER BY subcategory;
