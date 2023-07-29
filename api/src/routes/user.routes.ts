import { Router } from 'express';
import controller from '../controllers/user.controller';
const router = Router();

router.post('/sign-in', controller.signIn);
router.post('/sign-up', controller.create);
router.get('/list', controller.list);
router.put('/update', controller.update);
router.delete('/delete', controller.delete);


export default router;
