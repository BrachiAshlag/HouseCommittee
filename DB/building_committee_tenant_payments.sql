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
-- Table structure for table `tenant_payments`
--

DROP TABLE IF EXISTS `tenant_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenant_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `apartment_id` int NOT NULL,
  `month` int NOT NULL,
  `amount` int NOT NULL,
  `payments_date` date NOT NULL,
  `Approval_from_credit_company` int DEFAULT NULL,
  `num_of_payments` int NOT NULL,
  `payment_form_id` int NOT NULL,
  `receipt` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_payments_form_idx` (`payment_form_id`),
  KEY `FK_tenant_payment_tenants_idx` (`apartment_id`),
  CONSTRAINT `FK_payments_apartments` FOREIGN KEY (`apartment_id`) REFERENCES `apartments` (`id`),
  CONSTRAINT `FK_payments_form` FOREIGN KEY (`payment_form_id`) REFERENCES `payment_forms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenant_payments`
--

LOCK TABLES `tenant_payments` WRITE;
/*!40000 ALTER TABLE `tenant_payments` DISABLE KEYS */;
INSERT INTO `tenant_payments` VALUES (1,1,1,211,'2023-03-01',NULL,1,1,NULL),(3,1,1,211,'2023-03-25',NULL,1,1,NULL),(4,1,2,100,'2023-02-15',NULL,2,2,'./files/receipt-2023-04-15-apartment-1.pdf'),(5,1,5,250,'2020-03-03',321,5,1,'./files/receipt-2020-03-03-apartment-1.pdf'),(6,1,1,1285,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(7,1,1,1285,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(8,1,1,1285,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(9,1,1,1285,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(10,1,1,100,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(11,1,1,200,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(12,1,1,300,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(13,1,1,400,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(14,1,1,400,'2023-04-20',NULL,1,1,'./files/receipt-2023-04-20-apartment-54.pdf'),(15,1,1,300,'2023-04-19',NULL,1,3,'./files/receipt-2023-04-19-apartment-54.pdf'),(16,1,1,300,'2023-04-19',NULL,1,3,'./files/receipt-2023-04-19-apartment-54.pdf');
/*!40000 ALTER TABLE `tenant_payments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-24 23:06:20
