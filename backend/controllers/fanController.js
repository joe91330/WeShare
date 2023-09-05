const fanModel = require('../models/fanModel')

module.exports = {
    addFollow: async (req, res) => {
        const follow_ID = req.user.id
        const befollow_ID = req.params.id;
        const result = await fanModel.addFollow(res,follow_ID,befollow_ID);
        return res.status(200).json({ data: result }); 
    },
    deleteFollow: async (req, res) => {
        const follow_ID = req.user.id
        const befollow_ID = req.params.id;
        const result = await fanModel.deleteFollow(res,follow_ID,befollow_ID);
        return res.status(200).json({ data: result }); 
    }
}
