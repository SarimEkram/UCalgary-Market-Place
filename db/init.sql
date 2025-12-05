/** DATABASE CREATION **/
DROP DATABASE IF EXISTS marketplace;
CREATE DATABASE marketplace;
USE marketplace;

-- turn on event scheduler
SET GLOBAL event_scheduler = ON;

/** TABLES **/
-- USERS
CREATE TABLE users (
               user_id         INT AUTO_INCREMENT PRIMARY KEY,
               email           VARCHAR(255) NOT NULL UNIQUE,
               fname           VARCHAR(100) NOT NULL,
               lname           VARCHAR(100) NOT NULL,
               hashed_password VARCHAR(255) NOT NULL
);

-- ADMINS
CREATE TABLE admins (
                admin_id        INT AUTO_INCREMENT PRIMARY KEY,
                email           VARCHAR(255) NOT NULL UNIQUE,
                fname           VARCHAR(100) NOT NULL,
                lname           VARCHAR(100) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL
);

-- POSTS (parent of events + market_posts)
-- post_type: 'event' or 'market'
CREATE TABLE posts (
               post_id     INT AUTO_INCREMENT PRIMARY KEY,
               user_id     INT NOT NULL,
               post_type   ENUM('event','market') NOT NULL,
               postal_code VARCHAR(20),
               price       DECIMAL(10,2),
               posted_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
               name        VARCHAR(255) NOT NULL,
               description TEXT,
               FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- EVENTS (event_id = post_id)
CREATE TABLE event_posts (
                 event_id          INT PRIMARY KEY,
                 organization_name VARCHAR(255),
                 event_start       DATETIME NOT NULL,
                 event_end         DATETIME NOT NULL,
                 FOREIGN KEY (event_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- MARKET POSTS (market_id = post_id)
CREATE TABLE market_posts (
                  market_id      INT PRIMARY KEY,
                  item_condition VARCHAR(100),
                  FOREIGN KEY (market_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- SAVED POSTS (bookmark)
CREATE TABLE saved_posts (
                 user_id INT NOT NULL,
                 post_id INT NOT NULL,
                 PRIMARY KEY (user_id, post_id),
                 FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                 FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- CONTACTED SELLER
CREATE TABLE contacted_seller (
                  user_id INT NOT NULL,
                  post_id INT NOT NULL,
                  contacted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  PRIMARY KEY (user_id, post_id),
                  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                  FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- REPORTS BASE
-- report_type: 'user' or 'post'
CREATE TABLE reports (
                 report_id   INT AUTO_INCREMENT PRIMARY KEY,
                 reporter_id INT NOT NULL,
                 report_type ENUM('user','post') NOT NULL,
                 reason      TEXT NOT NULL,
                 FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- REPORT ABOUT A POST
CREATE TABLE post_report (
                 report_id INT PRIMARY KEY,
                 post_id   INT NOT NULL,
                 FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE,
                 FOREIGN KEY (post_id)   REFERENCES posts(post_id) ON DELETE CASCADE
);

-- REPORT ABOUT A USER
CREATE TABLE user_report (
                 report_id  INT PRIMARY KEY,
                 reported_user_id INT NOT NULL,
                 FOREIGN KEY (report_id)  REFERENCES reports(report_id) ON DELETE CASCADE,
                 FOREIGN KEY (reported_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ADMIN ACTION LOG
CREATE TABLE admin_actions (
                   action_id INT AUTO_INCREMENT PRIMARY KEY,
                   admin_id  INT NOT NULL,
                   action    VARCHAR(255) NOT NULL,
                   action_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                   FOREIGN KEY (admin_id) REFERENCES admins(admin_id) ON DELETE CASCADE
);

-- BANNED USERS (linked to an admin action)
CREATE TABLE banned_users (
                  action_id  INT NOT NULL,
                  user_email VARCHAR(255) NOT NULL,
                  PRIMARY KEY (action_id, user_email),
                  FOREIGN KEY (action_id) REFERENCES admin_actions(action_id) ON DELETE CASCADE
);

-- IMAGES
CREATE TABLE images (
                    image_id        INT AUTO_INCREMENT PRIMARY KEY,
                    post_id         INT NOT NULL,
                    image_text_data LONGBLOB,
                    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- VERIFICATION CODES
CREATE TABLE IF NOT EXISTS verification_codes (
                    randomCode VARCHAR(8) PRIMARY KEY,
                    expiration_date TIME,
                    INDEX idx_expiration_date (expiration_date)
    );

-- CREATE AN EVENT HANDLER which deletes expired verification codes every 4 minutes
CREATE EVENT IF NOT EXISTS expire_codes_event
ON SCHEDULE EVERY 5 MINUTE
DO
    DELETE FROM verification_codes
    WHERE expiration_date < CURTIME();

/** SEED DATA **/

-- USERS
-- All seeded users and admins have password A!123456
INSERT INTO users (user_id, email, fname, lname, hashed_password) VALUES
(1, 'mike.wazowski@ucalgary.ca',  'Mike',  'Wazowski',  '$2b$10$45.nJod8kUsqyBpgntgGrOo4SkjRFwaB8dmQVtIaPS.t16UdIX8oa'),
(2, 'chicken.little@ucalgary.ca', 'Chicken', 'Little',  '$2b$10$ALvZTIKPiGn5eGxJ9ai5.Od/F2SN7mKoLi6DSXsu.ASIN4qsBtFiS'),
(3, 'buzz.lightyear@ucalgary.ca', 'Buzz',  'Lightyear', '$2b$10$5Vuzln9Thoyts5B5gXbgb.dbB.xjDWV8Z579KpRUXK3Zd3ya.DpGC'),
(4, 'mary.poppins@ucalgary.ca',  'Mary',  'Poppins',  '$2b$10$a7o3wLmv74qWTf5Hw/XWPeDxMCaRIIRr8BsVzk85XR2kZL12UXelK');

-- ADMINS
INSERT INTO admins (admin_id, email, fname, lname, hashed_password) VALUES
(1, 'daffy.duck@ucalgary.ca', 'Daffy', 'Duck', '$2b$10$e9bZL94pm8QqYrFWVt0YPO.qAT.OCbBfhHFaELhrgQrbt7ZpK00lC'),
(2, 'pink.panther@ucalgary.ca', 'Pink', 'Panther', '$2b$10$J8qa7ZgriqJnhCNNVL7Gju0i/SnXcpuM2U0p25C.WXSoDkLNG/U3O');


-- POSTS (market + events)
INSERT INTO posts (post_id, post_type, postal_code, price, posted_date, name, description, user_id) VALUES
-- USER 1 (John Doe) – MARKET (3 Posts)
(101, 'market', 'T2N1N4',  45.00, '2025-10-20 00:00:00',
 'Linear Algebra Textbook',
 'Used textbook in good condition, includes highlights.',
 1),
(104, 'market', 'T2N1N4', 150.00, '2025-11-05 00:00:00',
 'Study Desk with Bookshelf',
 'Sturdy study desk with attached bookshelf, perfect for textbooks and study equipment.',
 1),
(105, 'market', 'T2N1N4',  30.00, '2025-11-10 00:00:00',
 'Physics Tutor Sessions',
 'Upper-year student offering 1:1 physics tutor sessions for first-year physics.',
 1),

-- USER 2 (Sarah Lee) – MARKET (3 Posts)
(102, 'market', 'T3P2A6', 120.00, '2025-10-25 00:00:00',
 'Gaming Chair',
 'Ergonomic gaming chair used for 3 months.',
 2),
(106, 'market', 'T3P2A6',  80.00, '2025-11-02 00:00:00',
 'Economics Textbook',
 'Textbook for ECON 201, minor wear on cover but pages intact.',
 2),
(107, 'market', 'T3P2A6', 400.00, '2025-11-15 00:00:00',
 'Home Gym Equipment Set',
 'Set of dumbbells and workout equipment, great for residence gyms.',
 2),

-- USER 3 (Mike Chan) – MARKET (3 Posts)
(103, 'market', 'T2L2M3',  65.00, '2025-11-01 00:00:00',
 'TI-84 Calculator',
 'Fully functional graphing calculator, ideal for exams.',
 3),
(108, 'market', 'T2L2M3', 260.00, '2025-11-18 00:00:00',
 'Adjustable Standing Desk',
 'Sit-stand desk, fits dual monitors and stacks of textbooks.',
 3),
(109, 'market', 'T2L2M3',  25.00, '2025-11-19 00:00:00',
 'Chemistry Tutor, 1 on 1',
 'Chemistry tutor sessions for CHEM 201/203, flexible hours.',
 3),

-- USER 4 (Nora Kim) – MARKET (3 Posts)
(110, 'market', 'T2P1K4', 120.00, '2025-11-03 00:00:00',
 'Computer Science Textbook',
 'CS textbook for algorithms and data structures.',
 4),
(111, 'market', 'T2P1K4',  95.00, '2025-11-07 00:00:00',
 'Photography Equipment Rental',
 'Short-term rental of DSLR photography equipment for projects.',
 4),
(112, 'market', 'T2P1K4', 650.00, '2025-11-22 00:00:00',
 'Lab Equipment, Microscope',
 'High-quality lab microscope with additional lenses and supporting equipment.',
 4),

-- USER 1 (John Doe) – EVENTS (3 Posts)
(201, 'event', 'T2N1N4',   2.00, '2025-10-20 00:00:00',
 'SU Event',
 'Student Union event with games and snacks.',
 1),
(204, 'event', 'T2N1N4',  0, '2025-11-05 00:00:00',
 'Math Review Night',
 'Free group review session for the upcoming Calculus midterm.',
 1),
(205, 'event', 'T2N1N4',   5.00, '2025-11-10 00:00:00',
 'Exam De-Stress Games Night',
 'Board games and snacks hosted by the SU before finals.',
 1),

-- USER 2 (Sarah Lee) – EVENTS (3 Posts)
(202, 'event', 'T3P2A6',  0, '2025-10-22 00:00:00',
 'LOREN Club Night',
 'Club social night with music and food.',
 2),
(206, 'event', 'T3P2A6',  10.00, '2025-11-08 00:00:00',
 'LOREN Networking Mixer',
 'Networking mixer with club alumni and industry guests.',
 2),
(207, 'event', 'T3P2A6',  0, '2025-11-25 00:00:00',
 'Tutor Match-Up Fair',
 'Meet volunteer tutors for various first-year subjects.',
 2),

-- USER 3 (Mike Chan) – EVENTS (3 Posts)
(203, 'event', 'T2L2M3',  0, '2025-10-15 00:00:00',
 'FSC Meetup',
 'FSC general meeting and introductions.',
 3),
(208, 'event', 'T2L2M3',   3.00, '2025-11-12 00:00:00',
 'FSC Study Hall',
 'Quiet evening study hall with light snacks.',
 3),
(209, 'event', 'T2L2M3',  15.00, '2025-11-28 00:00:00',
 'CSC Lab Skills Workshop',
 'Hands-on workshop practicing basic lab equipment skills.',
 3),

-- USER 4 (Nora Kim) – EVENTS (3 Posts)
(210, 'event', 'T2P1K4',  0, '2025-11-01 00:00:00',
 'Hackathon Weekend',
 '48-hour on-campus hackathon hosted by CSUS.',
 4),
(211, 'event', 'T2P1K4',  12.00, '2025-11-16 00:00:00',
 'Photography Workshop',
 'Photography club workshop covering camera basics and shooting tips.',
 4),
(212, 'event', 'T2P1K4',  0, '2025-11-30 00:00:00',
 'Algorithms Group Study',
 'Open study group for the algorithms course final exam.',
 4);

-- EVENT DETAILS
INSERT INTO event_posts (event_id, organization_name, event_start, event_end) VALUES
(201, 'Student Union',
 '2025-10-29 19:00:00', '2025-10-29 22:00:00'),
(202, 'LOREN Club',
 '2025-10-31 18:00:00', '2025-11-01 01:00:00'),
(203, 'FSC',
 '2025-10-22 17:30:00', '2025-10-22 19:00:00'),
(204, 'Math Help Centre',
 '2025-11-06 18:00:00', '2025-11-06 21:00:00'),
(205, 'Student Union',
 '2025-12-10 19:00:00', '2025-12-10 23:00:00'),
(206, 'LOREN Club',
 '2025-11-10 17:30:00', '2025-11-10 20:30:00'),
(207, 'LOREN Club',
 '2025-11-26 16:00:00', '2025-11-26 18:00:00'),
(208, 'FSC',
 '2025-11-15 16:00:00', '2025-11-15 19:00:00'),
(209, 'CSC',
 '2025-11-29 10:00:00', '2025-11-29 13:00:00'),
(210, 'CSUS',
 '2025-11-02 09:00:00', '2025-11-02 21:00:00'),
(211, 'Photography Club',
 '2025-11-17 13:00:00', '2025-11-17 17:00:00'),
(212, 'CSUS',
 '2025-12-01 18:00:00', '2025-12-01 21:00:00');



-- MARKET DETAILS
INSERT INTO market_posts (market_id, item_condition) VALUES
(101, 'New'),
(102, 'New'),
(103, 'Good'),
(104, 'Good'),
(105, 'New'),
(106, 'Good'),
(107, 'Fair'),
(108, 'New'),
(109, 'Good'),
(110, 'Fair'),
(111, 'Good'),
(112, 'New');


-- IMAGES (all must reference existing post_ids)
INSERT INTO images (image_id, post_id, image_text_data) VALUES
(401, 101, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/linear_algebra_book.jpg')),
(402, 102, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/gaming_chair.png')),
(403, 103, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/ti84_calc.png')),
(404, 103, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/ti84-img2.jpg')),
(405, 201, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/study_group_flyer.jpg')),
(406, 202, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/career_fair_poster.jpg')),
(407, 104, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/desk-with-bookshelf.jpg')),
(408, 105, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/Physics-tutor.png')),
(409, 106, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/economic-textbook.png')),
(410, 107, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/gym-equipment.png')),
(411, 108, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/standing-desk-1.jpg')),
(412, 108, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/standing-desk-2.jpg')),
(413, 109, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/chem-tutor-poster.png')),
(414, 110, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/Computer Science Textbook.jpg')),
(415, 111, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/photography-equip.jpg')),
(416, 111, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/photography-equip-2.jpg')),
(417, 112, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/microscope.jpg')),
(418, 203, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/FSC-event.png')),
(419, 204, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/math-review-event.png')),
(420, 205, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/Exam-de-stress-games.jpg')),
(421, 206, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/LOREN-networking.jpg')),
(422, 207, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/tutor-match-up.png')),
(423, 208, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/FSC Study Hall.jpg')),
(424, 209, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/CSC-lab-skills.jpg')),
(425, 210, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/CSUS Hackathon.jpg')),
(426, 211, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/photography-workshop.jpg')),
(427, 212, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/data-structures-group-study.jpg'));

-- SAVED POSTS
INSERT INTO saved_posts (user_id, post_id) VALUES
(1, 102),
(2, 103),
(3, 101);

-- CONTACTED SELLER
INSERT INTO contacted_seller (user_id, post_id) VALUES
(1, 103),
(3, 102);

-- REPORTS
INSERT INTO reports (report_id, reporter_id, report_type, reason) VALUES
(501, 2, 'post', 'Inappropriate'),
(502, 3, 'user', 'Criminal Behavior'),
(503, 1, 'post', 'Scam');

INSERT INTO post_report (report_id, post_id) VALUES
(501, 102),
(503, 103);

INSERT INTO user_report (report_id, reported_user_id) VALUES
(502, 2);

-- ADMIN ACTIONS (create actions first, then bans that reference them)
INSERT INTO admin_actions (action_id, admin_id, action, action_timestamp) VALUES
(601, 1, 'Deleted a market post "Flying Car" for kai.lee@ucalgary.ca', '2025-11-08 13:00:00'),
(602, 2, 'Deleted an event post "The Annual Upside-Down Umbrella Parade" for kai.lee@ucalgary.ca', '2025-11-08 14:20:00'),
(603, 1, 'Banned user: kai.lee@ucalgary.ca', '2025-11-08 14:10:00');

INSERT INTO banned_users (action_id, user_email) VALUES
(601, 'kai.lee@ucalgary.ca');

--  VERIFICATION CODES ( insert some sample data, which will expire in 5 minutes ) 
INSERT INTO verification_codes (randomCode, expiration_date) VALUES
(  UPPER(LEFT( UUID(), 8)), DATE_ADD(CURTIME(), INTERVAL 5 MINUTE) ); 

INSERT INTO verification_codes (randomCode, expiration_date) VALUES
( UPPER(LEFT( UUID(), 8)) , DATE_ADD(CURTIME(), INTERVAL 5 MINUTE) ); 