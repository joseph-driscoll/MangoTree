-- Fix old "cta" subcategory entries to use "cta-buttons" for consistency
UPDATE generated_content 
SET subcategory = 'cta-buttons' 
WHERE subcategory = 'cta' AND type = 'website';

-- Also fix any other common mismatches that might exist
UPDATE generated_content 
SET subcategory = 'hero' 
WHERE subcategory = 'hero-section' AND type = 'website';

UPDATE generated_content 
SET subcategory = 'about' 
WHERE subcategory = 'about-page' AND type = 'website';

-- Add any other subcategory fixes as needed
UPDATE generated_content 
SET subcategory = 'features' 
WHERE subcategory = 'features-benefits' AND type = 'website';

-- Log the changes
SELECT 
  type,
  subcategory,
  COUNT(*) as count
FROM generated_content 
GROUP BY type, subcategory 
ORDER BY type, subcategory;
