// context/FeatureFlagContext.tsx

import React, { createContext, useContext } from 'react';
import { featureFlags, FeatureFlags, FeatureFlagKeys } from '../utils/featureFlags';

interface FeatureFlagContextProps {
  flags: FeatureFlags;
  isFeatureEnabled: (flag: FeatureFlagKeys) => boolean;
}

const FeatureFlagContext = createContext<FeatureFlagContextProps>({
  flags: featureFlags,
  isFeatureEnabled: () => false,
});

export const FeatureFlagProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isFeatureEnabled = (flag: FeatureFlagKeys): boolean => {
    if (!featureFlags[flag]) {
      console.log(`Feature flag ${flag} is disabled.`);
      return false;
    }

    const parts = flag.split('_');
    let currentFlag = parts[0]; // Initialize with first part

    // Check the first flag (e.g., 'ENABLE')
    const firstFlagEnabled = featureFlags[currentFlag as FeatureFlagKeys];
    console.log(`Checking flag: ${currentFlag} = ${firstFlagEnabled}`);
    if (!firstFlagEnabled) {
      console.log(`Feature flag ${currentFlag} is disabled.`);
      return false;
    }

    // Iterate through the remaining parts to check hierarchical flags
    for (let i = 1; i < parts.length; i++) {
      currentFlag += `_${parts[i]}`;
      const enabled = featureFlags[currentFlag as FeatureFlagKeys];

      if (enabled === undefined) {
        // Flag not defined, skip to next
        console.log(`Flag ${currentFlag} is not defined, skipping.`);
        continue;
      }

      console.log(`Checking flag: ${currentFlag} = ${enabled}`);
      if (!enabled) {
        console.log(`Feature flag ${currentFlag} is disabled.`);
        return false;
      }
    }

    return true;
  };

  return (
    <FeatureFlagContext.Provider value={{ flags: featureFlags, isFeatureEnabled }}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeatureFlags = () => useContext(FeatureFlagContext);
