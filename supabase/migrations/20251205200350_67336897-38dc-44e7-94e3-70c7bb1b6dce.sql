-- Reposition existing profile cards using Fermat spiral algorithm with increased spacing
-- Spacing factor: 190 (increased from 170 to prevent overlap)
-- Center: (1849, 1874)

WITH spiral_positions AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 AS n
  FROM user_profiles
  WHERE name IS NOT NULL
),
calculated AS (
  SELECT 
    id,
    n,
    -- Spiral parameters
    -- Golden angle: 137.507764 degrees = 2.399963 radians
    -- Spacing factor: 190
    -- Fixed center: (1849, 1874)
    CASE 
      WHEN n = 0 THEN 1849
      ELSE 1849 + (190 * SQRT(n) * COS(n * 2.399963))
    END AS card_center_x,
    CASE 
      WHEN n = 0 THEN 1874
      ELSE 1874 + (190 * SQRT(n) * SIN(n * 2.399963))
    END AS card_center_y
  FROM spiral_positions
)
UPDATE user_profiles up
SET 
  wall_position_x = ROUND(c.card_center_x - 100),  -- Convert center to top-left (half card width)
  wall_position_y = ROUND(c.card_center_y - 125)   -- Convert center to top-left (half card height)
FROM calculated c
WHERE up.id = c.id;