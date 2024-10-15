// components/CookieBanner.tsx

import React from 'react';
import { Button } from '@components/ui/button';
import Icons from '@components/Shared/Icons';
import { useFeatureFlags } from '@context/FeatureFlagContext';
import { FeatureFlagKeys } from '@utils/featureFlags';

const { CheckIcon, XIcon, CookieIcon } = Icons;

interface CookieBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onReject }) => {
  const { isFeatureEnabled } = useFeatureFlags();

  // If the CookieBanner feature flag is disabled, don't render the banner
  if (!isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 py-4 px-6 shadow-lg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Cookie Icon */}
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER_ICON) && (
          <h3 className="text-lg font-medium flex items-center gap-2 text-zinc-400">
            <CookieIcon className="w-5 h-5" />
            Cookies Consent
          </h3>
        )}
        {/* Cookie Text */}
        {isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER_TEXT) && (
          <p className="text-zinc-400">
            This website uses cookies to enhance your browsing experience. By continuing to use this site, you agree to our use of cookies.
          </p>
        )}
        {/* Buttons */}
        <div className="flex gap-2">
          {isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER_REJECT) && (
            <Button 
              variant="outline" 
              onClick={onReject}
              className="bg-black text-white border-zinc-700 hover:bg-zinc-800 hover:text-white"
            >
              <XIcon className="w-4 h-4 mr-2" />
              Reject
            </Button>
          )}
          {isFeatureEnabled(FeatureFlagKeys.ENABLE_COOKIEBANNER_ACCEPT) && (
            <Button 
              onClick={onAccept}
              className="bg-white text-black hover:bg-zinc-200"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              Accept
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CookieBanner;
