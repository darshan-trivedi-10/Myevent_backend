import express from "express"
import { createEvent, getAllEvent, getEventByCity, getEventByDate, getEventBycityAndDate, getEvent, updateEvent, deleteEvent, getMyevent } from '../Controller/eventController.js'
import authMiddleware from "../Middleware/authMiddleware.js";
authMiddleware;

const eventRouter = express.Router();



eventRouter.post('/create', authMiddleware, createEvent);
eventRouter.get('/allevent', getAllEvent);
eventRouter.get('/myevent/:id', authMiddleware, getMyevent);
eventRouter.get('/city/:city', getEventByCity);
eventRouter.get('/date/:date', getEventByDate);
eventRouter.post('/EventByDateAndCity', getEventBycityAndDate);
eventRouter.get('/:id', getEvent);
eventRouter.put('/:id', authMiddleware, updateEvent);
eventRouter.delete('/:id', authMiddleware, deleteEvent);

export default eventRouter;