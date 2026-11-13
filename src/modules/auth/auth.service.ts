import { User } from './user.model';
import { signAccessToken } from '../../utils/jwt';
import { createHttpError } from '../../utils/apiResponse';

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const accessToken = signAccessToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email: email.toLowerCase() }).lean();
  if (existing) {
    throw createHttpError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role: 'admin' });
  const accessToken = signAccessToken({
    userId: String(user._id),
    email: user.email,
    role: user.role,
  });

  return {
    accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select('-password').lean();
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  return user;
};

