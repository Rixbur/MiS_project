import Job from '../models/Job.js';
import JobApplication from '../models/JobApplication.js';
import User from '../models/User.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthenticatedError } from '../errors/customErrors.js';
import checkPermissions from '../utils/checkPermissions.js';
import { ACCOUNT_ROLE } from '../utils/constants.js';

export const getAllOpenJobs = async (req, res) => {
  const queryNotMyJobs = {
    createdBy: { $ne: req.user.userId },
  };

  const jobs = await Job.find(queryNotMyJobs);
  const applications = await JobApplication.find({
    applicantId: req.user.userId,
  }).populate('jobId');

  if (!jobs) throw new NotFoundError('Failed to find open jobs');

  const notApplied = jobs.filter((job) => {
    const jcID = job.createdBy.toString();
    const isCreatorHr = User.findById(jcID).role === ACCOUNT_ROLE.HR;

    if (isCreatorHr) return false;

    const hasApplied = applications.some((application) => {
      const jobID = application.jobId._id.toString();

      return jobID === job._id.toString();
    });

    if (hasApplied) return false;

    return true;
  });

  res.status(StatusCodes.OK).json({ jobs: notApplied });
};

export const getAllJobsByCreatorId = async (req, res) => {
  const queryObject = {
    createdBy: req.user.userId,
  };

  const jobs = await Job.find(queryObject);
  const applications = await JobApplication.find({
    applicantId: req.user.userId,
  }).populate('jobId');

  if (!jobs) throw new NotFoundError('Failed to find jobs');

  const filteredJobs = jobs.filter((job) => {
    const jcID = job.createdBy.toString();

    const hasApplied = applications.some((application) => {
      const jobID = application.jobId._id.toString();

      return jobID === job._id.toString();
    });

    if (hasApplied) return false;

    return true;
  });

  res.status(StatusCodes.OK).json({ jobs: filteredJobs });
};

export const createJob = async (req, res) => {
  if (req.user.role !== ACCOUNT_ROLE.HR)
    throw new UnauthenticatedError('You are not authorized to create a job');

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

export const getJobById = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) throw new NotFoundError(`no job with id ${id}`);

  checkPermissions(req.user, job.createdBy);

  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findById(id);

  if (!job) {
    throw new NotFoundError(`no job with id ${id}`);
  }

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ job: updatedJob });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);

  if (!job) {
    throw new NotFoundError(`no job with id ${id}`);
  }

  checkPermissions(req.user, job.createdBy);
  const removedJob = await Job.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ job: removedJob });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = day()
        .month(month - 1)
        .year(year)
        .format('MMM YY');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
