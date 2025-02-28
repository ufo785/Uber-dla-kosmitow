-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 18, 2025 at 11:57 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ufo`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `drivers`
--

CREATE TABLE `drivers` (
  `species` char(20) DEFAULT NULL,
  `username` char(20) NOT NULL,
  `age` int(11) NOT NULL,
  `vehicle_model` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drivers`
--

INSERT INTO `drivers` (`species`, `username`, `age`, `vehicle_model`) VALUES
('Robot', 'a', 10, 'ModelD'),
('Human', 'user1', 25, 'ModelA'),
('Human', 'user10', 35, 'ModelE'),
('Alien', 'user2', 120, 'ModelB'),
('Robot', 'user3', 5, 'ModelC'),
('Human', 'user4', 30, 'ModelD'),
('Alien', 'user5', 200, 'ModelE'),
('Human', 'user6', 40, 'ModelA'),
('Cyborg', 'user7', 60, 'ModelB'),
('Alien', 'user8', 150, 'ModelC');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `location`
--

CREATE TABLE `location` (
  `galaxy` char(20) NOT NULL,
  `planet` char(20) NOT NULL,
  `planetary_system` char(20) NOT NULL,
  `location_id` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`galaxy`, `planet`, `planetary_system`, `location_id`) VALUES
('Milky Way', 'Earth', 'Solar System', 'LOC001'),
('Andromeda', 'Proxima B', 'Alpha Centauri', 'LOC002'),
('Milky Way', 'Mars', 'Solar System', 'LOC003'),
('Andromeda', 'Xenon', 'Zeta Reticuli', 'LOC004'),
('Triangulum', 'Orion IV', 'Orion Cluster', 'LOC005'),
('Milky Way', 'Europa', 'Jupiter System', 'LOC006'),
('Andromeda', 'Krypton', 'Krypton Cluster', 'LOC007'),
('Triangulum', 'Helios', 'Solar Nexus', 'LOC008'),
('Milky Way', 'Titan', 'Saturn System', 'LOC009'),
('Andromeda', 'Vega II', 'Lyra System', 'LOC010');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `transportation`
--

CREATE TABLE `transportation` (
  `passenger_location` char(20) DEFAULT NULL,
  `target_location` char(20) DEFAULT NULL,
  `environment` char(20) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `number_of_passenger` int(11) NOT NULL,
  `passenger_username` char(20) NOT NULL,
  `driver_username` char(20) DEFAULT NULL,
  `if_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `id` int(20) NOT NULL,
  `additional_boost` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transportation`
--

INSERT INTO `transportation` (`passenger_location`, `target_location`, `environment`, `price`, `number_of_passenger`, `passenger_username`, `driver_username`, `if_accepted`, `id`, `additional_boost`) VALUES
('LOC001', 'LOC003', 'Space', NULL, 2, 'b', NULL, 0, 1, 0),
('LOC002', 'LOC005', 'Water', 500, 1, 'user12', 'user7', 0, 2, 0),
('LOC001', 'LOC006', 'Space', 200, 3, 'b', 'a', 2, 5, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `username` char(20) NOT NULL,
  `password` char(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`) VALUES
('a', 'a'),
('b', 'b'),
('user1', 'password1'),
('user10', 'password10'),
('user11', 'password11'),
('user12', 'password12'),
('user13', 'password13'),
('user14', 'password14'),
('user15', 'password15'),
('user16', 'password16'),
('user17', 'password17'),
('user18', 'password18'),
('user19', 'password19'),
('user2', 'password2'),
('user20', 'password20'),
('user3', 'password3'),
('user4', 'password4'),
('user5', 'password5'),
('user6', 'password6'),
('user7', 'password7'),
('user8', 'password8'),
('user9', 'password9');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `vehicle`
--

CREATE TABLE `vehicle` (
  `vehicle_model` char(20) NOT NULL,
  `environment` char(20) DEFAULT NULL,
  `cost` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicle`
--

INSERT INTO `vehicle` (`vehicle_model`, `environment`, `cost`) VALUES
('ModelA', 'Land', 6),
('ModelB', 'Water', 10),
('ModelC', 'Air', 5),
('ModelD', 'Space', 4),
('ModelE', 'Mixed', 9);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `drivers`
--
ALTER TABLE `drivers`
  ADD PRIMARY KEY (`username`),
  ADD KEY `fk_vehicle` (`vehicle_model`);

--
-- Indeksy dla tabeli `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`);

--
-- Indeksy dla tabeli `transportation`
--
ALTER TABLE `transportation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_passenger_location_id` (`passenger_location`),
  ADD KEY `fk_target_location_id` (`target_location`),
  ADD KEY `fk_driver_username` (`driver_username`),
  ADD KEY `fk_passenger_username` (`passenger_username`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- Indeksy dla tabeli `vehicle`
--
ALTER TABLE `vehicle`
  ADD PRIMARY KEY (`vehicle_model`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `transportation`
--
ALTER TABLE `transportation`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drivers`
--
ALTER TABLE `drivers`
  ADD CONSTRAINT `fk_id` FOREIGN KEY (`username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `fk_vehicle` FOREIGN KEY (`vehicle_model`) REFERENCES `vehicle` (`vehicle_model`);

--
-- Constraints for table `transportation`
--
ALTER TABLE `transportation`
  ADD CONSTRAINT `fk_driver_username` FOREIGN KEY (`driver_username`) REFERENCES `drivers` (`username`),
  ADD CONSTRAINT `fk_passenger_location_id` FOREIGN KEY (`passenger_location`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `fk_passenger_username` FOREIGN KEY (`passenger_username`) REFERENCES `users` (`username`),
  ADD CONSTRAINT `fk_target_location_id` FOREIGN KEY (`target_location`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `fk_user_username` FOREIGN KEY (`driver_username`) REFERENCES `drivers` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
