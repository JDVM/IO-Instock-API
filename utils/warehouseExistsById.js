const knexConfig = require('../knexfile').development; 
const knex = require('knex')(knexConfig);

const warehouseExistsById = async (warehouse_id) => {
    try {
        const count = await knex("warehouses")
            .where("id", warehouse_id)
            .count("id as count")
            .first()
            return count.count > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { warehouseExistsById };