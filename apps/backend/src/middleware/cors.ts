import {Request, Response, NextFunction} from 'express';

export default function cors(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Controll-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Authorization, Content-Type'
    );

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');

    if(req.method === 'OPTIONS'){
        res.status(200).end();
        return;
    }

    next();
}