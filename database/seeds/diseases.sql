-- Seed data for diseases
INSERT INTO diseases (name, description, severity, precautions, common_symptoms) VALUES
(
    'Common Cold',
    'A viral infection of the upper respiratory tract',
    'mild',
    '["Get plenty of rest", "Stay hydrated", "Use over-the-counter cold medications", "Avoid close contact with others"]',
    '[1, 2, 3, 4, 5, 6]'
),
(
    'Flu (Influenza)',
    'A contagious respiratory illness caused by influenza viruses',
    'moderate',
    '["Get plenty of rest", "Stay home to avoid spreading", "Take antiviral medication if prescribed", "Keep warm and hydrated"]',
    '[1, 2, 3, 4, 6, 7, 14]'
),
(
    'COVID-19',
    'An infectious disease caused by the SARS-CoV-2 virus',
    'moderate',
    '["Self-isolate immediately", "Get tested for confirmation", "Monitor oxygen levels", "Wear a mask around others"]',
    '[1, 2, 3, 8, 12, 13]'
),
(
    'Gastroenteritis',
    'Inflammation of the digestive tract causing diarrhea and vomiting',
    'moderate',
    '["Stay hydrated with clear fluids", "Eat bland foods (BRAT diet)", "Wash hands frequently", "Rest and avoid solid foods initially"]',
    '[10, 11, 12, 3]'
),
(
    'Migraine',
    'A neurological condition causing severe headaches',
    'moderate',
    '["Rest in a dark, quiet room", "Apply cold compress to forehead", "Take prescribed migraine medication", "Avoid triggers (bright lights, loud sounds)"]',
    '[4, 3, 10]'
)
ON CONFLICT (name) DO NOTHING;
