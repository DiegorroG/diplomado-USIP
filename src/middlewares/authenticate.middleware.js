import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authentication header', authHeader);

    const token  = authHeader && authHeader.split(' ')[1];
    console.log('token', token);

    if (!token) return res.sendStatus(401); //forbiden

    const secret = process.env.JWT_SECRET

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log('error', err);
            return res.sendStatus(403);
        }
        // si el token es valid
        console.log('user', user)
        
        req.user = user;
        next();
    });
}