const util = require('../utils/util')
const { db } = require('../utils/util');

module.exports = {
    addOrder: async ( res, item_id, quantity, seller_id, buyer_id ) => {
        try {
            const sql = 'INSERT INTO order_table (item_id, quantity, seller_id, buyer_id, status) VALUES (?,?,?,?,?)';
            const [results] = await db.query(sql, [item_id, quantity, seller_id, buyer_id, 'request']);
            const order = {
                id: results.insertId
            };
            return order;
        } catch (err) {
            return util.databaseError(err,'addOrder',res);
        }
    },
    getOrder: async ( res, order_id ) => {
        try {
            const sql = 'SELECT item_id, quantity, seller_id, buyer_id, status, DATE_FORMAT(created_at, "%Y-%m-%d %H:%i:%s") AS created_at FROM order_table WHERE id = ?'
            const [[results]] = await db.query(sql, [order_id]);
            const order = {
                item_id: results.item_id,
                quantity: results.quantity,
                seller_id: results.seller_id, 
                buyer_id: results.buyer_id, 
                status: results.status,
                created_at: results.created_at
            };
            return order;
        } catch (err) {
            return util.databaseError(err,'getOrder',res);
        }
    },
    getItemOrders: async (res, item_id, buyer, seller) => {
        try {
            userCondition = ''
            if (buyer) {
                userCondition = `LEFT JOIN user ON order_table.buyer_id = user.id'`;
            }
            if (seller) {
                userCondition = `LEFT JOIN user ON order_table.seller_id = user.id`;
            }
            const sql = `SELECT order_table.id, order_table.quantity, order_table.seller_id, order_table.buyer_id, order_table.status, DATE_FORMAT(order_table.created_at, "%Y-%m-%d %H:%i:%s") AS created_at, user.id AS user_id, user.name, user.phone, user.image, user.rating \
            FROM order_table \
            ${userCondition} \
            WHERE item_id = ?\
            ORDER BY order_table.id DESC`
            const [[results]] = await db.query(sql, [item_id]);
            if(results.length == 0){
                return [];
            };
            const order = {
                id: results.id,
                item_id: item_id,
                quantity: results.quantity,
                seller_id: results.seller_id, 
                buyer_id: results.buyer_id, 
                status: results.status,
                created_at: results.created_at,
                user: {
                    id: results.user_id,
                    name: results.name,
                    phone: results.phone,
                    image: results.image,                    
                    rating: results.rating
                }
            };
            return order;
        } catch (err) {
            return util.databaseError(err,'getItemOrders',res);
        }
    },
    getOrders: async ( res, buyer_id, seller_id  ) => {
        try {
            let userCondition = '';
            let buyerCondition = '';
            let itemCondition = '';
            let and = '' ;
            if(buyer_id && seller_id){
               return false;
            }
            if(buyer_id){
                buyerCondition = `order_table.buyer_id = ${buyer_id} AND order_table.status = 'agree'`;
                userCondition =  `LEFT JOIN user ON order_table.seller_id = user.id`
            }
            let sellerCondition = ''; 
            if(seller_id){
                sellerCondition = `order_table.seller_id = ${seller_id}`;
                itemCondition = `AND item.num_of_buyers = 0`
                userCondition =  `LEFT JOIN user ON order_table.buyer_id = user.id`
            }
            const sql = `SELECT order_table.id, order_table.item_id, order_table.quantity, order_table.seller_id, order_table.buyer_id, order_table.status, DATE_FORMAT(order_table.created_at, "%Y-%m-%d %H:%i:%s") AS created_at,  \
            item.buyers_limit, item.num_of_buyers, item.title, item.image, item.introduction, item.cost, item.tag, item.item_location, DATE_FORMAT(item.created_at, "%Y-%m-%d %H:%i:%s") AS item_created_at, user.id, user.name, user.phone, user.image, user.rating \
            FROM order_table \
            ${userCondition} \
            LEFT JOIN item ON order_table.item_id = item.id ${itemCondition}\
            WHERE ${buyerCondition} ${sellerCondition}\
            ORDER BY order_table.id DESC`
            const [results] = await db.query(sql, []);
            let orders = [];
            results.map(result => {
                const order = {
                    id: result.id,
                    quantity: result.quantity, 
                    seller_id: result.seller_id, 
                    buyer_id: result.buyer_id, 
                    status: result.status, 
                    created_at: result.created_at,
                    item: {
                        id: result.item_id,
                        buyers_limit: result.buyers_limit,
                        num_of_buyers: result.num_of_buyers,
                        title: result.title,
                        image: result.image, 
                        introduction: result.introduction, 
                        cost: result.cost, 
                        tag: result.tag,
                        location: result.item_location,
                        created_at: result.item_created_at
                    },
                    user: {
                        id: result.seller_id,
                        name: result.name,
                        phone: result.phone,
                        image: result.image,                    
                        rating: result.rating
                    }
                };
                orders.push(order);
            })
            return orders;            
        } catch (err) {
            return util.databaseError(err,'getOrders',res);
        }
    },
    agreeOrder: async ( res, order_id ) => {
        try {
            const sql = 'UPDATE order_table SET status = ? WHERE id = ?';
            const [results] = await db.query(sql, ['agree', order_id]);
            const order = {
                id: order_id
            };
            return order;
        } catch (err) {
            return util.databaseError(err,'agreeOrder',res);
        }
    },
    delOrder: async ( res, order_id ) => {
        try {
            const sql = 'DELETE FROM order_table WHERE id = ?';
            const [results] = await db.query(sql, [order_id]);
            const order = {
                id: order_id
            };
            return order;
        } catch (err) {
            return util.databaseError(err,'delOrder',res);
        }
    }
}