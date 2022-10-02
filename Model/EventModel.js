import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true
    },
    eventCreater: {
        type: String,
        require: true
    },
    startdate: {
        type: Date,
        require: true
    },
    enddate: {
        type: Date,
        require: true
    },
    eventType: {
        type: String,
        require: true
    },
    location: {
        type: String,
        require: true
    },
    eventDescription: {
        type: String,
        require: true
    },
    eventPoster: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    }

})

eventSchema.index({ location: 'text' });
const eventModel = mongoose.model("eventModel", eventSchema);
eventModel.createIndexes();
export default eventModel;