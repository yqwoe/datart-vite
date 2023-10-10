
-- ----------------------------
-- Table structure for meta
-- ----------------------------
DROP TABLE IF EXISTS `meta`;
CREATE TABLE `meta` (
                        `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                        `org_id` varchar(32) DEFAULT NULL COMMENT '组织ID',
                        `name` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '显示名称',
                        `code` varchar(256) DEFAULT NULL COMMENT '类型代码',
                        `config` text COMMENT '映射信息',
                        `create_by` varchar(32) DEFAULT NULL,
                        `create_time` timestamp NULL DEFAULT NULL,
                        `update_by` varchar(32) DEFAULT NULL,
                        `is_folder` tinyint DEFAULT NULL,
                        `parent_id` varchar(32) DEFAULT NULL,
                        `index` double DEFAULT NULL,
                        `status` tinyint DEFAULT '1',
                        PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

BEGIN;
INSERT INTO `meta` VALUES ('213448850de542589b5624a4d3d57238', '236e569cb850445083bf140c431716a1', '字符串', 'string', '[{\"name\":\"mysql\",\"value\":\"VARCHAR\",\"len\":1024},{\"name\":\"oracle\",\"value\":\"VARCHAR2\",\"len\":1024},{\"name\":\"sqlserver\",\"value\":\"VARCHAR\",\"len\":1024},{\"name\":\"postgresql\",\"value\":\"VARCHAR\",\"len\":1024},{\"name\":\"db2\",\"value\":\"VARCHAR\",\"len\":1024},{\"name\":\"dm\",\"value\":\"VARCHAR2\",\"len\":1024},{\"name\":\"kingbase\",\"value\":\"VARCHAR\",\"len\":1024},{\"name\":\"java\",\"value\":\"String\",\"len\":1024}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:27:50', '943ce4c78f9f496895d0a54cf84bef63', NULL, NULL, NULL, 1);
INSERT INTO `meta` VALUES ('9d80d29667934212a0e6db3a35fa085d', '236e569cb850445083bf140c431716a1', '整数', 'int', '[{\"value\":\"INT\",\"name\":\"mysql\"},{\"value\":\"INT\",\"name\":\"oracle\"},{\"value\":\"INT\",\"name\":\"sqlserver\"},{\"value\":\"INTEGER\",\"name\":\"postgresql\"},{\"value\":\"INT\",\"name\":\"db2\"},{\"value\":\"INTEGER\",\"name\":\"dm\"},{\"value\":\"INT4\",\"name\":\"kingbase\"},{\"value\":\"Integer\",\"name\":\"java\"}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:30:55', NULL, NULL, NULL, NULL, 1);
INSERT INTO `meta` VALUES ('a2388d037d784ec4998ec4a8b6b69fde', '236e569cb850445083bf140c431716a1', '小数', 'double', '[{\"name\":\"mysql\",\"value\":\"DECIMAL\"},{\"value\":\"DECIMAL\",\"name\":\"oracle\"},{\"value\":\"DECIMAL\",\"name\":\"sqlserver\"},{\"value\":\"NUMERIC\",\"name\":\"postgresql\"},{\"name\":\"db2\",\"value\":\"DECIMAL\"},{\"name\":\"dm\",\"value\":\"DECIMAL\"},{\"name\":\"kingbase\",\"value\":\"NUMERIC\"},{\"name\":\"java\",\"value\":\"Double\"}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:29:25', NULL, NULL, NULL, NULL, 1);
INSERT INTO `meta` VALUES ('cd3b89fea684479ea6c90888e99ec9a9', '236e569cb850445083bf140c431716a1', '进制', 'bytes', '[{\"value\":\"BLOB\",\"name\":\"mysql\"},{\"value\":\"BLOB\",\"name\":\"oracle\"},{\"value\":\"VARBINARY\",\"name\":\"sqlserver\"},{\"value\":\"BYTEA\",\"name\":\"postgresql\"},{\"value\":\"BLOB\",\"name\":\"db2\"},{\"value\":\"BLOB\",\"name\":\"dm\"},{\"value\":\"BYTEA\",\"name\":\"kingbase\"},{\"value\":\"byte[]\",\"name\":\"java\"}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:38:24', NULL, NULL, NULL, NULL, 1);
INSERT INTO `meta` VALUES ('ce6650e5c4cc4e52b972e51db78d999a', '236e569cb850445083bf140c431716a1', '大文本', 'large Text', '[{\"value\":\"TEXT\",\"name\":\"mysql\"},{\"value\":\"CLOB\",\"name\":\"oracle\"},{\"value\":\"TEXT\",\"name\":\"sqlserver\"},{\"value\":\"TEXT\",\"name\":\"postgresql\"},{\"value\":\"CLOB\",\"name\":\"db2\"},{\"value\":\"CLOB\",\"name\":\"dm\"},{\"value\":\"TEXT\",\"name\":\"kingbase\"},{\"value\":\"String\",\"name\":\"java\"}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:39:40', NULL, NULL, NULL, NULL, 1);
INSERT INTO `meta` VALUES ('d7cee4e8e07c4fce9973ee7d1ecdfc40', '236e569cb850445083bf140c431716a1', '日期', 'date', '[{\"value\":\"DATETIME\",\"name\":\"mysql\"},{\"value\":\"DATE\",\"name\":\"oracle\"},{\"value\":\"DATETIME\",\"name\":\"sqlserver\"},{\"value\":\"DATE\",\"name\":\"postgresql\"},{\"value\":\"DATE\",\"name\":\"db2\"},{\"value\":\"DATE\",\"name\":\"dm\"},{\"value\":\"DATE\",\"name\":\"kingbase\"},{\"value\":\"Date\",\"name\":\"java\"}]', '943ce4c78f9f496895d0a54cf84bef63', '2021-11-10 09:36:37', NULL, NULL, NULL, NULL, 1);
COMMIT;

-- ----------------------------
-- Table structure for job
-- ----------------------------
DROP TABLE IF EXISTS `job`;
CREATE TABLE `job` (
                       `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                       `org_id` varchar(32) DEFAULT NULL COMMENT '组织ID',
                       `name` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '显示名称',
                       `active` tinyint(4) NOT NULL,
                       `config` text COMMENT '任务配置信息',
                       `cron_expression` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
                       `start_date` timestamp(0) NULL DEFAULT NULL,
                       `end_date` timestamp(0) NULL DEFAULT NULL,
                       `create_by` varchar(32) DEFAULT NULL,
                       `create_time` timestamp NULL DEFAULT NULL,
                       `update_time` timestamp NULL DEFAULT NULL,
                       `update_by` varchar(32) DEFAULT NULL,
                       `is_folder` tinyint DEFAULT NULL,
                       `parent_id` varchar(32) DEFAULT NULL,
                       `index` double DEFAULT NULL,
                       `status` tinyint DEFAULT '1',
                       `batch` int DEFAULT '0' COMMENT '执行批次',
                       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- ----------------------------
-- Table structure for job_log
-- ----------------------------
DROP TABLE IF EXISTS `job_log`;
CREATE TABLE `job_log`  (
                            `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                            `job_detail_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                            `executor_url` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                            `message` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
                            `create_time` timestamp NULL DEFAULT NULL,
                            `update_time` timestamp NULL DEFAULT NULL,
                            `status` int DEFAULT NULL COMMENT '任务状态',
                            `thread_id` bigint DEFAULT NULL COMMENT '线程id',
                            `task_id` varchar(128) DEFAULT NULL COMMENT 'job中每个任务的id',
                            `batch` int DEFAULT NULL COMMENT '批次',
                            PRIMARY KEY (`id`) USING BTREE,
                            INDEX `job_detail_id`(`job_detail_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;




ALTER TABLE `job_log`
    CHANGE `job_detail_id` `job_id`  varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL

-- ----------------------------
-- Table structure for job_task
-- ----------------------------
DROP TABLE IF EXISTS `job_task`;
CREATE TABLE `job_task` (
                            `id` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                            `org_id` varchar(32) DEFAULT NULL COMMENT '组织ID',
                            `job_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
                            `name` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '显示名称',
                            `config` text COMMENT '任务配置信息',
                            `state` text COMMENT '任务配置信息',
                            `create_by` varchar(32) DEFAULT NULL,
                            `create_time` timestamp NULL DEFAULT NULL,
                            `update_time` timestamp NULL DEFAULT NULL,
                            `update_by` varchar(32) DEFAULT NULL,
                            `status` tinyint DEFAULT 2 COMMENT '任务状态 1挂起 2执行',
                            `batch` int DEFAULT 0 COMMENT '批次',
                            PRIMARY KEY (`id`) USING BTREE,
                            KEY `job_id` (`job_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;
