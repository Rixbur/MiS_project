import { Router } from 'express';
const router = Router();

import checkForDemoUser from '../middleware/checkForDemoUser.js';
import {
  validateJobPostInput,
  validateIdParam,
  validateGetAllJobPostParams,
} from '../middleware/validationMiddleware.js';
import {
  createJobPost,
  deleteJobPost,
  getAllJobPosts,
  getJobPost,
  updateJobPost,
} from '../controllers/jobPostController.js';

router
  .route('/')
  .get(validateGetAllJobPostParams, getAllJobPosts)
  .post(checkForDemoUser, validateJobPostInput, createJobPost);

router
  .route('/:id')
  .get(validateIdParam, getJobPost)
  .patch(validateIdParam, validateJobPostInput, updateJobPost)
  .delete(validateIdParam, deleteJobPost);

export default router;
