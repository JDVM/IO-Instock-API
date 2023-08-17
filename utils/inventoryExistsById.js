const knexConfig = require('../knexfile').development; 
const knex = require('knex')(knexConfig);

const inventoryExistsById = async (id) => {
    try {
        const count = await knex("inventories")
            .where("id", id)
            .count("id as count")
            .first()
            return count.count > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = { inventoryExistsById };