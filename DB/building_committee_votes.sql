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
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `end_date` date DEFAULT NULL,
  `vote_type_id` int NOT NULL,
  `entry_id` int DEFAULT NULL,
  `building_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_vote_voteType_idx` (`vote_type_id`),
  KEY `FK_votes_entries_idx` (`entry_id`),
  KEY `FK_votes_buildings_idx` (`building_id`),
  CONSTRAINT `FK_vote_voteType` FOREIGN KEY (`vote_type_id`) REFERENCES `votes_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_votes_buildings` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_votes_entries` FOREIGN KEY (`entry_id`) REFERENCES `entries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (4,'hello','2023-05-02',1,1,NULL),(5,'hello','2023-05-02',1,1,NULL),(6,'ygyp','2023-03-03',1,1,NULL),(7,'dfgd','2023-05-02',1,1,NULL),(8,'try','2023-05-02',1,1,NULL),(24,'ברכי','2023-04-09',3,1,NULL),(25,'ברכי 2','2023-04-30',3,1,NULL),(27,'עם גוף המודעה','2023-04-26',2,NULL,1),(28,'דרך הפוסטמן','2023-05-31',1,1,NULL),(31,'נושא להוספת הצבעה','2023-04-19',2,1,NULL),(32,'נושא להוספת הצבעה','2023-04-19',2,1,NULL),(33,'נושא להוספת הצבעה','2023-04-19',2,1,NULL),(34,'נושא להוספת הצבעה','2023-04-19',2,1,NULL),(36,'לןוחיטע','2023-04-26',2,NULL,1),(37,'ברכי החמודה','2023-04-27',1,NULL,1),(38,'ברכי המקסימה','2023-04-27',1,NULL,1),(39,'ברכי המקסימה','2023-04-27',1,NULL,1),(40,'ברכוש','2023-04-27',1,NULL,1),(41,'אילה','2023-04-26',3,NULL,1),(42,'ברכי','2023-04-26',4,NULL,1),(43,'ברכי','2023-04-26',1,NULL,1),(44,'ברכוש','2023-04-26',1,NULL,1),(45,'ברכיייייייייייייייייייייייייי','2023-04-27',3,NULL,1),(46,'הלוואי שיצליח','2023-04-19',2,NULL,1);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
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
