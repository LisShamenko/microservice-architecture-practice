
INSERT INTO users(login) VALUES ('test user');
-- 1

INSERT INTO user_files(user_id, url, title, is_loaded) VALUES (1, 'photos/logo-small.jpg', 'avatar', false);
INSERT INTO user_files(user_id, url, title, is_loaded) VALUES (1, 'videos/tom.mp4', 'current', false);
-- 1

INSERT INTO test_models(user_id, title, description, photo_url, video_url, status, notes, file_id) 
VALUES
    (1, 'title 1', 'des 1', 'photos/logo-small.jpg', 'videos/logo-small.jpg', 'accepted', ARRAY['note 1', 'note 2'], 1),
    (1, 'title 2', 'des 2', 'photos/logo-small.jpg', 'videos/logo-small.jpg', 'accepted', ARRAY['note 3', 'note 4', 'note 5'], 1),
    (1, 'title 3', 'des 3', 'photos/logo-small.jpg', 'videos/logo-small.jpg', 'accepted', ARRAY['note 6'], 1);
-- 1, 2, 3
