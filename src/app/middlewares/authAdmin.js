import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);

  const [, domain] = user.email.split('@');

  if (!(domain === 'fastfeet.com')) {
    return res
      .status(401)
      .json({ error: 'For this operation you need to be an admin' });
  }

  return next();
};
