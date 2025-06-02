-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: 営業管理
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `営業マスタ`
--

DROP TABLE IF EXISTS `営業マスタ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `営業マスタ` (
  `id` int NOT NULL AUTO_INCREMENT,
  `営業マン名` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `営業マスタ`
--

LOCK TABLES `営業マスタ` WRITE;
/*!40000 ALTER TABLE `営業マスタ` DISABLE KEYS */;
INSERT INTO `営業マスタ` VALUES (1,'佐藤 太郎'),(2,'鈴木 花子'),(3,'高橋 一郎');
/*!40000 ALTER TABLE `営業マスタ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `購入品`
--

DROP TABLE IF EXISTS `購入品`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `購入品` (
  `id` int NOT NULL AUTO_INCREMENT,
  `顧客マスタ_id` int NOT NULL,
  `購入品` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `金額` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `2_idx` (`顧客マスタ_id`),
  CONSTRAINT `2` FOREIGN KEY (`顧客マスタ_id`) REFERENCES `顧客マスタ` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `購入品`
--

LOCK TABLES `購入品` WRITE;
/*!40000 ALTER TABLE `購入品` DISABLE KEYS */;
INSERT INTO `購入品` VALUES (1,1,'ノートパソコン',120000),(2,1,'プリンター',35000),(3,2,'デスクチェア',22000),(4,2,'タブレット',45000),(5,3,'スマートフォン',80000),(6,3,'プロジェクター',60000),(7,4,'スピーカー',18000),(8,4,'モニター',30000),(9,5,'外付けHDD',12000),(10,6,'無線ルーター',9000);
/*!40000 ALTER TABLE `購入品` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `顧客マスタ`
--

DROP TABLE IF EXISTS `顧客マスタ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `顧客マスタ` (
  `id` int NOT NULL AUTO_INCREMENT,
  `営業マスタ_id` int NOT NULL,
  `顧客名` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `1_idx` (`営業マスタ_id`),
  CONSTRAINT `1` FOREIGN KEY (`営業マスタ_id`) REFERENCES `営業マスタ` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `顧客マスタ`
--

LOCK TABLES `顧客マスタ` WRITE;
/*!40000 ALTER TABLE `顧客マスタ` DISABLE KEYS */;
INSERT INTO `顧客マスタ` VALUES (1,1,'株式会社オメガ'),(2,1,'	有限会社カノン'),(3,2,'	合同会社プラント'),(4,2,'	株式会社フェイズ'),(5,3,'株式会社リンクス'),(6,3,'株式会社サイファ');
/*!40000 ALTER TABLE `顧客マスタ` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-28 14:54:07
