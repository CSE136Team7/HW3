-- MySQL dump 10.13  Distrib 5.7.11, for osx10.11 (x86_64)
--
-- Host: localhost    Database: bookmarks
-- ------------------------------------------------------
-- Server version	5.7.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `books` (
  `Title` varchar(16) NOT NULL,
  `Star` tinyint(1) NOT NULL,
  `Description` varchar(180) DEFAULT NULL,
  `URL` varchar(256) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `book_ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`book_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES ('test_books',0,'optional','www.google.com',1,1),('Bookmark1',1,'generic1','foo.com',2,2),('Bookmark2',0,'generic2','bar.com',2,3),('Bookmark3',0,'generic3','example.com',2,4),('Reddit',0,'Gossip','reddit.com',3,6),('Shopping',1,'Amazon','amazon.com',3,7),('ex1',0,'gen1','a.com',4,8),('ex2',0,'gen2','b.com',4,9),('ex3',0,'gen3','c.com',4,10),('ex4',1,'notblank','d.com',5,11),('ex5',1,'','e.com',5,12),('ex6',1,'notblank','f.com',5,13),('ex7',0,'notblank','g.com',6,14),('ex8',1,'','h.com',6,15),('ex9',1,'','i.com',6,16),('yahoo',0,'https://www.yahoo.com/','Yahoo',3,18),('linkedin',0,'https://www.linkedin.com/','get that job',3,19),('Github',0,'https://github.com/','cloud your code',3,20),('crunchbase',0,'companies info','https://www.crunchbase.com/',3,22),('yahoo',1,'YAHOO','https://www.yahoo.com/',7,23),('facebook',0,'Bal','http://www.facebook.com/',7,24),('facebook',0,'daf','https://www.facebook.com/',8,28),('yahoo',0,'YAHOO','https://www.yahoo.com/',8,29),('netflix',0,'Netflix','https://www.netflix.com/watch/80075905?trackId=14272744',8,30),('Github',0,'github','https://github.com/settings/repositories',8,33);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder_has_books`
--

DROP TABLE IF EXISTS `folder_has_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `folder_has_books` (
  `folder_ID` int(11) NOT NULL,
  `book_ID` int(11) NOT NULL,
  KEY `folder_ID` (`folder_ID`),
  KEY `book_ID` (`book_ID`),
  CONSTRAINT `folder_has_books_ibfk_1` FOREIGN KEY (`folder_ID`) REFERENCES `folders` (`folder_ID`) ON DELETE CASCADE,
  CONSTRAINT `folder_has_books_ibfk_2` FOREIGN KEY (`book_ID`) REFERENCES `books` (`book_ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder_has_books`
--

LOCK TABLES `folder_has_books` WRITE;
/*!40000 ALTER TABLE `folder_has_books` DISABLE KEYS */;
INSERT INTO `folder_has_books` VALUES (1,1),(38,23),(38,23);
/*!40000 ALTER TABLE `folder_has_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folders`
--

DROP TABLE IF EXISTS `folders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `folders` (
  `Name` varchar(16) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `folder_ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`folder_ID`),
  KEY `user_ID` (`user_ID`),
  CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`user_ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folders`
--

LOCK TABLES `folders` WRITE;
/*!40000 ALTER TABLE `folders` DISABLE KEYS */;
INSERT INTO `folders` VALUES ('test_folders',1,1),('Fun',3,2),('Shop',3,3),('Search',3,4),('School',4,5),('Movies',4,6),('Work',5,7),('Surfing',6,8),('Tech',6,9),('Secret',6,10),('Social',6,11),('Imp',6,12),('Secret2',6,13),('balkrishna',7,38),('hello',7,42),('hello',8,71);
/*!40000 ALTER TABLE `folders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(255) COLLATE utf8_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `passhash` varchar(32) NOT NULL,
  `user_ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_ID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('test_username','RBX123',1),('bob','IAE123',2),('joe','OKD123',3),('mark','PVQ123',4),('jane','MDX123',5),('sally','IJV123',6),('bal','3db9007f5acd91bf68373c0128dc0724',7),('hero','f04af61b3f332afa0ceec786a42cd365',8);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-23  0:21:28
