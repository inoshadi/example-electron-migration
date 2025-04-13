class CreateUserHasRoles {
    //properties
    static tableInit = 'user_has_roles'
    static type = 'create'

    static upSql = 'CREATE TABLE `:tablename` (\n' +
        '  `id` int unsigned NOT NULL AUTO_INCREMENT,\n' +
        '  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `created_at` timestamp NULL DEFAULT NULL,\n' +
        '  `updated_at` timestamp NULL DEFAULT NULL,\n' +
        '  `deleted_at` timestamp NULL DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  UNIQUE KEY `user_has_roles_user_id_role_id_unique` (`user_id`, `role_id`)\n' +
        ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'

    static downSql = " DROP TABLE :tablename "

    //constructor
    constructor(sequelize, prefix = 'wid_') {
        this.sequelize = sequelize
        this.table = prefix + this.constructor.tableInit
        this.action = this.constructor.type
        return this
    }

    // public methods
    async up() {
        //
        return await this.sequelize.query(this.getUpSql().replaceAll("\n", ""))
    }
    async down() {
        // 
        return await this.sequelize.query(this.getDownSql().replaceAll("\n", ""))
    }

    getUpSql() {
        return this.constructor.upSql.replaceAll(":tablename", this.table)
    }
    getDownSql() {
        return this.constructor.downSql.replaceAll(":tablename", this.table)
    }

}

export default CreateUserHasRoles