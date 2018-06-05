DROP TABLE IF EXISTS `parkingSpot`;
DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `password` char(60) NOT NULL,
  `fname` varchar(64),
  `lname` varchar(64),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE `parkingSpot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64),
  `latitude` varchar(10),
  `longitude` varchar(10),
  `favorite` bit(1),
  `date` datetime,
  `description` varchar(255),
  `picture` varchar(255),
  PRIMARY KEY (`id`),
	FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;