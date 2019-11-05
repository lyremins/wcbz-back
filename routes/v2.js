'use strict';

import express from 'express';
import User from '../controller/v2/user'
const router = express.Router();

router.post('/login', User.login);
router.get('/signout', User.signout);
router.post('/changepassword', User.chanegPassword);


export default router