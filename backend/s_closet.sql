-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 07, 2022 at 03:56 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `s_closet`
--

-- --------------------------------------------------------

--
-- Table structure for table `cloths`
--

DROP TABLE IF EXISTS `cloths`;
CREATE TABLE IF NOT EXISTS `cloths` (
  `RFID` bigint(11) NOT NULL,
  `deviceID` int(11) NOT NULL,
  `uID` int(11) NOT NULL,
  `cType` int(11) NOT NULL,
  PRIMARY KEY (`RFID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cloths`
--

INSERT INTO `cloths` (`RFID`, `deviceID`, `uID`, `cType`) VALUES
(123456783, 123456, 5857571, 5),
(123456784, 123456, 5857571, 6),
(123456785, 123456, 5857571, 9);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
CREATE TABLE IF NOT EXISTS `inventory` (
  `RFID` bigint(20) NOT NULL,
  `deviceID` int(11) NOT NULL,
  `uID` int(11) NOT NULL,
  `laundryState` enum('0','1') NOT NULL,
  PRIMARY KEY (`RFID`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`RFID`, `deviceID`, `uID`, `laundryState`) VALUES
(123456783, 123456, 5857571, '0'),
(123456784, 123456, 5857571, '0'),
(123456785, 123456, 5857571, '0');

-- --------------------------------------------------------

--
-- Table structure for table `super_user`
--

DROP TABLE IF EXISTS `super_user`;
CREATE TABLE IF NOT EXISTS `super_user` (
  `deviceID` int(11) NOT NULL,
  `devicename` varchar(255) NOT NULL,
  `pin` int(11) NOT NULL,
  PRIMARY KEY (`deviceID`),
  UNIQUE KEY `username` (`devicename`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `super_user`
--

INSERT INTO `super_user` (`deviceID`, `devicename`, `pin`) VALUES
(123456, 'Mydevice', 123456);

-- --------------------------------------------------------

--
-- Table structure for table `user_profile`
--

DROP TABLE IF EXISTS `user_profile`;
CREATE TABLE IF NOT EXISTS `user_profile` (
  `uID` int(11) NOT NULL AUTO_INCREMENT,
  `deviceID` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  PRIMARY KEY (`uID`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=5857572 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_profile`
--

INSERT INTO `user_profile` (`uID`, `deviceID`, `username`, `firstname`, `lastname`, `gender`, `age`, `city`) VALUES
(5857571, 123456, 'meet', 'Meet', 'Kevadiya', 'male', 22, 'Windsor');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
