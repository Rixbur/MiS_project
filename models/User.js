import mongoose from 'mongoose';
import { ACCOUNT_ROLE } from '../utils/constants.js';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: Object.values(ACCOUNT_ROLE),
    default: ACCOUNT_ROLE.CANDIDATE,
  },
  avatar: String,
  cv: String,
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;

  return obj;
};

export default mongoose.model('User', UserSchema);
