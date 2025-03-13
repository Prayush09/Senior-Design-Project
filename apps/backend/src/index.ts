import express from 'express';
import cors from './middleware/cors';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(express.json());
app.use(cors);

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
