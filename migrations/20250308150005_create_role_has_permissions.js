class CreateRoleHasPermissions {
    //properties
    static tableInit = 'role_has_permissions'
    static type = 'create'

    static upSql = 'CREATE TABLE `:tablename` (\n' +
        '  `id` INT UNSIGNED AUTO_INCREMENT NOT NULL ,\n' +
        '  `role_id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `permission_id` int UNSIGNED NOT NULL,\n' +
        '  `created_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  `updated_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  `deleted_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  UNIQUE KEY `:tablename_role_id_permission_id_unique` (`role_id`, `permission_id`)\n' +
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

export default CreateRoleHasPermissions