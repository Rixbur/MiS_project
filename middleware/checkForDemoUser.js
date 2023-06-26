import { BadRequestError } from '../errors/customErrors.js';

const checkForDemoUser = (req, res, next) => {
  console.log('req.user: ', req.user);
  if (req.user.testUser) {
    throw new BadRequestError('Demo User. Read Only!');
  }

  next();
};

export default checkForDemoUser;
