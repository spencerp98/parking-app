DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `password` varchar(64) NOT NULL,
  `fname` varchar(64),
  `lname` varchar(64),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;