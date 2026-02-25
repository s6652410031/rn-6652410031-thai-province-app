-- Sample Data for Uttaradit Province App
-- Run these SQL commands in Supabase SQL Editor to add sample data

-- =============================================
-- SAMPLE DATA: tourist_spots
-- =============================================
INSERT INTO tourist_spots (name, image_url, address, lat, lng) VALUES
('น้ำตกท่าไทย', 'https://www.thai-tourist.com/wp-content/uploads/2019/04/uttaradit-thai-waterfall.jpg', 'ต.ท่าไทย อ.ท่าปลา จ.อุตรดิตถ์', 17.7833, 100.8333),
('ภูเขาหัวผา', 'https://travel.mthai.com/app/uploads/2016/04/huapha.jpg', 'ต.ผาเลือด อ.ท่าปลา จ.อุตรดิตถ์', 17.7500, 100.8500),
('อุทยานแห่งชาติผาเวียนใหญ่', 'https://www.dnp.go.th/parkreserve/asp/picture/pa0032/pa0032_01.jpg', 'ต.น้ำหมา อ.ท่าปลา จ.อุตรดิตถ์', 17.6500, 100.9500),
('พระพุทธชินราช', 'https://www.uttaradit.go.th/public/img_content/1475_1.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6200, 100.1000),
('สวนสมเด็จพระศรีนครินทร์', 'https://www.uttaradit.go.th/public/img_content/1495_1.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6150, 100.0950);

-- =============================================
-- SAMPLE DATA: restaurants
-- =============================================
INSERT INTO restaurants (name, image_url, address, lat, lng, phone) VALUES
('ร้านข้าวต้มปลาท่าปลา', 'https://img.wongnai.com/p/400x0/2021/07/09/14/3e70d4b2c4d74b5aa84dffb0a3e9e7f3.jpg', 'ต.ท่าปลา อ.ท่าปลา จ.อุตรดิตถ์', 17.7500, 100.8500, '055-123-456'),
('ร้านอาหารริมน้ำปิง', 'https://img.wongnai.com/p/400x0/2020/03/12/10/example.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6200, 100.1000, '055-234-567'),
('ร้านสตูลี่ อุตรดิตถ์', 'https://img.wongnai.com/p/400x0/2021/01/15/08/example.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6150, 100.0950, '055-345-678'),
('ร้านเจ๊ใบ อุตรดิตถ์', 'https://img.wongnai.com/p/400x0/2019/05/20/12/example.jpg', 'ต.บ้านด่าน อ.ลับแล จ.อุตรดิตถ์', 17.5500, 100.0500, '055-456-789');

-- =============================================
-- SAMPLE DATA: cafes
-- =============================================
INSERT INTO cafes (name, image_url, address, lat, lng, phone) VALUES
('นาคาเฟ่', 'https://img.kapook.com/img/2022/01/11/naka-cafe-uttaradit-2.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6200, 100.1000, '089-123-4567'),
('เดอะฮอทซาร์ อุตรดิตถ์', 'https://img.kapook.com/img/2021/09/15/the-hotzar-cafe.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6150, 100.0950, '089-234-5678'),
('ริเวอร์ไซด์ คาเฟ่', 'https://img.kapook.com/img/2020/08/20/riverside-cafe-uttaradit.jpg', 'ต.ท่าไทย อ.ท่าปลา จ.อุตรดิตถ์', 17.7800, 100.8300, '089-345-6789');

-- =============================================
-- SAMPLE DATA: temples
-- =============================================
INSERT INTO temples (name, image_url, address, lat, lng) VALUES
('วัดพระศรีรัตนมหาธาตุ', 'https://www.uttaradit.go.th/public/img_content/1475_1.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6200, 100.1000),
('วัดท่าอิฐ', 'https://www.uttaradit.go.th/public/img_content/1505_1.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6180, 100.0980),
('วัดศรีชมภู', 'https://www.uttaradit.go.th/public/img_content/1510_1.jpg', 'ต.สามพวก อ.ท่าปลา จ.อุตรดิตถ์', 17.7600, 100.8700),
('วัดห้วยมุ่น', 'https://www.uttaradit.go.th/public/img_content/1520_1.jpg', 'ต.น้ำหมา อ.ท่าปลา จ.อุตรดิตถ์', 17.6500, 100.9500),
('วัดพระพุทธชินราช', 'https://www.uttaradit.go.th/public/img_content/1475_1.jpg', 'ต.ท่าอิฐ อ.เมืองอุตรดิตถ์ จ.อุตรดิตถ์', 17.6220, 100.1020);

-- =============================================
-- SAMPLE DATA: festivals
-- =============================================
INSERT INTO festivals (name, image_url, festival_date) VALUES
('งานประเพณีสงกรานต์อุตรดิตถ์', 'https://www.uttaradit.go.th/public/img_content/1550_1.jpg', '13-15 เมษายน'),
('งานเทศกาลลอยกระทง', 'https://www.uttaradit.go.th/public/img_content/1555_1.jpg', 'พฤศจิกายน'),
('งานวันแม่แห่งชาติ', 'https://www.uttaradit.go.th/public/img_content/1560_1.jpg', '12 สิงหาคม'),
('งานประจำปีวันพระยาพิชัยดาบหัก', 'https://www.uttaradit.go.th/public/img_content/1565_1.jpg', 'มกราคม');

