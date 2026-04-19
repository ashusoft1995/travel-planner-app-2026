-- ============================================
-- 0. ENSURE COLUMNS EXIST (Self-Healing)
-- ============================================
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS lat NUMERIC;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS lng NUMERIC;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "travelVolumeIndex" INTEGER DEFAULT 0;
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS hotels JSONB DEFAULT '{}';
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS activities JSONB DEFAULT '{}';

-- ============================================
-- 1. SEED USERS (Ensure 3 Users exist)
-- ============================================

-- Ensure Admin ashu (ID 1200) exists
INSERT INTO users (id, username, name, email, password_hash, role, status)
VALUES ('1200', 'ashu', 'Ashenafi Abebe', 'ashenafiabebe@gmail.com', 'Ashu19951', 'admin', 'active')
ON CONFLICT (id) DO UPDATE SET 
  username = EXCLUDED.username,
  role = 'admin', 
  status = 'active';

-- Ensure 1 Agent exists
INSERT INTO users (id, username, name, email, password_hash, role, status)
VALUES ('1201', 'agent_jane', 'Jane Travel Expert', 'jane@ethiotravel.com', 'password123', 'agent', 'active')
ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, role = 'agent';

-- Ensure 1 Traveler exists
INSERT INTO users (id, username, name, email, password_hash, role, status)
VALUES ('1202', 'traveler_bob', 'Bob Explorer', 'bob@gmail.com', 'password123', 'user', 'active')
ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, role = 'user';


-- ============================================
-- 2. SEED 25 DESTINATIONS
-- ============================================

-- Clear existing to avoid duplicates if re-run (optional, or use ON CONFLICT)
DELETE FROM destinations;

