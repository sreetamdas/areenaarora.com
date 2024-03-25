ALTER TABLE user ADD `username` text;--> statement-breakpoint
ALTER TABLE user ADD `hashed_password` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);