// src/app/interfaces/UserDataResponse.ts

import { ActivityLog, Device, LoginLog, LoginToken, Payment, CheckoutDetail, DeviceUsed, Profile, User } from './server1';
import { GameStats, AdminData, BansData, MutesData, ServersData } from './server2';

/**
 * Represents the complete data structure for a user, aggregating all related information.
 */
export interface UserDataResponse {
    user: UserProfile;
    activity?: {
        logs?: ActivityLog[];
        devices?: Device[];
        loginLogs?: LoginLog[];
        loginTokens?: LoginToken[];
    };
    payments?: {
        made?: Payment[];
        received?: Payment[];
        checkoutDetails?: CheckoutDetail[];
    };
    gameStats?: GameStats;
    adminData?: AdminData;
    bans?: BansData;
    mutes?: MutesData;
    servers?: ServersData;
    // AdditionalData fields
    potentialAltAccounts?: string[];
    devicesUsed?: DeviceUsed[];
    recentActivity?: ActivityLog[];
}

/**
 * Represents a user's profile combined with user ID and game stats.
 */
export interface UserProfile extends User {
    profile: Profile | null;
    gameStats?: GameStats; // Include gameStats here
}