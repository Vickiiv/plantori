import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  requestEmailChange,
  deleteAccount,
} from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate';
import { registerSchema } from '../validation/registerSchema';
import { loginSchema } from '../validation/loginSchema';
import { changePasswordSchema } from '../validation/changePasswordSchema';
import { forgotPasswordSchema } from '../validation/forgotPasswordSchema';
import { resetPasswordSchema } from '../validation/resetPasswordSchema';
import { verifyEmailQuerySchema } from '../validation/verifyEmailSchema';
import { changeEmailSchema } from '../validation/changeEmailSchema';
import { deleteAccountSchema } from '../validation/deleteAccountSchema';
import { updateProfileSchema } from '../validation/updateProfileSchema';
import { loginRateLimiter, registerRateLimiter, sensitiveActionLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', registerRateLimiter, validate(registerSchema), register);
router.post('/login', loginRateLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

router.get('/verify', validate(verifyEmailQuerySchema, 'query'), verifyEmail);
router.post('/resend-verification', requireAuth, sensitiveActionLimiter, resendVerificationEmail);

router.post('/forgot-password', sensitiveActionLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', sensitiveActionLimiter, validate(resetPasswordSchema), resetPassword);

router.patch('/password', requireAuth, validate(changePasswordSchema), changePassword);
router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfile);
router.post('/change-email', requireAuth, sensitiveActionLimiter, validate(changeEmailSchema), requestEmailChange);
router.delete('/me', requireAuth, validate(deleteAccountSchema), deleteAccount);

export default router;
