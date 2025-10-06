-- Seed data for symptoms
INSERT INTO symptoms (name, description, severity_level, category) VALUES
('Fever', 'Elevated body temperature above normal', 3, 'general'),
('Cough', 'Sudden expulsion of air from lungs', 2, 'respiratory'),
('Fatigue', 'Extreme tiredness or lack of energy', 2, 'general'),
('Headache', 'Pain in the head or upper neck', 2, 'neurological'),
('Sore Throat', 'Pain or irritation in the throat', 2, 'respiratory'),
('Runny Nose', 'Excess drainage from the nose', 1, 'respiratory'),
('Body Ache', 'Generalized muscle or body pain', 2, 'musculoskeletal'),
('Difficulty Breathing', 'Trouble breathing or shortness of breath', 4, 'respiratory'),
('Chest Pain', 'Discomfort or pain in the chest area', 4, 'cardiovascular'),
('Nausea', 'Feeling of sickness with urge to vomit', 2, 'digestive'),
('Vomiting', 'Forceful expulsion of stomach contents', 3, 'digestive'),
('Diarrhea', 'Frequent loose or watery bowel movements', 3, 'digestive'),
('Loss of Taste', 'Reduced or absent sense of taste', 2, 'sensory'),
('Loss of Smell', 'Reduced or absent sense of smell', 2, 'sensory'),
('Chills', 'Feeling of coldness with shivering', 2, 'general')
ON CONFLICT (name) DO NOTHING;
