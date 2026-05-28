import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name: username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res
      .status(201)
      .json({ message: 'User registered successfully', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).json({ message: 'Please Register First' });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingUser?.password ?? '',
    );

    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credentials!' });
    }

    const token = jwt.sign(
      {
        userId: existingUser?._id,
        role: existingUser?.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' },
    );

    res.json({ token, role: existingUser?.role });
  } catch (error) {
    console.log('Error: ', error);

    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
