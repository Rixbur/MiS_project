import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import Job from '../models/Job.js';
import { promises as fs } from 'fs';
import { UnauthenticatedError } from '../errors/customErrors.js';

export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  console.log('current user: ', user);
  if (!user) {
    throw new UnauthenticatedError('invalid credentials');
  }

  const userWithoutPassword = user.toJSON();

  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
};

export const updateUser = async (req, res) => {
  const cvFile = req.files['cv'][0];
  const avatarFile = req.files['avatar'][0];

  if (cvFile) req.body.cv = `/uploads/${cvFile.filename}`;

  if (avatarFile) req.body.avatar = `/uploads/${avatarFile.filename}`;

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body);

  if (cvFile && updatedUser.cv) {
    await fs.unlink(`public${updatedUser.cv}`);
  }

  if (avatarFile && updatedUser.avatar) {
    await fs.unlink(`public${updatedUser.avatar}`);
  }

  res.status(StatusCodes.OK).json({ msg: 'user updated' });
};
