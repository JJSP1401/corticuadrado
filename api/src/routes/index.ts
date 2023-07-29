import { Router } from 'express';
import  Users from './user.routes';
const router = Router();

router.use('/users', Users);

export default router;
