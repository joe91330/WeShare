const userModel = require('../models/userModel')
const fs = require('fs');
const util = require('../utils/util')
require('dotenv').config();

module.exports = {
    signin: async (req, res) => {
        const { phone, password } = req.body;
        if ( !phone || !password ) {
            return res.status(400).json({ error: 'Phone and password are required' });
        }
        const result = await userModel.signin(res, phone, password);
        if ( !result.user ) {
            return res.status(403).json({ error: result }); 
        } else {
            return res.status(200).json({ data: result }); 
        }
    },
    signup: async (req, res) => {
        const { name, phone, password } = req.body;
        if ( !name || !phone || !password ) {    
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const existUser = await userModel.findUser(res,phone);
        if ( existUser ) {
            return res.status(403).json({ error: 'Phone already exists' });
        }
        const pic_path = `http://${process.env.ip}/static/default.png`;
        const result = await userModel.signup(res,name,phone,password,pic_path)
        return res.status(200).json({ data: result })
    },
    updateProfileName: async (req, res) => {
        const my_ID = req.user.id;
        const { name } = req.body;
        const result = await userModel.updateProfileName(res,my_ID,name)
        return res.status(200).json({ data: result })
    },
    updateProfilePic: async (req, res) => {
        const my_ID = req.user.id;
        console.log("FILE:",req.file)
        const file_name = (req.file.originalname).split('.');
        console.log(file_name)
        const randomStr = util.generateRandomString(5)
        const pic_path = `http://${process.env.ip}/static/user_${my_ID}_${randomStr}.${file_name[file_name.length-1]}`;
        fs.rename(`static/${req.file.originalname}`, `static/user_${my_ID}_${randomStr}.${file_name[file_name.length-1]}`, (err) => {
            if (err) {
              console.error('重命名文件失敗:', err);
            }
        });
        const result = await userModel.updateProfilePic(res,my_ID,pic_path)
        return res.status(200).json({ data: result })
    },
    getProfile: async (req, res) => {
        const user_ID = req.params.id
        const user_info = await userModel.getUserInfo(res,user_ID)
        const user_item = await userModel.getUserItem(res,user_ID)
        const user_fan = await userModel.getUserFan(res,user_ID)
	    try {
        	user_info.user.item.push(...user_item)
            user_info.user.fans.push(...user_fan)
		    console.log(user_info)
        	return res.status(200).json({ data: user_info })
	    } catch (err) {
            console.log("GetProfile報錯：ID為",user_ID)
		    return res.status(403).json({ error: "ID為${user_ID}的使用者不存在" })
	    }
    },
    addTest: async (req,res) => {
        const result = await userModel.addTest(res)
        return res.status(200).json({ data: result })
    },
    giveRating: async (req,res) => {
        const sender_id = req.user.id
        const receiver_id = req.params.id
        const { rating } = req.body
        const result = await userModel.giveRating(res,sender_id,receiver_id,rating)
        await userModel.updateAvgRating(res,receiver_id,)
        return res.status(200).json({ data: result })
    },
}
