DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `folders`;
DROP TABLE IF EXISTS `folder_has_books`;
DROP TABLE IF EXISTS `sessions`;

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

#INSERT INTO users SET username='', passhash='';
#user_ID = 2
INSERT INTO `users` SET `username`='bob', `passhash`='IAE123';
#user_ID = 3
INSERT INTO `users` SET `username`='joe', `passhash`='OKD123';
#user_ID = 4
INSERT INTO `users` SET `username`='mark', `passhash`='PVQ123';
#user_ID = 5
INSERT INTO `users` SET `username`='jane', `passhash`='MDX123';
#user_ID = 6
INSERT INTO `users` SET `username`='sally', `passhash`='IJV123';

#INSERT INTO books SET Title='', Star=, Description='', URL='', user_ID=;
#bob
INSERT INTO `books` SET `Title`='Bookmark1', `Star`=1, `Description`='generic1', `URL`='foo.com', `user_ID`=2;
INSERT INTO `books` SET `Title`='Bookmark2', `Star`=0, `Description`='generic2', `URL`='bar.com', `user_ID`=2;
INSERT INTO `books` SET `Title`='Bookmark3', `Star`=0, `Description`='generic3', `URL`='example.com', `user_ID`=2;
#joe
INSERT INTO `books` SET `Title`='Gooooooogle', `Star`=0, `Description`='search', `URL`='google.com', `user_ID`=3;
INSERT INTO `books` SET `Title`='Reddit', `Star`=1, `Description`='Gossip', `URL`='reddit.com', `user_ID`=3;
INSERT INTO `books` SET `Title`='Shopping', `Star`=1, `Description`='Amazon', `URL`='amazon.com', `user_ID`=3;
#mark
INSERT INTO `books` SET `Title`='ex1', `Star`=0, `Description`='gen1', `URL`='a.com', `user_ID`=4;
INSERT INTO `books` SET `Title`='ex2', `Star`=0, `Description`='gen2', `URL`='b.com', `user_ID`=4;
INSERT INTO `books` SET `Title`='ex3', `Star`=0, `Description`='gen3', `URL`='c.com', `user_ID`=4;
#jane
INSERT INTO `books` SET `Title`='ex4', `Star`=1, `Description`='notblank', `URL`='d.com', `user_ID`=5;
INSERT INTO `books` SET `Title`='ex5', `Star`=1, `Description`='', `URL`='e.com', `user_ID`=5;
INSERT INTO `books` SET `Title`='ex6', `Star`=1, `Description`='notblank', `URL`='f.com', `user_ID`=5;
#sally
INSERT INTO `books` SET `Title`='ex7', `Star`=0, `Description`='notblank', `URL`='g.com', `user_ID`=6;
INSERT INTO `books` SET `Title`='ex8', `Star`=1, `Description`='', `URL`='h.com', `user_ID`=6;
INSERT INTO `books` SET `Title`='ex9', `Star`=1, `Description`='', `URL`='i.com', `user_ID`=6;

#INSERT INTO folders SET Name='', user_ID='';
#joe

INSERT INTO `folders` SET `Name`='Fun', `user_ID`='3';
INSERT INTO `folders` SET `Name`='Shop', `user_ID`='3';
INSERT INTO `folders` SET `Name`='Search', `user_ID`='3';
#mark
INSERT INTO `folders` SET `Name`='School', `user_ID`='4';
INSERT INTO `folders` SET `Name`='Movies', `user_ID`='4';
#jane
INSERT INTO `folders` SET `Name`='Work', `user_ID`='5';
#sally
INSERT INTO `folders` SET `Name`='Surfing', `user_ID`='6';
INSERT INTO `folders` SET `Name`='Tech', `user_ID`='6';
INSERT INTO `folders` SET `Name`='Secret', `user_ID`='6';
INSERT INTO `folders` SET `Name`='Social', `user_ID`='6';
INSERT INTO `folders` SET `Name`='Imp', `user_ID`='6';
INSERT INTO `folders` SET `Name`='Secret2', `user_ID`='6';
