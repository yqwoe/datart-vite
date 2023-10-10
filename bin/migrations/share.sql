-- ----------------------------
-- Table structure for data_mapping
-- ----------------------------
DROP TABLE IF EXISTS `share`;
CREATE TABLE `share` (
                         `id` varchar(32) NOT NULL,
                         `org_id` varchar(32) DEFAULT NULL COMMENT '组织id',
                         `viz_type` varchar(32) DEFAULT NULL,
                         `viz_id` varchar(32) DEFAULT NULL,
                         `authentication_mode` varchar(32) DEFAULT NULL,
                         `row_permission_by` varchar(255) DEFAULT NULL,
                         `expiry_date` timestamp NULL DEFAULT NULL,
                         `create_by` varchar(32) DEFAULT NULL,
                         `create_time` timestamp NULL DEFAULT NULL,
                         `roles` text,
                         `authentication_code` varchar(512) DEFAULT NULL,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='分项表';
