-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `actividad`
--

DROP TABLE IF EXISTS `actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `actividad` (
  `idactividad` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `delegado_codigo` varchar(8) NOT NULL,
  PRIMARY KEY (`idactividad`),
  KEY `fk_actividad_usuario1_idx` (`delegado_codigo`),
  CONSTRAINT `fk_actividad_usuario1` FOREIGN KEY (`delegado_codigo`) REFERENCES `usuario` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad`
--

LOCK TABLES `actividad` WRITE;
/*!40000 ALTER TABLE `actividad` DISABLE KEYS */;
INSERT INTO `actividad` VALUES (1,'Futbol Fem','Futbol damas','20190000'),(2,'Peña','Ensayos musicales','20190800'),(3,'Porristas','Bajeen','20190100');
/*!40000 ALTER TABLE `actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `ideventos` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `descripcion` varchar(45) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `estado` int NOT NULL,
  `idactividad` int NOT NULL,
  `idlugares` int NOT NULL,
  PRIMARY KEY (`ideventos`),
  KEY `fk_eventos_actividad1_idx` (`idactividad`),
  KEY `fk_eventos_lugares1_idx` (`idlugares`),
  CONSTRAINT `fk_eventos_actividad1` FOREIGN KEY (`idactividad`) REFERENCES `actividad` (`idactividad`),
  CONSTRAINT `fk_eventos_lugares1` FOREIGN KEY (`idlugares`) REFERENCES `lugares` (`idlugares`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,'Primer ensayo','Demuestren su talento','2023-09-23','10:00:00',1,2,1),(2,'Segundo ensayo','Seguir la practica','2023-09-30','10:00:00',1,2,1),(3,'Porristos','Convocatoria de hombres','2023-09-24','11:30:00',1,3,4),(4,'Porristas','Convocatoria de chicas','2023-09-24','12:30:00',1,3,4),(5,'Partido Amistoso','Partido amistoso contra Erectro','2023-09-25','12:00:00',0,1,2);
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagen`
--

DROP TABLE IF EXISTS `imagen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagen` (
  `idimagen` int NOT NULL,
  `imagen_url` varchar(45) NOT NULL,
  `eventos_ideventos` int NOT NULL,
  PRIMARY KEY (`idimagen`),
  KEY `fk_imagen_eventos_idx` (`eventos_ideventos`),
  CONSTRAINT `fk_imagen_eventos` FOREIGN KEY (`eventos_ideventos`) REFERENCES `eventos` (`ideventos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagen`
--

LOCK TABLES `imagen` WRITE;
/*!40000 ALTER TABLE `imagen` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lugares`
--

DROP TABLE IF EXISTS `lugares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lugares` (
  `idlugares` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `localizacion` varchar(45) NOT NULL,
  PRIMARY KEY (`idlugares`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lugares`
--

LOCK TABLES `lugares` WRITE;
/*!40000 ALTER TABLE `lugares` DISABLE KEYS */;
INSERT INTO `lugares` VALUES (1,'Bati','10.10'),(2,'Cancha de Minas','10.20'),(3,'Polideportivo PUCP','10.30'),(4,'Digimundo','10.40'),(5,'Estacionamiento de Letras','10.50');
/*!40000 ALTER TABLE `lugares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participantes`
--

DROP TABLE IF EXISTS `participantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participantes` (
  `participante_codigo` varchar(8) NOT NULL,
  `ideventos` int NOT NULL,
  `asignacion` int NOT NULL,
  PRIMARY KEY (`participante_codigo`,`ideventos`),
  KEY `fk_usuario_has_eventos_eventos1_idx` (`ideventos`),
  KEY `fk_usuario_has_eventos_usuario1_idx` (`participante_codigo`),
  CONSTRAINT `fk_usuario_has_eventos_eventos1` FOREIGN KEY (`ideventos`) REFERENCES `eventos` (`ideventos`),
  CONSTRAINT `fk_usuario_has_eventos_usuario1` FOREIGN KEY (`participante_codigo`) REFERENCES `usuario` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participantes`
--

LOCK TABLES `participantes` WRITE;
/*!40000 ALTER TABLE `participantes` DISABLE KEYS */;
INSERT INTO `participantes` VALUES ('20190001',1,1),('20190001',2,1),('20201010',2,2),('20202020',2,1);
/*!40000 ALTER TABLE `participantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `codigo` varchar(8) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `contrasenha` varchar(256) NOT NULL,
  `condicion` int NOT NULL,
  `rol` int NOT NULL,
  `validado` int NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES ('20190000','stefhanie@pucp.edu.pe','1234',1,2,1,'Stefhanie Jaramillo'),('20190001','carlos@pucp.edu.pe','1234',1,3,1,'Carlos Ayala'),('20190050','ahumadac.m@pucp.edu.pe','1234',1,1,1,'Miguel Ahumada'),('20190100','niurka@pucp.edu.pe','1234',1,2,1,'Niurka Carrion'),('20190800','diegozuas@pucp.edu.pe','1234',1,2,1,'Diego Zuasnabar'),('20201010','diego@pucp.edu.pe','1234',1,3,1,'Diego Lavado'),('20202020','leo@pucp.edu.pe','1234',1,3,1,'Leonardo Abanto');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-17 23:02:57
