const util = require('../utils/util')
const { db } = require('../utils/util');

module.exports = {
    addFollow: async ( res, follow_ID, befollow_ID ) => {
        try {
            const sql = `INSERT INTO fan (follow_id, befollow_id) VALUES (?,?)`
            const [results] = await db.query(sql, [follow_ID,befollow_ID])
            const data = {
                id: results.insertId
            }
            return data
        } catch (err) {
            return util.databaseError(err,'addFollow',res);
        }
    },

    deleteFollow: async ( res, follow_ID, befollow_ID ) => {
        try {
            const sql = `DELETE FROM fan WHERE follow_id = ? AND befollow_id = ?`
            await db.query(sql, [follow_ID,befollow_ID])
            const data = {
                user: {
                    id: befollow_ID
                }
            }
            return data
        } catch (err) {
            return util.databaseError(err,'deleteFollow',res);
        }
    }
}
