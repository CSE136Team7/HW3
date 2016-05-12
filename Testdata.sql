#this is a comment in mysql

#login to mysql from the command line
#mysql -uroot

#start with a fresh database
#DROP DATABASE IF EXISTS CSE136env;
#CREATE DATABASE CSE136env;
#USE CSE136env;
#alternatively drop tables within current database
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS folder_has_books;

#users table
#md5 hash alg gives a 32-char string for password use
CREATE TABLE users (
username varchar(30) NOT NULL UNIQUE,
passhash varchar(32) NOT NULL,
user_ID int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (user_ID)
);

#bookmarks table
CREATE TABLE books (
Title varchar(16) NOT NULL,
Star boolean NOT NULL,
Description varchar(180),
URL varchar(256) NOT NULL,
user_ID int NOT NULL,
book_ID int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (book_ID),
FOREIGN KEY (user_ID) REFERENCES users (user_ID) ON DELETE CASCADE
);

#folders table
CREATE TABLE folders (
Name varchar(16) NOT NULL,
user_ID int NOT NULL,
folder_ID int NOT NULL AUTO_INCREMENT,
PRIMARY KEY (folder_ID),
FOREIGN KEY (user_ID) REFERENCES users (user_ID) ON DELETE CASCADE
);

#relate bookmarks to folders
CREATE TABLE folder_has_books (
folder_ID int NOT NULL,
book_ID int NOT NULL,
FOREIGN KEY (folder_ID) REFERENCES folders (folder_ID) ON DELETE CASCADE,
FOREIGN KEY (book_ID) REFERENCES books (book_ID) ON DELETE CASCADE
);

#Example insertion of data:
#NOTE: quotations sometimes must be retyped, they copy and paste as special characters which causes an error in mysql

INSERT INTO users SET username='test_username', passhash='RBX123';
INSERT INTO books SET Title='test_books', Star=0, Description='optional', URL='www.google.com', user_ID=1;
INSERT INTO folders SET Name='test_folders', user_ID='1';
INSERT INTO folder_has_books SET folder_ID='1', book_ID='1';

#INSERT INTO users SET username='', passhash='';
#user_ID = 2
INSERT INTO users SET username='bob', passhash='IAE123';
#user_ID = 3
INSERT INTO users SET username='joe', passhash='OKD123';
#user_ID = 4
INSERT INTO users SET username='mark', passhash='PVQ123';
#user_ID = 5
INSERT INTO users SET username='jane', passhash='MDX123';
#user_ID = 6
INSERT INTO users SET username='sally', passhash='IJV123';

#INSERT INTO books SET Title='', Star=, Description='', URL='', user_ID=;
#bob
INSERT INTO books SET Title='Bookmark1', Star=1, Description='generic1', URL='foo.com', user_ID=2;
INSERT INTO books SET Title='Bookmark2', Star=0, Description='generic2', URL='bar.com', user_ID=2;
INSERT INTO books SET Title='Bookmark3', Star=0, Description='generic3', URL='example.com', user_ID=2;
#joe
INSERT INTO books SET Title='Gooooooogle', Star=0, Description='search', URL='google.com', user_ID=3;
INSERT INTO books SET Title='Reddit', Star=1, Description='Gossip', URL='reddit.com', user_ID=3;
INSERT INTO books SET Title='Shopping', Star=1, Description='Amazon', URL='amazon.com', user_ID=3;
#mark
INSERT INTO books SET Title='ex1', Star=0, Description='gen1', URL='a.com', user_ID=4;
INSERT INTO books SET Title='ex2', Star=0, Description='gen2', URL='b.com', user_ID=4;
INSERT INTO books SET Title='ex3', Star=0, Description='gen3', URL='c.com', user_ID=4;
#jane
INSERT INTO books SET Title='ex4', Star=1, Description='notblank', URL='d.com', user_ID=5;
INSERT INTO books SET Title='ex5', Star=1, Description='', URL='e.com', user_ID=5;
INSERT INTO books SET Title='ex6', Star=1, Description='notblank', URL='f.com', user_ID=5;
#sally
INSERT INTO books SET Title='ex7', Star=0, Description='notblank', URL='g.com', user_ID=6;
INSERT INTO books SET Title='ex8', Star=1, Description='', URL='h.com', user_ID=6;
INSERT INTO books SET Title='ex9', Star=1, Description='', URL='i.com', user_ID=6;

#INSERT INTO folders SET Name='', user_ID='';
#joe
INSERT INTO folders SET Name='Fun', user_ID='3';
INSERT INTO folders SET Name='Shop', user_ID='3';
INSERT INTO folders SET Name='Search', user_ID='3';
#mark
INSERT INTO folders SET Name='', user_ID='4';
INSERT INTO folders SET Name='', user_ID='4';
#jane
INSERT INTO folders SET Name='', user_ID='5';
#sally
INSERT INTO folders SET Name='', user_ID='6';
INSERT INTO folders SET Name='', user_ID='6';
INSERT INTO folders SET Name='', user_ID='6';
INSERT INTO folders SET Name='', user_ID='6';
INSERT INTO folders SET Name='', user_ID='6';
INSERT INTO folders SET Name='', user_ID='6';



#some test queries

#returns 1
SELECT COUNT(*) 
FROM users
WHERE passhash='IJV123'
#somepassword
AND username='sally'
#someusername


#Queries on data

#FILL IN SPECIFIED VALUES BEFORE RUNNING THESE QUERIES AS THEY ARE NOT GENERIC
#some__ denotes value to enter in

#validate a login
SELECT COUNT(*) 
FROM users
WHERE passhash=''
#somepassword
AND username=''
#someusername

#select all books and folders associated with a particular user
SELECT users.username, books.Title, books.Star, books.Description, books.URL, folders.Name
FROM users, books, folders, folder_has_books
WHERE users.user_ID=
#someID
AND users.user_ID=books.user_ID 
AND users.user_ID=folders.user_ID 
AND folders.folder_ID=folder_has_books.folder_ID 
AND books.book_ID=folder_has_books.book_ID;

#Get bookmarks list for a particular user
SELECT Title, Star, Description, URL
FROM books
WHERE books.user_ID=
#someID
;

#Get folder list for a particular user 
SELECT Name 
FROM folders
WHERE user_ID=
#someuser

