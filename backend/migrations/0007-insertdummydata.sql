-- 1. Insert User and ensure it ends with a semicolon
-- If 'id' is a SERIAL/IDENTITY, don't force it to 1.
INSERT INTO users (username, email, password_hash, display_name)
VALUES ('test', 'test@test', '$argon2id$v=19$m=65536,t=2,p=1$B81APc7vZ/RlHft4BqIpMA$SukgpgWYROeO9z7Hhwzu20WN3ThDmsfFqZKpD34HJ2s', 'Test');

-- 1. Seed a Restaurant
INSERT INTO restaurants (camis, name, boro, building, street, zipcode, phone, cuisine, grade)
VALUES (999999999, 'The Healthy Bite', 'MANHATTAN', '123', 'GREENWICH ST', '10001', '2125550199', 'Healthy', 'A');

-- 3. Seed a Menu (Linking the restaurant and user)
INSERT INTO menus (restaurant_id, user_id, rating)
VALUES (
    999999999, 
    (SELECT id FROM users WHERE username = 'test'), 
    5
);

-- 4. Insert food items (using the subquery method from before)
INSERT INTO food_items (menu_id, dish_name, health_points, menu_section, price)
VALUES 
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Avocado Smash', 120, 'Breakfast', 14.50),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Classic Burger', -10, 'Main', 16.00),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Kale Salad', 20, 'Salads', 12.00),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Berry Parfait', 35, 'Breakfast', 9.50),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Green Smoothie', 45, 'Drinks', 8.00),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Loaded Fries', -35, 'Sides', 7.50),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Grilled Salmon Bowl', 60, 'Main', 18.00),
    ((SELECT id FROM menus WHERE restaurant_id = 999999999 LIMIT 1), 'Chocolate Shake', -25, 'Dessert', 6.75);

INSERT INTO food_logs (user_id, food_item_id, logged_at)
VALUES
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Avocado Smash' LIMIT 1), '2026-04-05T08:15:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Classic Burger' LIMIT 1), '2026-04-05T13:10:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Kale Salad' LIMIT 1), '2026-04-06T12:30:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Berry Parfait' LIMIT 1), '2026-04-07T09:00:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Loaded Fries' LIMIT 1), '2026-04-08T18:40:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Grilled Salmon Bowl' LIMIT 1), '2026-04-09T19:05:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Chocolate Shake' LIMIT 1), '2026-04-10T20:10:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Green Smoothie' LIMIT 1), '2026-04-11T07:45:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Classic Burger' LIMIT 1), '2026-04-12T14:20:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Kale Salad' LIMIT 1), '2026-04-13T12:05:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Avocado Smash' LIMIT 1), '2026-04-14T08:25:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Loaded Fries' LIMIT 1), '2026-04-15T21:00:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Grilled Salmon Bowl' LIMIT 1), '2026-04-16T18:15:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Berry Parfait' LIMIT 1), '2026-04-17T08:50:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Chocolate Shake' LIMIT 1), '2026-04-18T16:35:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Green Smoothie' LIMIT 1), '2026-04-19T10:10:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Classic Burger' LIMIT 1), '2026-04-20T13:55:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Kale Salad' LIMIT 1), '2026-04-21T11:45:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Avocado Smash' LIMIT 1), '2026-04-22T08:05:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Grilled Salmon Bowl' LIMIT 1), '2026-04-23T18:25:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Loaded Fries' LIMIT 1), '2026-04-24T19:40:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Berry Parfait' LIMIT 1), '2026-04-25T09:20:00-04:00'),
    ((SELECT id FROM users WHERE username = 'test'), (SELECT id FROM food_items WHERE dish_name = 'Green Smoothie' LIMIT 1), '2026-04-26T07:35:00-04:00');

UPDATE users
SET health_score = COALESCE((
    SELECT SUM(fi.health_points)
    FROM food_logs fl
    JOIN food_items fi ON fi.id = fl.food_item_id
    WHERE fl.user_id = users.id
), 0)
WHERE username = 'test';
