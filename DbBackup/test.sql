-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 08, 2024 at 02:17 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test`
--

-- --------------------------------------------------------

--
-- Table structure for table `apps`
--

CREATE TABLE `apps` (
  `appsID` bigint(100) NOT NULL,
  `app` varchar(255) DEFAULT NULL,
  `access` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `apps`
--

INSERT INTO `apps` (`appsID`, `app`, `access`) VALUES
(1, 'pearson_specter', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `departmentID` bigint(100) NOT NULL,
  `userIDs` text DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `dateTime` text DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`departmentID`, `userIDs`, `department`, `description`, `dateTime`, `status`) VALUES
(1332672, '0,1001', 'new Dept', '', '2024-08-07 13:40:21', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `documentID` bigint(100) NOT NULL,
  `userIDs` text DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `dateTime` text DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `privilege_pearson_specter`
--

CREATE TABLE `privilege_pearson_specter` (
  `privilegeID` bigint(100) NOT NULL,
  `accountID` bigint(100) DEFAULT NULL,
  `add_privilege` varchar(3) DEFAULT NULL,
  `add_user` varchar(3) DEFAULT NULL,
  `edit_user` varchar(3) DEFAULT NULL,
  `deactivate_user` varchar(3) DEFAULT NULL,
  `add_role` varchar(3) DEFAULT NULL,
  `edit_role` varchar(3) DEFAULT NULL,
  `deactivate_role` varchar(3) DEFAULT NULL,
  `add_department` varchar(3) DEFAULT NULL,
  `edit_department` varchar(3) DEFAULT NULL,
  `deactivate_department` varchar(3) DEFAULT NULL,
  `add_document` varchar(3) DEFAULT NULL,
  `edit_document` varchar(3) DEFAULT NULL,
  `deactivate_document` varchar(3) DEFAULT NULL,
  `login_report` varchar(3) DEFAULT NULL,
  `document_upload_report` varchar(3) DEFAULT NULL,
  `deactivation_report` varchar(3) DEFAULT NULL,
  `recent_activity_report` varchar(3) DEFAULT NULL,
  `department_state_report` varchar(3) DEFAULT NULL,
  `assign_department` varchar(3) DEFAULT NULL,
  `assign_user` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `privilege_pearson_specter`
--

INSERT INTO `privilege_pearson_specter` (`privilegeID`, `accountID`, `add_privilege`, `add_user`, `edit_user`, `deactivate_user`, `add_role`, `edit_role`, `deactivate_role`, `add_department`, `edit_department`, `deactivate_department`, `add_document`, `edit_document`, `deactivate_document`, `login_report`, `document_upload_report`, `deactivation_report`, `recent_activity_report`, `department_state_report`, `assign_department`, `assign_user`) VALUES
(21063137, 1001, 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleID` bigint(100) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `dateTime` text DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `sessionID` bigint(100) NOT NULL,
  `userID` bigint(100) DEFAULT NULL,
  `DateTime` text DEFAULT NULL,
  `activity` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `session`
--

INSERT INTO `session` (`sessionID`, `userID`, `DateTime`, `activity`) VALUES
(1273632, 1001, '2024-08-07 13:40:21', 'added a new department'),
(8727315, 1001, '2024-08-07 17:10:32', 'logged out of system'),
(13106723, 1001, '2024-08-07 13:38:55', 'logged into system'),
(17062323, 1001, '2024-08-07 13:40:03', 'added a new document'),
(20374571, 1001, '2024-08-07 17:04:07', 'logged out of system'),
(36210372, 1001, '2024-08-07 13:40:21', 'added a new department'),
(37107452, 1001, '2024-08-07 17:04:12', 'logged into system'),
(37261013, 1001, '2024-08-07 13:39:47', 'updated a privilege'),
(80352771, 1001, '2024-08-07 17:10:39', 'logged into system');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userID` bigint(100) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `roleID` bigint(100) DEFAULT NULL,
  `dateTime` text DEFAULT NULL,
  `status` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userID`, `firstName`, `lastName`, `email`, `phone`, `address`, `username`, `password`, `roleID`, `dateTime`, `status`) VALUES
(1001, 'Carl', 'Nikoi', 'cnikoi70@gmail.com', '2365142181', '5088 Moss St', '1001', '827ccb0eea8a706c4c34a16891f84e7b', NULL, NULL, 'a');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `apps`
--
ALTER TABLE `apps`
  ADD PRIMARY KEY (`appsID`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`departmentID`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`documentID`);

--
-- Indexes for table `privilege_pearson_specter`
--
ALTER TABLE `privilege_pearson_specter`
  ADD PRIMARY KEY (`privilegeID`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleID`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`sessionID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userID`),
  ADD KEY `roleID` (`roleID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `session_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `role` (`roleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
