-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: building_committee
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ads_boards`
--

DROP TABLE IF EXISTS `ads_boards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ads_boards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `removal_date` datetime NOT NULL,
  `entry_id` int DEFAULT NULL,
  `building_id` int DEFAULT NULL,
  `subject` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ads_boards_ibfk_1` (`entry_id`),
  KEY `ads_boards_ibfk_2` (`building_id`),
  CONSTRAINT `ads_boards_ibfk_1` FOREIGN KEY (`entry_id`) REFERENCES `entries` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ads_boards_ibfk_2` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ads_boards`
--

LOCK TABLES `ads_boards` WRITE;
/*!40000 ALTER TABLE `ads_boards` DISABLE KEYS */;
INSERT INTO `ads_boards` VALUES (5,'try2','2023-05-02 21:00:00',1,NULL,'d'),(20,'ברכי','2023-04-09 00:00:00',1,NULL,'e'),(21,'ברכי 2','2023-04-09 00:00:00',1,NULL,'y'),(23,'יש הצבעה חדשה שממתינה להצבעתך.','2023-04-26 00:00:00',NULL,1,'r'),(24,'יש הצבעה חדשה שממתינה להצבעתך.','2023-05-31 00:00:00',1,NULL,'f'),(25,'יש הצבעה חדשה שממתינה להצבעתך.','2023-05-31 00:00:00',1,NULL,'d'),(26,'ישנה הצבעה חדשה בנושא דרך הפוסטמן הממתינה עבורך','2023-05-31 00:00:00',1,NULL,'f'),(35,'בעחכע','2023-04-18 00:00:00',NULL,1,'h'),(36,'aaa','2023-04-19 00:00:00',NULL,1,'j'),(37,'aaa','2023-04-19 00:00:00',NULL,1,'k'),(38,'ותאור','2023-04-19 00:00:00',1,NULL,'נסיון עם נושא'),(39,'הצבעה חדשה ממתינה עבורך','2023-04-19 00:00:00',1,NULL,'נושא להוספת הצבעה'),(40,'הצבעה חדשה ממתינה עבורך','2023-04-19 00:00:00',1,NULL,'נושא להוספת הצבעה'),(41,'צטיכעיגכעידר','2023-04-19 00:00:00',NULL,1,'כעחיכ'),(42,'צטיכעיגכעידר','2023-04-19 00:00:00',NULL,1,'כעחיכ'),(43,'צטיכעיגכעידר','2023-04-19 00:00:00',NULL,1,'כעחיכ'),(44,'צטיכעיגכעידר','2023-04-19 00:00:00',NULL,1,'כעחיכ'),(45,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'לחיעכ'),(46,'הצבעה חדשה ממתינה עבורך','2023-04-26 00:00:00',NULL,1,'לןוחיטע'),(47,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'ברכי החמודה'),(48,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'ברכי המקסימה'),(49,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'ברכי המקסימה'),(50,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'ברכוש'),(51,'הצבעה חדשה ממתינה עבורך','2023-04-26 00:00:00',NULL,1,'אילה'),(52,'הצבעה חדשה ממתינה עבורך','2023-04-26 00:00:00',NULL,1,'ברכי'),(53,'הצבעה חדשה ממתינה עבורך','2023-04-26 00:00:00',NULL,1,'ברכי'),(54,'הצבעה חדשה ממתינה עבורך','2023-04-26 00:00:00',NULL,1,'ברכוש'),(55,'הצבעה חדשה ממתינה עבורך','2023-04-27 00:00:00',NULL,1,'ברכיייייייייייייייייייייייייי'),(56,'הצבעה חדשה ממתינה עבורך','2023-04-19 00:00:00',NULL,1,'הלוואי שיצליח');
/*!40000 ALTER TABLE `ads_boards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-24 23:06:22
