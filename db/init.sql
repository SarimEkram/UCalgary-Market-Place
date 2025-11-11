/**TEMPORARY INIT FILE FOR TESTING **/ 
CREATE DATABASE marketplace;
USE marketplace;

CREATE TABLE cats
(
  id              INT unsigned NOT NULL AUTO_INCREMENT, 
  name            VARCHAR(150) NOT NULL,               
  owner           VARCHAR(150) NOT NULL,               
  birth           DATE NOT NULL,                       
  PRIMARY KEY     (id)                                 
);


INSERT INTO cats ( name, owner, birth) VALUES
  ( 'Sandy', 'Lennon', '2015-01-03' ),
  ( 'Cookie', 'Casey', '2013-11-13' ),
  ( 'Charlie', 'River', '2016-05-21' );