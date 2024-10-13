// authUtils.ts

import { User } from "../context/AuthContext";

export const handleRestrictedAction = (
  isLoggedIn: boolean,
  user: User | null,
  requiredState: 'login' | 'onboard' | 'steam'
): { success: boolean; message?: string } => {
  if (!isLoggedIn) {
    return {
      success: false,
      message: 'Hey! You need to log in to perform this action. Log in and let\u2019s keep the fun going!',
    };
  }

  if (requiredState === 'onboard' && !user?.hasCompletedOnboarding) {
    if (!user?.isSteamLinked) {
      return {
        success: false,
        message: 'Heads up! You need to complete onboarding and link your Steam account to access this feature. Start onboarding and link your Steam account when prompted!',
      };
    } else {
      return {
        success: false,
        message: 'Almost there! Please complete onboarding to access this feature.',
      };
    }
  }

  if (requiredState === 'steam') {
    if (!user?.hasCompletedOnboarding) {
      return {
        success: false,
        message: 'First things first! Complete onboarding, then you\'ll be able to link your Steam account and unlock this action.',
      };
    }
    if (!user?.isSteamLinked) {
      return {
        success: false,
        message: 'To continue, link your Steam account. It\'s the final step before you\'re ready to go!',
      };
    }
  }

  return { success: true };
};
