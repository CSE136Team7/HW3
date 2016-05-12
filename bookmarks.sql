DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `folders`;
DROP TABLE IF EXISTS `folder_has_books`;

CREATE TABLE `users` (
`username` varchar(30) NOT NULL UNIQUE,
`passhash` varchar(32) NOT NULL,
`user_ID` int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`user_ID`)
);

CREATE TABLE `books` (
`Title` varchar(16) NOT NULL,
`Star` boolean NOT NULL,
`Description` varchar(180),
`URL` varchar(256) NOT NULL,
`user_ID` int NOT NULL,
`book_ID` int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`book_ID`),
FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
);

CREATE TABLE `folders` (
`Name` varchar(16) NOT NULL,
`user_ID` int NOT NULL,
`folder_ID` int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`folder_ID`),
FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
);

CREATE TABLE `folder_has_books` (
`folder_ID` int NOT NULL,
`book_ID` int NOT NULL,
FOREIGN KEY (`folder_ID`) REFERENCES `folders` (`folder_ID`) ON DELETE CASCADE,
FOREIGN KEY (`book_ID`) REFERENCES `books` (`book_ID`) ON DELETE CASCADE
);
