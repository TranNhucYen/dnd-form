CREATE TABLE `role` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_code` enum('super_admin','admin','user') NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `role_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_role_code_unique` UNIQUE(`role_code`)
);
--> statement-breakpoint
CREATE TABLE `permission` (
	`id` int AUTO_INCREMENT NOT NULL,
	`permission_code` varchar(255) NOT NULL,
	`description` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `permission_permission_code_unique` UNIQUE(`permission_code`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role_id` int NOT NULL,
	`status` enum('active','blocked') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `role_permission` (
	`id` int AUTO_INCREMENT NOT NULL,
	`role_id` int NOT NULL,
	`permission_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `role_permission_id` PRIMARY KEY(`id`),
	CONSTRAINT `role_permission_role_id_permission_id_unique` UNIQUE(`role_id`,`permission_id`)
);
--> statement-breakpoint
CREATE TABLE `template_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `template_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `template_category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `schema_json` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schema_type` enum('template','form') NOT NULL,
	`content` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schema_json_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `schema_media` (
	`id` int AUTO_INCREMENT NOT NULL,
	`schema_id` int NOT NULL,
	`media_type` enum('signature','image','document') NOT NULL,
	`signature_base64` mediumtext,
	`file_key` varchar(500),
	`file_url` varchar(1000),
	`file_name` varchar(255),
	`mime_type` varchar(100),
	`file_size` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `schema_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_by_id` int NOT NULL,
	`approved_by_id` int,
	`rejection_reason` varchar(255),
	`category_id` int NOT NULL,
	`pricing_type` enum('free','paid') NOT NULL,
	`description` text,
	`guideline` json,
	`review_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`status` enum('active','blocked'),
	`downloads` int NOT NULL DEFAULT 0,
	`schema_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `template_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`owner_id` int NOT NULL,
	`description` text,
	`source_template_id` int,
	`schema_id` int NOT NULL,
	`is_collecting` boolean NOT NULL DEFAULT false,
	`collect_token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `form_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form_share` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`form_id` int NOT NULL,
	`subject_type` enum('user','link') NOT NULL,
	`permission` enum('view','edit') NOT NULL,
	`token` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `form_share_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `form_submission` (
	`id` int AUTO_INCREMENT NOT NULL,
	`form_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`submitted_data` json NOT NULL,
	`filled_schema` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `form_submission_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`actor_id` int,
	`type` enum('form_shared','community_review','system_update') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`action_url` varchar(500),
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD CONSTRAINT `user_role_id_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_role_id_role_id_fk` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_permission_id_permission_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `schema_media` ADD CONSTRAINT `schema_media_schema_id_schema_json_id_fk` FOREIGN KEY (`schema_id`) REFERENCES `schema_json`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template` ADD CONSTRAINT `template_created_by_id_user_id_fk` FOREIGN KEY (`created_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template` ADD CONSTRAINT `template_approved_by_id_user_id_fk` FOREIGN KEY (`approved_by_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template` ADD CONSTRAINT `template_category_id_template_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `template_category`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `template` ADD CONSTRAINT `template_schema_id_schema_json_id_fk` FOREIGN KEY (`schema_id`) REFERENCES `schema_json`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form` ADD CONSTRAINT `form_owner_id_user_id_fk` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form` ADD CONSTRAINT `form_source_template_id_template_id_fk` FOREIGN KEY (`source_template_id`) REFERENCES `template`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form` ADD CONSTRAINT `form_schema_id_schema_json_id_fk` FOREIGN KEY (`schema_id`) REFERENCES `schema_json`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_share` ADD CONSTRAINT `form_share_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_share` ADD CONSTRAINT `form_share_form_id_form_id_fk` FOREIGN KEY (`form_id`) REFERENCES `form`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `form_submission` ADD CONSTRAINT `form_submission_form_id_form_id_fk` FOREIGN KEY (`form_id`) REFERENCES `form`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_actor_id_user_id_fk` FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;