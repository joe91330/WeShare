const eventModel = require('../models/eventModel');

module.exports = {
    getEvent: async (req, res) => {
        const id = req.user.id;
        const events = await eventModel.getEvent(res, id);
        return res.status(200).json( { data: { event: events }});
    },
    getNumOfEvent: async (res, req) => {
        const id = req.user.id;
        const event = await eventModel.getNumOfEvent(res, id);
        return res.status(200).json( { data: { event: event}} );
    },
    readEvent: async (req, res) => {
        const event_id = parseInt(req.params.event_id);
        const event = await eventModel.readEvent(res, event_id);
        return res.status(200).json( { data: { event: event}} );
    }
}