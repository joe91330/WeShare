const itemModel = require('../models/itemModel');
const fs = require('fs');
require('dotenv').config();

module.exports = {
    addItem: async (req, res) => {
        const seller_id = req.user.id;
        const { buyers_limit, title, introduction, cost, tag, costco, location, expires_at } = req.body;
        if ( !buyers_limit || !title || !introduction || !cost || !tag || !costco || !location || !expires_at) {    
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await itemModel.addItem(res, seller_id, buyers_limit, title, introduction, cost, tag, costco, location, expires_at);
        return res.status(200).json({ item: result });
    },
    getItem: async (req, res) => {
        const item_id = parseInt(req.params.id);
        const item = await itemModel.getItem(res, item_id);
        return res.status(200).json({ item: item });
    },
    getItems: async (req, res) => {
        let cursor = req.query.cursor;
        let jsonObject = '';
        if(cursor){
            // 將 Base64 字符串解碼為 Buffer
            const buffer = Buffer.from(cursor, 'base64');
            const decodedString = buffer.toString('utf-8');
            jsonObject = JSON.parse(decodedString);
        }
        const limit = 10;
        let result = await itemModel.getItems(res, jsonObject.item_id, limit);
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
    updateItem: async (req, res) => {
        const item_id = parseInt(req.params.id);
        const seller_id = await itemModel.getSeller(res, item_id);
        if( req.user.id !== seller_id.seller_id){
            return res.status(400).json({ error: 'Insufficient permissions!' });
        }
        const { title, introduction, cost, tag, costco, location, expires_at } = req.body;
        const result = await itemModel.updateItem( res, item_id, title, introduction, cost, tag, costco, location, expires_at);
        return res.status(200).json({ item: result });
    },
    updateItemPhoto: async (req, res) => {
        const image = req.file;
        const item_id = parseInt(req.params.id);
        if(!image){
            return res.status(400).json({
                message: 'No image provided.'
            })
        }
        const file_name = (req.file.originalname).split('.');
        fs.rename(`public/images/${req.file.originalname}`, `public/images/item_${item_id}.${file_name[file_name.length-1]}`, (err) => {
            if (err) {
              console.error('重命名文件失敗:', err);
            } else {
              console.log('文件重命名成功！');
            }
        });
        const pic_path = `https://${process.env.ip}/images/item_${item_id}.${file_name[file_name.length-1]}`;
        const result = await itemModel.updateItemPhoto(res, item_id, pic_path);
        return res.status(200).json({ item: result });
    }
}