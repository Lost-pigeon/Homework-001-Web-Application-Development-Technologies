# Homework-001-Web-Application-Development-Technologies
Домашнее задание по курсу "Технологии разработки веб-приложений"
Вариант ТРВП-001

## Установка и запуск

### Настройка MySQL

Создайте базу и пользователя:
```sql
CREATE DATABASE IF NOT EXISTS `ip_manager_db` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON `ip_manager_db`.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
```
Создайте таблицы:
```
USE `ip_manager_db`;

-- Таблица мастеров
CREATE TABLE IF NOT EXISTS `masters` (
  `_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `fio` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Таблица заявок (tasks)
CREATE TABLE IF NOT EXISTS `tasks` (
  `_id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `address` VARCHAR(512) NOT NULL,
  `complexity` INT NOT NULL,
  `masterId` VARCHAR(36) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tasks_master` FOREIGN KEY (`masterId`) REFERENCES `masters`(`_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Индекс для ускорения поиска задач по мастеру
CREATE INDEX idx_tasks_masterId ON `tasks` (`masterId`);
```
Тестовое заполнение таблиц:
```
INSERT INTO `masters` (`_id`, `fio`) VALUES
('11111111-1111-4111-8111-111111111111', 'Иванов Иван Иванович'),
('22222222-2222-4222-8222-222222222222', 'Петров Пётр Петрович');

INSERT INTO `tasks` (`_id`, `address`, `complexity`, `masterId`) VALUES
('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'ул. Ленина, д.1', 3, '11111111-1111-4111-8111-111111111111'),
('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'пр. Мира, д.10', 5, '11111111-1111-4111-8111-111111111111'),
('ccccccc3-cccc-4ccc-8ccc-ccccccccccc3', 'ул. Пушкина, д.5', 1, '22222222-2222-4222-8222-222222222222');

```
### Запуск сервера

```
cd server
npm install
npm run seed
npm run start
```
### Запуск клиента
```
cd client
npm install
npm start
```

## Примеры запросов
```
# создать мастера
Invoke-RestMethod -Uri http://localhost:4000/api/masters -Method POST -ContentType "application/json" -Body '{"fio":"Тестовый мастер"}'

# добавить заявку
Invoke-RestMethod -Uri http://localhost:4000/api/masters/<MASTER_ID>/tasks -Method POST -ContentType "application/json" -Body '{"address":"ул. Ленина, 1","complexity":3}'
```
