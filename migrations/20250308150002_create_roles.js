class CreateRoles {
    //properties
    static tableInit = 'roles'
    static type = 'create'

    static upSql = 'CREATE TABLE `:tablename` (\n' +
        '  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,\n' +
        '  `created_at` timestamp NULL DEFAULT NULL,\n' +
        '  `updated_at` timestamp NULL DEFAULT NULL,\n' +
        '  `deleted_at` timestamp NULL DEFAULT NULL,\n' +
        '  PRIMARY KEY (`id`),\n' +
        '  UNIQUE KEY `roles_name_unique` (`name`)\n' +
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
        return await this.sequelize.query(this.getUpSql().replace("\n", ""))
    }
    async down() {
        // 
        return await this.sequelize.query(this.getDownSql().replace("\n", ""))
    }

    getUpSql() {
        return this.constructor.upSql.replace(":tablename", this.table)
    }
    getDownSql() {
        return this.constructor.downSql.replace(":tablename", this.table)
    }

}

export default CreateRoles