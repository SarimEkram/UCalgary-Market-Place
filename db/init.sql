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
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- EVENTS (event_id = post_id)
CREATE TABLE event_posts (
    event_id          INT PRIMARY KEY,
    organization_name VARCHAR(255),
    event_date        DATETIME NOT NULL,
    FOREIGN KEY (event_id) REFERENCES posts(post_id)
);

-- MARKET POSTS (market_id = post_id)
CREATE TABLE market_posts (
    market_id      INT PRIMARY KEY,
    item_condition VARCHAR(100),
    FOREIGN KEY (market_id) REFERENCES posts(post_id)
);

-- SAVED POSTS (bookmark)
CREATE TABLE saved_posts (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- CONTACTED SELLER
CREATE TABLE contacted_seller (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- REPORTS BASE
-- report_type: 'user' or 'post'
CREATE TABLE reports (
    report_id   INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,
    report_type ENUM('user','post') NOT NULL,
    reason      TEXT NOT NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id)
);

-- REPORT ABOUT A POST
CREATE TABLE post_report (
    report_id INT PRIMARY KEY,
    post_id   INT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

-- REPORT ABOUT A USER
CREATE TABLE user_report (
    report_id        INT PRIMARY KEY,
    reported_user_id INT NOT NULL,
    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    FOREIGN KEY (reported_user_id) REFERENCES users(user_id)
);

-- ADMIN ACTION LOG
CREATE TABLE admin_actions (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id  INT NOT NULL,
    action    VARCHAR(255) NOT NULL,
    action_timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

-- BANNED USERS (linked to an admin action)
CREATE TABLE banned_users (
    action_id  INT NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    PRIMARY KEY (action_id, user_email),
    FOREIGN KEY (action_id) REFERENCES admin_actions(action_id)
);

-- IMAGES
CREATE TABLE images (
    image_id        INT AUTO_INCREMENT PRIMARY KEY,
    post_id         INT NOT NULL,
    image_text_data LONGBLOB,
    FOREIGN KEY (post_id) REFERENCES posts(post_id)
);


-- CREATE AN EVENT HANDLER which deletes expired verifcication codes every 4 minutes 
CREATE EVENT IF NOT EXISTS expire_codes_event
ON SCHEDULE EVERY 4 MINUTE 
DO
  DELETE FROM verification_codes
  WHERE expiration_date < CURTIME();
  
-- VERIFICATION CODES
CREATE TABLE IF NOT EXISTS verification_codes (
    randomCode VARCHAR(8) PRIMARY KEY,
    expiration_date TIME
);

-- Add index to make checking the expiration_date faster
ALTER TABLE verification_codes 
ADD INDEX (expiration_date);

/** SEED DATA **/

-- USERS
INSERT INTO users (user_id, email, fname, lname, hashed_password) VALUES
(1, 'john.doe@ucalgary.ca',  'John',  'Doe',  'jZae727K08KaOmKSgOaGzww/XVqGr/PKEgIMkjrcbJI='),
(2, 'sarah.lee@ucalgary.ca', 'Sarah', 'Lee',  '7WnZz7mI6aB9cE7qbtbW5EfnLx5VkbmHPZZwEtzGL7g='),
(3, 'mike.chan@ucalgary.ca', 'Mike',  'Chan', 'bBDsWjY2P2N47hH5AcFZ6E+xvVKFx1uKQ8+7iMLP8Wk='),
(4, 'nora.kim@ucalgary.ca',  'Nora',  'Kim',  'GfJzZK2f6FqjO9H5XoM5bz6ANBbA2zO3cMXE3UNgRQI=');

-- ADMINS
INSERT INTO admins (admin_id, email, fname, lname, hashed_password) VALUES
(1, 'alice.morgan@ucalgary.ca', 'Alice', 'Morgan', 'W2g0nlxR0R0wEq3dEUKdZmLQekUUEqkgmcnwcfmDKxY='),
(2, 'david.nguyen@ucalgary.ca', 'David', 'Nguyen', 'V7Oxtb4UpvU0YUpkb9J3cQzU8D5Wspg3L07j1Dlm6yU=');

-- POSTS (market)
INSERT INTO posts (post_id, post_type, postal_code, price, posted_date, name, description, user_id) VALUES
(101, 'market', 'T2N1N4',  45.00, '2025-10-20 00:00:00', 'Linear Algebra Textbook', 'Used but in good condition, includes highlights.', 1),
(102, 'market', 'T3P2A6', 120.00, '2025-10-25 00:00:00', 'Gaming Chair',             'Ergonomic chair used for 3 months.',              2),
(103, 'market', 'T2L2M3',  65.00, '2025-11-01 00:00:00', 'TI-84 Calculator',          'Fully functional graphing calculator.',           3);

-- POSTS (events)
INSERT INTO posts (post_id, post_type, postal_code, price, posted_date, name, description, user_id) VALUES
(201, 'event', 'T2N1N4', 2.00, '2025-10-20 00:00:00', 'SU Event',         'Student Union event', 1),
(202, 'event', 'T3P2A6', NULL, '2025-10-22 00:00:00', 'LOREN Club Night', 'Club social night',   2),
(203, 'event', 'T2L2M3', NULL, '2025-10-15 00:00:00', 'FSC Meetup',       'FSC general meeting', 3);

-- EVENT DETAILS
INSERT INTO event_posts (event_id, organization_name, event_date) VALUES
(201, 'Student Union', '2025-10-29 19:00:00'),
(202, 'LOREN Club',    '2025-10-31 18:00:00'),
(203, 'FSC',           '2025-10-22 17:30:00');

-- MARKET DETAILS
INSERT INTO market_posts (market_id, item_condition) VALUES
(101, 'New'),
(102, 'New'),
(103, 'Good');

-- IMAGES (all must reference existing post_ids)
INSERT INTO images (image_id, post_id, image_text_data) VALUES
(401, 101, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/linear_algebra_book.jpg')),
(402, 102, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/gaming_chair.png')),
(403, 103, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/ti84_calc.png')),
(404, 201, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/study_group_flyer.jpg')),
(405, 202, LOAD_FILE('/docker-entrypoint-initdb.d/seeding_imgs/career_fair_poster.jpg'));

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
(501, 2, 'post', 'Misleading description.'),
(502, 3, 'user', 'User spammed multiple listings.'),
(503, 1, 'post', 'Item sold but not updated.');

INSERT INTO post_report (report_id, post_id) VALUES
(501, 102),
(503, 103);

INSERT INTO user_report (report_id, reported_user_id) VALUES
(502, 2);

-- ADMIN ACTIONS (create actions first, then bans that reference them)
INSERT INTO admin_actions (action_id, admin_id, action, action_timestamp) VALUES
(601, 1, 'Deleted reported post 102',       '2025-11-08 13:00:00'),
(602, 2, 'Banned user kai.lee@ucalgary.ca', '2025-11-08 14:10:00'),
(603, 1, 'Approved new moderator account',  '2025-11-09 10:00:00');

INSERT INTO banned_users (action_id, user_email) VALUES
(601, 'kai.lee@ucalgary.ca');

--  VERIFICATION CODES ( insert some sample data, which will expire in 5 minutes ) 
INSERT INTO verification_codes (randomCode, expiration_date) VALUES
(  UPPER(LEFT( UUID(), 8)), DATE_ADD(CURTIME(), INTERVAL 5 MINUTE) ); 

INSERT INTO verification_codes (randomCode, expiration_date) VALUES
( UPPER(LEFT( UUID(), 8)) , DATE_ADD(CURTIME(), INTERVAL 5 MINUTE) ); 