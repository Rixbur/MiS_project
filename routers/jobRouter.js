import { Router } from 'express';
const router = Router();

import {
  getAllOpenJobs,
  getAllJobsByCreatorId,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';
import {
  validateJobInput,
  validateIdParam,
  validateGetAllJobsParams,
} from '../middleware/validationMiddleware.js';

// /api/v1/jobs
router
  .route('/')
  .get(validateGetAllJobsParams, getAllOpenJobs)
  .post(validateJobInput, createJob);

// /api/v1/jobs/my-jobs
router.route('/my-jobs').get(getAllJobsByCreatorId);

// /api/v1/jobs/:id
router
  .route('/:id')
  .get(validateIdParam, getJobById)
  .patch(validateIdParam, validateJobInput, updateJob)
  .delete(validateIdParam, deleteJob);

export default router;
