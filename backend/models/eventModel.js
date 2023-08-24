const util = require('../utils/util')
const { db } = require('../utils/util');

module.exports = {
    addEvent: async (res, item_id, type, order_id, sender_id, recipient_id) => {
        try {
            const sql = 'INSERT INTO event_table (item_id, type, order_id, sender_id, recipient_id) VALUES (?,?,?,?,?)'
            const [results] = await db.query(sql, [item_id, type, order_id, sender_id, recipient_id])
            const event = {
                id: results.insertId, 
            };
            return event;
        } catch (err) {
            return util.databaseError(err,'addEvent',res);
        }
    },
    getEvent: async (res, id) => {
        try {
            const sql = 'SELECT event_table.item_id, event_table.id, event_table.type, event_table.sender_id, event_table.recipient_id, event_table.is_read, DATE_FORMAT(event_table.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, user.name, user.image, order_table.id AS order_id, order_table.quantity, order_table.status, item.title \
            FROM event_table \
            LEFT JOIN user ON event_table.sender_id = user.id \
            LEFT JOIN item ON event_table.item_id = item.id \
            LEFT JOIN order_table ON ( order_table.item_id = event_table.item_id AND (order_table.seller_id = event_table.sender_id AND order_table.buyer_id = event_table.recipient_id) OR (order_table.seller_id = event_table.recipient_id AND order_table.buyer_id = event_table.sender_id)) \
            WHERE event_table.recipient_id = ? ORDER BY event_table.id DESC';
            const [results] = await db.query(sql, [id]);
            if (results.length === 0) {
                return [];
            }
            let events = [];
            results.map(result => {
                const event = {
                    id: result.id, 
                    type: result.type,
                    recipient_id: result.recipient_id,
                    is_read: result.is_read,
                    created_at: result.created_at,
                    order:{
                        id: result.order_id,
                        item_id: result.item_id,
                        title: result.title,
                        quantity: result.quantity,
                        status: result.status
                    }, 
                    user: {
                        name: result.name,
                        image: result.image,
                        sender_id: result.sender_id
                    }
                };
                events.push(event);
            });
            return events; 
        } catch (err) {
            return util.databaseError(err, 'getEvent', res);
        }
    },
    readEvent: async (res, id) => {
        try {
            const sql = 'UPDATE event_table SET is_read = TRUE WHERE id = ?';
            const [results] = await db.query(sql, [id]);
            const event = {
                id: id, 
            };
            return event;
        } catch (err) {
            return util.databaseError(err, 'readEvent', res);
        }
    },
    getNumOfEvent: async (res, id) => {
        try {
            const sql = "SELECT COUNT(*) AS Num_Of_Event FROM event_table WHERE status = 'FALSE' AND recipient_id = ?";
            const [result] = await db.query(sql, [id]);
            const event = {
                quantity: result.Num_Of_Event
            };
            return event;
        } catch (err) {
            return util.databaseError(err, 'getNumOfEvent', res);
        }
    }    
}