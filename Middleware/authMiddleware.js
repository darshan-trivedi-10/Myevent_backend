import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SCREATE_KEY;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            const decode = jwt.verify(token, secretKey);
            req.body._id = decode?.id;
        }
        next();
    } catch (error) {
        res.status(403).send('access denied');
    }
}

export default authMiddleware;