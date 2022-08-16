import { Router } from 'express';
import models from '../../models';
import asyncWrapper from '../../utils/asyncWrapper';

const router = Router();
const { Users } = models;

router.post(
  '/register',
  asyncWrapper(async (req, res) => {
    const { username } = req.body;
    const user = await Users.findOne({ where: { username } });

    if (user) {
      return res
        .status(200)
        .send({ success: false, message: 'User already exists' });
    }

    await Users.createNewUser({ ...req.body });

    return res.status(200).send({
      success: true,
      message: 'User successfully registered',
    });
  })
);

export default router;
