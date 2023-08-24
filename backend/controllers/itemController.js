const itemModel = require('../models/itemModel');
const fs = require('fs');
const redis = require('../utils/redis');
const util = require('../utils/util')
require('dotenv').config();

module.exports = {
    addItem: async (req, res) => {
        const seller_id = req.user.id;
        const { buyers_limit, title, image, introduction, cost, tag, costco, location, latitude, longitude, expires_at } = req.body;
        if ( !buyers_limit || !title || !image || !introduction || !cost || !tag || !location || !latitude || !longitude ) {    
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await itemModel.addItem(res, seller_id, buyers_limit, title, introduction, cost, tag, costco, location, latitude, longitude, expires_at);
        const file_name = image.split('.');
        const randomNum = util.generateRandomString(5);
        fs.rename(`static/${image}`, `static/item_${result.id}_${randomNum}.${file_name[file_name.length-1]}`, (err) => {
            if (err) {
              console.error('重命名文件失敗:', err);
            }
        });
        const pic_path = `http://${process.env.ip}/static/item_${result.id}_${randomNum}.${file_name[file_name.length-1]}`;
        const update_url = await itemModel.updateItemImage(res, result.id, pic_path);
        return res.status(200).json({ item: result });
    },

    addItemImage: async (req, res) => {
        const image = req.file;
        if(!image){
            return res.status(400).json({
                message: 'No image provided.'
            })
        }
        return res.status(200).json({ item: {image: req.file.originalname} });
    },    

    getItem: async (req, res) => {
        const item_id = parseInt(req.params.id);
        if(!item_id){
            res.status(400).json({ error: 'Lost Item ID!!!' })
        }
        const cacheKey = `item_${item_id}`;
        const cache_item = await redis.get_cache(cacheKey);
        if(cache_item){
            return res.status(200).json({
                data: {
                    message: "Get cache item!",
                    item: cache_item
                }
            });
        }
        else{
            const item = await itemModel.getItem(res, item_id);
            const set_cache = await redis.set_cache(cacheKey, item);
            console.log(set_cache);
            return res.status(200).json({ data: { item: item }});
        }
    },

    getBuyItems: async (req, res) => {
        const user_id = req.user.id;
        const item = await itemModel.getBuyItems(res, user_id);
        return res.status(200).json({ data: { items: item }});
    },
    
    getItems: async (req, res) => {
        const keyword = req.query.keyword;
        const tag = req.query.tag;
        const latitude = req.query.latitude;
        const longitude = req.query.longitude;
        let cursor = req.query.cursor;
        let jsonObject = '';
        if(cursor){
            // 將 Base64 字符串解碼為 Buffer
            const buffer = Buffer.from(cursor, 'base64');
            const decodedString = buffer.toString('utf-8');
            jsonObject = JSON.parse(decodedString);
        }
        const limit = 10;
        console.log(jsonObject.item_id, limit, latitude, longitude, keyword, tag);
        let result = await itemModel.getItems(res, jsonObject.item_id, limit, latitude, longitude, keyword, tag);
        let base64String = '';
        if(result.length == (limit + 1)){
            const last_index = result.length - 1;
            const next_cursor = {
                'item_id': result[last_index].id
            }
            const jsonString = JSON.stringify(next_cursor);
            base64String = Buffer.from(jsonString).toString('base64');
            //刪掉第11篇
            result.pop();
        }
        else{
            base64String = null;
        }
        return res.status(200).json({ 'data':{
            'items': result,
            'next_cursor': base64String
        }})
    },

    checkAuth: async (req, res, item_id) => {
        const seller_id = await itemModel.getSeller(res, item_id);
        if( req.user.id !== seller_id.seller_id){
            return res.status(400).json({ error: 'Insufficient permissions!' });
        }
    },

    updateItem: async (req, res) => {
        const item_id = parseInt(req.params.id);
        const seller_id = await itemModel.getSeller(res, item_id);
        if( req.user.id !== seller_id.seller_id){
            return res.status(400).json({ error: 'Insufficient permissions!' });
        }
        const { title, introduction, cost, tag, location, latitude, longitude } = req.body;
        const cacheKey = `item_${item_id}`;
        const item_cache = await redis.get_cache(cacheKey);
        if(item_cache){
            item_cache['title'] = title;
            item_cache['introduction'] = introduction;
            item_cache['cost'] = cost;
            item_cache['tag'] = tag;
            item_cache['location'] = location;
            item_cache['latitude'] = latitude;
            item_cache['longitude'] = longitude;
            try {
                await redis.set_cache(cacheKey, item_cache);
            } catch (err) {
                return res.status(400).json({ error: 'Set cache error!' });
            }
        }
        const result = await itemModel.updateItem( res, item_id, title, introduction, cost, tag, location, latitude, longitude);
        return res.status(200).json({ item: result });
    },

    updateItemImage: async (req, res) => {
        const image = req.file;
        const item_id = parseInt(req.params.id);
        const seller_id = await itemModel.getSeller(res, item_id);
        if( req.user.id !== seller_id.seller_id){
            return res.status(400).json({ error: 'Insufficient permissions!' });
        }
        if(!image){
            return res.status(400).json({
                message: 'No image provided.'
            })
        }
        const file_name = (req.file.originalname).split('.');
        const randomNum = util.generateRandomString(5);
        fs.rename(`static/${req.file.originalname}`, `static/item_${item_id}_${randomNum}.${file_name[file_name.length-1]}`, (err) => {
            if (err) {
              console.error('重命名文件失敗:', err);
            }
        });
        const pic_path = `http://${process.env.ip}/static/item_${item_id}_${randomNum}.${file_name[file_name.length-1]}`;
        const cacheKey = `item_${item_id}`;
        const item_cache = await redis.get_cache(cacheKey);
        if(item_cache){
            item_cache['image'] = pic_path;
            try {
                await redis.set_cache(cacheKey, item_cache);
            } catch (err) {
                return res.status(400).json({ error: 'Set cache error!' });
            }
        }
        const result = await itemModel.updateItemImage(res, item_id, pic_path);
        return res.status(200).json({ item: result });
    }
}
