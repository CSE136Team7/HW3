DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `folders`;
DROP TABLE IF EXISTS `folder_has_books`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `analytics`;

CREATE TABLE `users` (
`username` varchar(30) NOT NULL UNIQUE,
`passhash` varchar(32) NOT NULL,
`user_ID` int UNIQUE NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`user_ID`)
);

CREATE TABLE `books` (
`Title` varchar(16) NOT NULL,
`Star` boolean NOT NULL,
`Description` varchar(180),
`URL` varchar(256) NOT NULL,
`Clicks` int DEFAULT 0,
`user_ID` int NOT NULL,
`book_ID` int UNIQUE NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`book_ID`),
FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
);

CREATE TABLE `folders` (
`Name` varchar(16) NOT NULL,
`user_ID` int NOT NULL,
`folder_ID` int UNIQUE NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`folder_ID`),
FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
);

CREATE TABLE `folder_has_books` (
`folder_ID` int NOT NULL,
`book_ID` int NOT NULL,
FOREIGN KEY (`folder_ID`) REFERENCES `folders` (`folder_ID`) ON DELETE CASCADE,
FOREIGN KEY (`book_ID`) REFERENCES `books` (`book_ID`) ON DELETE CASCADE
);

CREATE TABLE `analytics` (

  `Clicks` int DEFAULT 0,
  `BooksCreated` int DEFAULT 0,
  `FoldersCreated` int DEFAULT 0,
  `LoggedIn` int DEFAULT 0,
  `user_ID` int NOT NULL,
  `anal_ID` int UNIQUE NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`anal_ID`),
  FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
);

CREATE TABLE `sessions` (
`session` varchar(128),
`session_ID` int UNIQUE NOT NULL AUTO_INCREMENT,
PRIMARY KEY (`session_ID`)
);

CREATE TABLE `user_has_sessions` (
`user_ID` int NOT NULL,
`session_ID` int NOT NULL,
FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE,
FOREIGN KEY (`session_ID`) REFERENCES `sessions` (`session_ID`) ON DELETE CASCADE
);









#Dummy data to test with
INSERT INTO `users` SET `username`='test_username', `passhash`='RBX123';
INSERT INTO `books` SET `Title`='test_books', `Star`=0, `Description`='optional', `URL`='www.google.com', `user_ID`=1;
INSERT INTO `folders` SET `Name`='test_folders', `user_ID`='1';
INSERT INTO `folder_has_books` SET `folder_ID`='1',`book_ID` ='1';


#INSERT INTO folders SET Name='', user_ID='';
#joe
-- 
-- INSERT INTO `folders` SET `Name`='Fun', `user_ID`='3';
-- INSERT INTO `folders` SET `Name`='Shop', `user_ID`='3';
-- INSERT INTO `folders` SET `Name`='Search', `user_ID`='3';
-- #mark
-- INSERT INTO `folders` SET `Name`='School', `user_ID`='4';
-- INSERT INTO `folders` SET `Name`='Movies', `user_ID`='4';
-- #jane
-- INSERT INTO `folders` SET `Name`='Work', `user_ID`='5';
-- #sally
-- INSERT INTO `folders` SET `Name`='Surfing', `user_ID`='6';
-- INSERT INTO `folders` SET `Name`='Tech', `user_ID`='6';
-- INSERT INTO `folders` SET `Name`='Secret', `user_ID`='6';
-- INSERT INTO `folders` SET `Name`='Social', `user_ID`='6';
-- INSERT INTO `folders` SET `Name`='Imp', `user_ID`='6';
-- INSERT INTO `folders` SET `Name`='Secret2', `user_ID`='6';
--
-- # books 25 - 27
-- # folders 8 - 13
--
-- INSERT INTO `folder_has_books` SET `folder_ID`=8, `book_ID`=25;
-- INSERT INTO `folder_has_books` SET `folder_ID`=10, `book_ID`=26;
-- INSERT INTO `folder_has_books` SET `folder_ID`=11, `book_ID`=26;
-- INSERT INTO `folder_has_books` SET `folder_ID`=13, `book_ID`=25;
-- INSERT INTO `folder_has_books` SET `folder_ID`=8, `book_ID`=26;
-- INSERT INTO `folder_has_books` SET `folder_ID`=9, `book_ID`=25;
-- INSERT INTO `folder_has_books` SET `folder_ID`=8, `book_ID`=27;
