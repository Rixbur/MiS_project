import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';
import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import day from 'dayjs';

export const applyToJob = async (req, res) => {
  req.body.applicantId = req.user.userId;
  const { jobId } = req.body;

  if (!jobId) throw new NotFoundError('jobId must be provided');

  const job = Job.findById(jobId);
  if (!job) throw new NotFoundError(`no job with id ${jobId}`);

  const jobApplicant = await JobApplication.create({
    applicantId: req.user.userId,
    jobId,
  });

  if (!jobApplicant)
    throw new NotFoundError(
      `Failed to create jobApplication with job id ${id}`
    );

  res.status(StatusCodes.CREATED).json({ jobApplicant });
};

export const createCustomJobApplication = async (req, res) => {
  const jobData = {
    company: req.body.company,
    position: req.body.position,
    location: req.body.location,
    jobType: req.body.jobType,
    createdBy: req.user.userId,
  };

  const jobPost = await Job.create(jobData);
  if (!jobPost)
    throw new NotFoundError(
      `Failed to create custom job during 
       creation of custom job application`
    );

  const jobApplicationData = {
    applicantId: req.user.userId,
    jobId: jobPost._id,
    status: req.body.status,
  };

  const jobApplication = await JobApplication.create(jobApplicationData);
  if (!jobApplication)
    throw new NotFoundError(
      `Failed to create jobApplication with job id ${id}`
    );

  res.status(StatusCodes.CREATED).json({ jobApplication });
};

export const getAllJobApplications = async (req, res) => {
  const queryObject = {};
  if (req.body.jobId) queryObject.jobId = req.body.jobId;
  if (req.body.applicantId) queryObject.applicantId = req.body.applicantId;

  const jobApplications = await JobApplication.find(queryObject)
    .populate('jobId')
    .populate('applicantId');

  res.status(StatusCodes.OK).json({ jobApplications });
};

export const getAllCustomJobApplications = async (req, res) => {
  const queryObject = {};
  const { applicantId } = req.user.userId;
  const { search, jobType, jobStatus } = req.query;

  if (applicantId) queryObject.applicantId = applicantId;

  const jobApplications = await JobApplication.find(queryObject).populate(
    'jobId'
  );

  let myJobApplications = jobApplications.filter((jobApplication) => {
    const jcID = jobApplication.jobId.createdBy.toString();

    return jcID === req.user.userId;
  });

  console.log('filter to createdBy', myJobApplications);

  if (search) {
    myJobApplications = myJobApplications.filter((jobApplication) => {
      const jobPost = jobApplication.jobId;
      const jobPostCompany = jobPost.company.toLowerCase();
      const jobPostLocation = jobPost.jobLocation.toLowerCase();
      const jobPostPosition = jobPost.position.toLowerCase();

      const searchQuery = search.toLowerCase();

      return (
        jobPostPosition.includes(searchQuery) ||
        jobPostCompany.includes(searchQuery) ||
        jobPostLocation.includes(searchQuery)
      );
    });
  }

  if (jobStatus && jobStatus !== 'all') {
    myJobApplications = myJobApplications.filter((jobApplication) => {
      const jobPostStatus = jobApplication.status.toLowerCase();

      const jobStatusQuery = jobStatus.toLowerCase();
      console.log(jobPostStatus.trim() == jobStatusQuery.trim());

      return jobPostStatus == jobStatusQuery;
    });
  }

  if (jobType && jobType !== 'all') {
    myJobApplications = myJobApplications.filter((jobApplication) => {
      const jobPost = jobApplication.jobId;
      const jobPostJobType = jobPost.jobType.toLowerCase();

      const jobTypeQuery = jobType.toLowerCase();

      return jobPostJobType.includes(jobTypeQuery);
    });
  }

  res.status(StatusCodes.OK).json({ myJobApplications });
};

export const hrUpdateJobApplication = async (req, res) => {
  const { id } = req.params;

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication)
    throw new NotFoundError(`no job post application with id ${id}`);

  const job = await Job.findById(jobApplication.jobId);
  if (!job)
    throw new NotFoundError(`no job post with id ${jobApplication.jobId}`);

  checkPermissions(req.user, job.createdBy);

  const updatedJobApplication = await JobApplication.findByIdAndUpdate(
    id,
    { status: req.body.status },
    {
      new: true,
      runValidators: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ updatedJobApplication: updatedJobApplication });
};

export const getCustomJobApplicationById = async (req, res) => {
  const { id } = req.params;

  const jobApplication = await JobApplication.findById(id).populate('jobId');
  if (!jobApplication)
    throw new NotFoundError(`no job post application with id ${id}`);

  const job = await Job.findById(jobApplication.jobId);
  if (!job)
    throw new NotFoundError(`no job post with id ${jobApplication.jobId}`);

  checkPermissions(req.user, job.createdBy);

  res.status(StatusCodes.OK).json({ jobApplication });
};

export const updateCustomApplication = async (req, res) => {
  const { id } = req.params;

  const jobApplication = await JobApplication.findById(id);
  if (!jobApplication)
    throw new NotFoundError(`no job post application with id ${id}`);

  checkPermissions(req.user, jobApplication.applicantId);

  const updatedJobApplication = await JobApplication.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  const job = await Job.findById(jobApplication.jobId);
  if (!job)
    throw new NotFoundError(`no job post with id ${jobApplication.jobId}`);

  const updatedJob = await Job.findByIdAndUpdate(
    jobApplication.jobId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({
    updatedJobApplication: updatedJobApplication,
    updatedJob: updatedJob,
  });
};

export const deleteJobApplicationById = async (req, res) => {
  const { id } = req.params;

  const jobApplication = await JobApplication.findById(id);
  if (!jobApplication)
    throw new NotFoundError(`no job post application with id ${id}`);

  checkPermissions(req.user, jobApplication.applicantId);

  const removedJobApplication = await JobApplication.findByIdAndDelete(id);

  res
    .status(StatusCodes.OK)
    .json({ removedJobApplication: removedJobApplication });
};

export const showStats = async (req, res) => {
  let stats = await JobApplication.aggregate([
    { $match: { applicantId: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
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
