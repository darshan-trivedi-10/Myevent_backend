import eventModel from "../Model/EventModel.js";

export const createEvent = async (req, res) => {
    try {
        const newEvent = new eventModel({
            name: req.body.name,
            userId: req.body.userId,
            eventCreater: req.body.eventCreater,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            eventType: req.body.eventType,
            location: req.body.location,
            eventDescription: req.body.eventDescription,
            eventPoster: req.body.eventPoster,
            price: req.body.price
        })
        await newEvent.save();
        res.status(200).json("Event create Successfully")
    } catch (error) {
        console.log(error)
        res.status(500).json(error.message)
    }
}

export const getAllEvent = async (req, res) => {
    try {
        const events = await eventModel.find();
        if (events) {
            res.status(200).json(events);
        } else {
            res.status(200).json("Event Not available");
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const getEventByCity = async (req, res) => {
    const city = req.params.city;
    try {
        const events = await eventModel.find({ $text: { $search: city } })
        if (events.length !== 0) {
            res.status(200).json(events)
        } else {
            res.status(200).json("events not available")
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const getEventByDate = async (req, res) => {

}

export const getEventBycityAndDate = async (req, res) => {

}

export const getEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await eventModel.findById(id);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json(error.message)
    }

}

export const updateEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await eventModel.findById(id);
        if (event) {
            await event.update({ $set: req.body });
            res.status(200).json("Post Updated")
        } else {
            res.status(200).send("Event Not available")
        }

    } catch (error) {
        res.status(500).json(error.message)
    }

}

export const deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await eventModel.findByIdAndDelete(id);
        res.status(200).json("event Delete Successfully");
    } catch (error) {
        res.status(500).json(error.message)
    }
}


export const getMyevent = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    try {
        const events = await eventModel.find({
            userId: id
        })
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json(error);
    }
}