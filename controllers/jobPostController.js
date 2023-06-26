import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';
import checkPermissions from '../utils/checkPermissions.js';
import JobPost from '../models/JobPost.js';

export const getAllJobPosts = async (req, res) => {
  const { search, jobType, sort } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobPosts = await JobPost.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);

  const totalJobPosts = await JobPost.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobPosts / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobPosts, numOfPages, currentPage: page, jobPosts });
};

export const createJobPost = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const jobPost = await JobPost.create(req.body);

  res.status(StatusCodes.CREATED).json({ jobPost });
};

export const getJobPost = async (req, res) => {
  const { id } = req.params;
  const jobPost = await JobPost.findById(id);
  if (!jobPost) {
    throw new NotFoundError(`no job post with id ${id}`);
  }

  checkPermissions(req.user, jobPost.createdBy);

  res.status(StatusCodes.OK).json({ job });
};

export const updateJobPost = async (req, res) => {
  const { id } = req.params;

  const jobPost = await JobPost.findById(id);

  if (!jobPost) {
    throw new NotFoundError(`no job post with id ${id}`);
  }

  checkPermissions(req.user, job.createdBy);

  const updatedJobPost = await JobPost.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ job: updatedJobPost });
};

export const deleteJobPost = async (req, res) => {
  const { id } = req.params;
  const jobPost = await JobPost.findById(id);

  if (!jobPost) {
    throw new NotFoundError(`no job post with id ${id}`);
  }

  checkPermissions(req.user, jobPost.createdBy);

  const removedJob = await JobPost.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ job: removedJob });
};
