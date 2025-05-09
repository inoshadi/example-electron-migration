class CreateUsers {
    //properties
    static tableInit = 'users'
    static type = 'create'

    static upSql = 'CREATE TABLE `:tablename` (\n' +
        '  `id` CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `username` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `email` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n' +
        '  `password` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `remember_token` VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,\n' +
        '  `created_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  `updated_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  `deleted_at` TIMESTAMP NULL DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  UNIQUE KEY `:tablename_username_unique` (`username`)\n' +
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

export default CreateUsers