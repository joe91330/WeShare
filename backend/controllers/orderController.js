const { getNumOfBuyers, getSeller } = require('../models/itemModel');
const orderModel = require('../models/orderModel');
const eventModel = require('../models/eventModel');
const itemModel = require('../models/itemModel');

module.exports = {
    addOrder: async (req, res) => {
        const buyer_id = req.user.id;
        const item_id = parseInt(req.params.item_id);
        if(!item_id){
            return res.status(400).json({
                error: "Item ID is necessary!"
            })
        }
        const get_seller = await getSeller(res, item_id);
        const seller_id = get_seller.seller_id;
        const quantity = req.body.quantity;
        if(buyer_id === seller_id){
            return res.status(400).json({
                error: "Can't buy own product!"
            })
        }
        const result = await orderModel.addOrder(res, item_id, quantity, seller_id, buyer_id);
        const event = await eventModel.addEvent(res, item_id, '買家下單通知', result.id, buyer_id, seller_id);
        return res.status(200).json({ order: result });
    },
    agreeOrder: async (req, res) => {
        const seller_id = req.user.id;
        const order_id = parseInt(req.params.order_id);
        const order = await orderModel.getOrder(res, order_id);
        if( seller_id !== order.seller_id){
            return res.status(400).json({
                error: "Insufficient permissions!"
            })
        }
        if( order.status !== 'request' ){
            return res.status(400).json({
                error: "Order status error!"
            })
        }
        const checkOrder = await getNumOfBuyers(res, order.item_id);
        if( (checkOrder.num_of_buyers - order.quantity) < 0 ){
            return res.status(400).json({
                error: "Order limit exceeded!"
            })
        }
        const result = await orderModel.agreeOrder(res, order_id);
        const item_update_result = await itemModel.updateNumOfBuyers((checkOrder.num_of_buyers - order.quantity), order.item_id);
        const event = await eventModel.addEvent(res, order.item_id, '交易成功通知', order_id, seller_id, order.buyer_id);
        return res.status(200).json({ order: result });
    },
    getOrders: async (req, res) => {
        const user_id = req.user.id;
        const buy_list = await orderModel.getOrders( res, user_id, false );
        const sell_list = await orderModel.getOrders( res, false, user_id );
        return res.status(200),json({ data: { buy: buy_list, sell: sell_list}});
    },
    delOrder: async (req, res) => {
        const order_id = parseInt(req.params.order_id);
        const order = await orderModel.getOrder(res, order_id);
        const user_id = req.user.id;
        if(user_id !== order.buyer_id && user_id !== order.seller_id){
            return res.status(400).json({
                error: "Insufficient permissions!"
            })
        }
        if(order.status == 'agree'){
            return res.status(400).json({
                error: "Can not delete order after order established."
            })
        }
        const result = await orderModel.delOrder(res, order_id);
        return res.status(200).json({ order: result });
    }
}