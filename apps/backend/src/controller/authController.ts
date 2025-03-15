import {Request, Response} from 'express';
import {loginUser, verifyGoogleToken, registerUser, logoutUser} from '../service/authService';

export const login = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
        const token = await loginUser(email, password);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}

export const googleLogin = async (req: Request, res: Response) => {
    try{
        const { token } = req.body;
        const user = await verifyGoogleToken(token);
        res.status(200).json({ user });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}

export const register = async (req: Request, res: Response) => {
    try{
        const { name, email, password } = req.body;
        const token = await registerUser(name, email, password);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}

export const logout = async (req: Request, res: Response) => {
    try{
        const { email } = req.body;
        const token = await logoutUser(email);
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
}