ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'pwd';
flush privileges;

-- 創建資料庫時指定字符集和排序規則
CREATE DATABASE IF NOT EXISTS weshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS weshare_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

use weshare;

-- Set the timezone
SET GLOBAL time_zone = '+8:00';

-- Create the 'user' table if it doesn't exist
CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    rating FLOAT,
    image VARCHAR(255),
    phone VARCHAR(255) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; 

-- Create the 'follow' table if it doesn't exist
CREATE TABLE IF NOT EXISTS fan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    follow_id INT NOT NULL,
    befollow_id INT NOT NULL,
    CONSTRAINT follow_id_key FOREIGN KEY (follow_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT befollow_id_key FOREIGN KEY (befollow_id) REFERENCES user(id) ON DELETE CASCADE
); 

-- Create the 'item_tag' ENUM type if it doesn't exist
CREATE TABLE IF NOT EXISTS item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    buyers_limit INT NOT NULL,
    num_of_buyers INT,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    introduction VARCHAR(255) NOT NULL,
    cost INT NOT NULL,
    tag ENUM('食品', '日用品', '衣物', '美妝', '家具', '優惠卷', '其他') NOT NULL,
    costco ENUM('內湖店', '北投店', '中和店', '新莊店', '汐止店', '中壢店', '桃園店', '新竹店', '北台中店', '台中店', '嘉義店', '台南店', '高雄店', '高雄大順店'),
    item_location VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    CONSTRAINT item_seller_id_key FOREIGN KEY (seller_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create the 'order_table' table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    quantity INT NOT NULL,    
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    status ENUM('request', 'agree') NOT NULL,
    CONSTRAINT order_item_id_key FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
    CONSTRAINT order_seller_id_key FOREIGN KEY (seller_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT order_buyer_id_key FOREIGN KEY (buyer_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create the 'event_table' table if it doesn't exist
CREATE TABLE IF NOT EXISTS event_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('買家下單通知', '交易成功通知') NOT NULL,
    order_id INT NOT NULL,
    item_id INT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT event_order_id_key FOREIGN KEY (order_id) REFERENCES order_table(id) ON DELETE CASCADE,
    CONSTRAINT event_item_id_key FOREIGN KEY (item_id) REFERENCES item(id) ON DELETE CASCADE,
    CONSTRAINT event_sender_id_key FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT event_recipient_id_key FOREIGN KEY (recipient_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create the 'chat' table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message VARCHAR(255),
    CONSTRAINT chat_sender_id_key FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT chat_receiver_id_key FOREIGN KEY (receiver_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    rating FLOAT,
    image VARCHAR(255),
    CONSTRAINT rate_sender_id_key FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
    CONSTRAINT rate_receiver_id_key FOREIGN KEY (receiver_id) REFERENCES user(id) ON DELETE CASCADE
);

use weshare_test;

CREATE TABLE weshare_test.user LIKE weshare.user;
CREATE TABLE weshare_test.fan LIKE weshare.fan;
CREATE TABLE weshare_test.item LIKE weshare.item;
CREATE TABLE weshare_test.order_table LIKE weshare.order_table;
CREATE TABLE weshare_test.event_table LIKE weshare.event_table;
CREATE TABLE weshare_test.chat LIKE weshare.chat;
CREATE TABLE weshare_test.rating LIKE weshare.rating;
