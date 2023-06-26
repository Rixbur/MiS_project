import mongoose from 'mongoose';
import { JOB_TYPE } from '../utils/constants.js';

const JobPostSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export default mongoose.model('JobPost', JobPostSchema);