INSERT INTO destinations (id, name, region, country, description, "imageUrl", lat, lng, "travelVolumeIndex", hotels, activities)
VALUES 
('1', 'Addis Ababa', 'Addis Ababa', 'Ethiopia', 'Ethiopia''s vibrant capital city, known for its rich history and modern amenities.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', 9.145, 40.4897, 95, '{"Sheraton Addis": {"rating": 4.5, "price": "$$$"}}', '{"City Tour": {"price": "$50"}}'),
('2', 'Lalibela', 'Amhara', 'Ethiopia', 'Ancient city famous for its rock-hewn churches, a UNESCO World Heritage site.', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19', 12.0167, 39.0833, 88, '{"Maribela Hotel": {"rating": 4.2}}', '{"Church Tour": {"price": "$80"}}'),
('3', 'Gondar', 'Amhara', 'Ethiopia', 'Historic city known as the Camelot of Africa, home to medieval castles.', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff', 12.6, 37.4667, 82, '{"Goha Hotel": {"rating": 4.1}}', '{"Castle Tour": {"price": "$45"}}'),
('4', 'Bahir Dar', 'Amhara', 'Ethiopia', 'Beautiful city on Lake Tana, gateway to the Blue Nile Falls.', 'https://images.unsplash.com/photo-1544735716-392fe24b9c6d', 11.6, 37.3833, 79, '{"Kuriftu Resort": {"rating": 4.7}}', '{"Blue Nile Falls": {"price": "$60"}}'),
('5', 'Simien Mountains', 'Amhara', 'Ethiopia', 'UNESCO site offering spectacular scenery and endemic wildlife like the Walia Ibex.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 13.1667, 38.0, 75, '{"Simien Lodge": {"rating": 4.6}}', '{"Trekking": {"price": "$300"}}'),
('6', 'Axum', 'Tigray', 'Ethiopia', 'Ancient capital of the Aksumite Empire, home to giant stelae.', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35', 14.1217, 38.7311, 71, '{"Yeha Hotel": {"rating": 4.0}}', '{"Stelae Field": {"price": "$35"}}'),
('7', 'Hawassa', 'Sidama', 'Ethiopia', 'Relaxing lakeside city known for its beautiful lake and fish market.', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', 7.0583, 38.4758, 68, '{"Haile Resort": {"rating": 4.5}}', '{"Lake Boat": {"price": "$40"}}'),
('8', 'Harar', 'Harari', 'Ethiopia', 'Ancient walled city famous for its unique architecture and hyena feeding.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5', 9.3133, 42.1183, 65, '{"Ras Hotel": {"rating": 4.2}}', '{"Hyena Feeding": {"price": "$25"}}'),
('9', 'Sof Omar Caves', 'Oromia', 'Ethiopia', 'Impressive underground cave system with stunning limestone formations.', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', 6.8833, 42.3833, 58, '{"Sof Omar Lodge": {"rating": 4.1}}', '{"Cave Exploration": {"price": "$50"}}'),
('10', 'Bale Mountains', 'Oromia', 'Ethiopia', 'Vast mountain wilderness with Ethiopian wolves and the Sanetti Plateau.', 'https://images.unsplash.com/photo-1519681393784-d120267933ba', 6.8333, 39.75, 62, '{"Bale Mountain Lodge": {"rating": 4.4}}', '{"Wolf Tracking": {"price": "$120"}}'),
('11', 'Jimma', 'Oromia', 'Ethiopia', 'Major coffee-growing region with lush landscapes and waterfalls.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 7.6667, 36.8333, 56, '{"Jimma Resort": {"rating": 4.3}}', '{"Coffee Tour": {"price": "$45"}}'),
('12', 'Arba Minch', 'Southern Nations', 'Ethiopia', 'Gateway to the Omo Valley, famous for the "Bridge of God" and Lake Chamo.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee', 6.0333, 37.55, 61, '{"Paradise Lodge": {"rating": 4.5}}', '{"Crocodile Market": {"price": "$50"}}'),
('13', 'Ziway', 'Oromia', 'Ethiopia', 'Rift Valley lake known for flamingos and Great White Pelicans.', 'https://images.unsplash.com/photo-1540206395-68808572332f', 7.9333, 38.7167, 54, '{"Haile Resort Ziway": {"rating": 4.3}}', '{"Bird Watching": {"price": "$30"}}'),
('14', 'Mekelle', 'Tigray', 'Ethiopia', 'Capital of Tigray, gateway to the Danakil Depression.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5', 13.4967, 39.4758, 72, '{"Planet Hotel": {"rating": 4.3}}', '{"City Tour": {"price": "$40"}}'),
('15', 'Danakil Depression', 'Afar', 'Ethiopia', 'One of the lowest and hottest places on Earth with surreal salt flats.', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809', 14.2, 40.3, 85, '{"Camping": {"rating": 5.0}}', '{"Volcano Trek": {"price": "$250"}}'),
('16', 'Tiya', 'SNNPR', 'Ethiopia', 'Archeological site containing ancient megalithic stelae.', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 8.4333, 38.6, 50, '{"Local Guesthouse": {"rating": 3.8}}', '{"Stelae Tour": {"price": "$20"}}'),
('17', 'Gambella', 'Gambella', 'Ethiopia', 'Region known for Gambella National Park and Baro River.', 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e', 8.25, 34.5833, 42, '{"Gambella Hotel": {"rating": 3.5}}', '{"Park Safari": {"price": "$60"}}'),
('18', 'Jinka', 'SNNPR', 'Ethiopia', 'Market town and gateway to the Mursi tribal areas in Omo Valley.', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', 5.7833, 36.5667, 55, '{"Eco-Omo Lodge": {"rating": 4.1}}', '{"Mursi Village": {"price": "$70"}}'),
('19', 'Turmi', 'SNNPR', 'Ethiopia', 'Home of the Hamer people, famous for the Bull Jumping ceremony.', 'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4', 4.9667, 36.4833, 58, '{"Buska Lodge": {"rating": 4.3}}', '{"Bull Jumping": {"price": "$100"}}'),
('20', 'Langano', 'Oromia', 'Ethiopia', 'Brown water lake safe for swimming and popular for water sports.', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470', 7.6, 38.7, 63, '{"Sabana Resort": {"rating": 4.4}}', '{"Swimming": {"price": "Free"}}'),
('21', 'Wonchi Crater Lake', 'Oromia', 'Ethiopia', 'Extinct volcano crater containing a beautiful lake and hot springs.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', 8.7833, 37.9, 52, '{"Camping": {"rating": 4.0}}', '{"Horse Riding": {"price": "$30"}}'),
('22', 'Dire Dawa', 'Dire Dawa', 'Ethiopia', 'Industrial and transport hub with French railway influence.', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b', 9.6, 41.8667, 60, '{"Samrat Hotel": {"rating": 3.9}}', '{"Railway Tour": {"price": "$20"}}'),
('23', 'Yabelo', 'Oromia', 'Ethiopia', 'Famous for the Yabelo Wildlife Sanctuary and singing wells.', 'https://images.unsplash.com/photo-1544735716-392fe24b9c6d', 4.8833, 38.0833, 45, '{"Yabelo Motel": {"rating": 3.6}}', '{"Singing Wells": {"price": "$25"}}'),
('24', 'Asosa', 'Benishangul-Gumuz', 'Ethiopia', 'Regional capital near the Blue Nile River and GERD dam.', 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff', 10.0667, 34.5333, 38, '{"Asosa Hotel": {"rating": 3.4}}', '{"River Tour": {"price": "$40"}}'),
('25', 'Semera', 'Afar', 'Ethiopia', 'New capital of Afar, gateway to the northern Danakil route.', 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5', 11.7917, 41.0056, 40, '{"Afar Lodge": {"rating": 3.7}}', '{"Desert Safari": {"price": "$150"}}');
