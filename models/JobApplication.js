import mongoose from 'mongoose';
import { JOB_APPLICATION_STATUS } from '../utils/constants.js';

const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
    },
    applicantId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(JOB_APPLICATION_STATUS),
      default: JOB_APPLICATION_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

export default mongoose.model('JobApplication', JobApplicationSchema);
