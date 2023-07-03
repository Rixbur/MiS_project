import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customErrors.js';
import JobApplication from '../models/JobApplication.js';
import Job from '../models/Job.js';
import checkPermissions from '../utils/checkPermissions.js';

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

  const jobApplications = await JobApplication.find(queryObject);

  res.status(StatusCodes.OK).json({ jobApplications });
};

export const getAllCustomJobApplications = async (req, res) => {
  const queryObject = {};
  const { applicantId } = req.user.userId;

  if (applicantId) queryObject.applicantId = applicantId;

  const jobApplications = await JobApplication.find(queryObject).populate(
    'jobId'
  );

  const myJobApplications = jobApplications.filter((jobApplication) => {
    const jcID = jobApplication.jobId.createdBy.toString();

    return jcID === req.user.userId;
  });

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
