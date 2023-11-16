import express from 'express';

import { getUserByEmail, createUser  } from '../db/users';
import { authentication, random } from '../helpers';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully registered user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error.
 */
export const register = async( req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if(!email || !password || !username){
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if(existingUser){
      return res.sendStatus(400);
    }

    const salt=random();
    const user = await createUser({
      email,
      username,
      authentication:{
        salt,
        password: authentication(salt, password),
      }
    })

    return res.status(200).json(user).end();

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error.
 */
export const login =async (req: express.Request, res: express.Response) => {
  try{
    const { email, password } = req.body;

    if(!email || !password){
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if(!user){
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if(user.authentication.password !== expectedHash){
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());

    await user.save();

    res.cookie('ERWIN-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/'});

    return res.status(200).json(user).end();

  }catch(error){
    console.log(error);
    return res.sendStatus(400);
  }
}