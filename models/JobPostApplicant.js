import mongoose from 'mongoose';
import { JOB_STATUS } from '../utils/constants';

const JobPostApplicationSchema = new mongoose.Schema(
  {
    jobPostId: {
      type: mongoose.Types.ObjectId,
      ref: 'JobPost',
    },
    applicantId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

export default mongoose.model('JobPostApplication', JobPostApplicationSchema);
