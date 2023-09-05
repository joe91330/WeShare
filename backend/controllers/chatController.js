const chatModel = require('../models/chatModel')

module.exports = {
    getMessage: async (req, res) => {
        const my_ID = req.user.id
        const seller_ID = req.params.id;
        const cursor = req.query.cursor;
        const decode_cursor = cursor === undefined ? 0 : Number(Buffer.from(cursor, 'base64').toString('ascii'))
        console.log("decode_cursor: ",decode_cursor)
        const result = await chatModel.getMessage(res,my_ID, seller_ID,decode_cursor);
        return res.status(200).json({ data: result }); 
    },
    getMessagePreview: async (req, res) => {
        const my_ID = req.user.id
        const cursor = req.query.cursor;
        const decode_cursor = cursor === undefined ? 0 : Number(Buffer.from(cursor, 'base64').toString('ascii'))
        console.log("decode_cursor: ",decode_cursor)
        const result = await chatModel.getMessagePreview(res,my_ID,decode_cursor);
        return res.status(200).json({ data: result }); 
    },
    addTest: async (req,res) => {
        const result = await chatModel.addTest(res)
        return res.status(200).json({ data: result })
    }
}
