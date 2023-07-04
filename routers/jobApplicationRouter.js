import { Router } from 'express';
const router = Router();

import {
  applyToJob,
  createCustomJobApplication,
  getAllCustomJobApplications,
  getAllJobApplications,
  hrUpdateJobApplication,
  getCustomJobApplicationById,
  updateCustomApplication,
  deleteJobApplicationById,
  showStats,
} from '../controllers/jobApplicantController.js';
import { validateCustomApplicationInput } from '../middleware/validationMiddleware.js';

// /api/v1/job-applications
router.route('/').get(getAllJobApplications).post(applyToJob);

// /api/v1/job-applications/:id
router.route('/:id').patch(hrUpdateJobApplication);

// /api/v1/job-applications/custom
router
  .route('/custom')
  .get(getAllCustomJobApplications)
  .post(validateCustomApplicationInput, createCustomJobApplication);

// /api/v1/job-applications/custom/:id
router
  .route('/custom/:id')
  .get(getCustomJobApplicationById)
  .patch(updateCustomApplication)
  .delete(deleteJobApplicationById);

router.route('/stats').get(showStats);

export default router;
