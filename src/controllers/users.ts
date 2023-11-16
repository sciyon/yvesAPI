import express from 'express';

import { deleteUserById, getUsers, getUserById } from '../db/users';

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     description: Gets all users
 *     responses:
 *       200:
 *         description: Successfully returned all users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error.
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - username
 *        - email
 *        - authentication
 *      properties:
 *        username:
 *          type: string
 *          description: The username of the user.
 *        email:
 *          type: string
 *          description: The email of the user.
 *        authentication:
 *          type: object
 *          properties:
 *            password:
 *              type: string
 *            salt:
 *              type: string
 *            sessionToken:
 *              type: string
 */
export const getAllUsers = async (req: express.Request, res: express.Response) => {
  
  try {

    const users = await getUsers();

    return res.status(200).json(users);

  } catch (error) {

    console.log(error);
    return res.sendStatus(400);
    
  }
}

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     description: Deletes a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error.
 */
export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const{ id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     description: Updates a user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error.
 */
export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const{ id } = req.params;
    const{ username } = req.body;

    if(!username){
      return res.sendStatus(400);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.sendStatus(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}