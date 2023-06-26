import { Router } from 'express';
const router = Router();

import checkForDemoUser from '../middleware/checkForDemoUser.js';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from '../controllers/jobController.js';
import {
  validateJobInput,
  validateIdParam,
  validateGetAllJobsParams,
} from '../middleware/validationMiddleware.js';

router
  .route('/')
  .get(validateGetAllJobsParams, getAllJobs)
  .post(checkForDemoUser, validateJobInput, createJob);

router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(checkForDemoUser, validateIdParam, validateJobInput, updateJob)
  .delete(checkForDemoUser, validateIdParam, deleteJob);

export default router;
