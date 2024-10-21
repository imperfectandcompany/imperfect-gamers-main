// src/app/interfaces/server1.ts

/**
 * Represents a user's basic information.
 */
export interface User {
  id: number;
  email: string;
  status: UserStatus;
  admin: boolean;
  verified: boolean;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

/**
* Enum representing possible user statuses.
*/
export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Banned = "banned",
  Suspended = "suspended",
  // Add other statuses as needed
}

/**
* Represents a user's profile information.
*/
export interface Profile {
  username?: string;
  bio_short?: string | null;
  avatar?: string;
  steam_id?: string | null;
  steam_id_64?: string | null;
  steam_id_3?: string | null;
}

/**
* Represents a single activity log entry.
*/
export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  activity_data: string | null | Record<string, unknown>;
  created_at: string; // ISO 8601 format
  location: string | null;
}

/**
* Represents an IP address associated with a device.
*/
export interface DeviceIP {
  id: number;
  device_id: number;
  ip_address: string;
  created_at: string; // ISO 8601 format
}

/**
* Represents a device used by a user.
*/
export interface Device {
  id: number;
  device_name: string;
  first_login: string; // ISO 8601 format
  last_login: string; // ISO 8601 format
  is_logged_in: boolean;
  ips: DeviceIP[];
}

/**
* Represents a login attempt.
*/
export interface LoginLog {
  id: number;
  user_id: number;
  device_id: number;
  ip_address: string;
  timestamp: string; // ISO 8601 format
  success: boolean;
}

/**
* Represents a login token issued to a user.
*/
export interface LoginToken {
  id: number;
  token: string;
  user_id: number;
  device_id: number;
  expiration_time: string; // ISO 8601 format
}

/**
* Represents a payment transaction.
*/
export interface Payment {
  id: number;
  payer_user_id: number;
  recipient_user_id: number;
  transaction_email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  payment_data: Record<string, unknown>;
}

/**
* Represents details of a checkout process.
*/
export interface CheckoutDetail {
  id: number;
  user_id: number;
  basket_id: number;
  package_id: number;
  checkout_url: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

/**
* Represents a device used by a user with simplified properties.
*/
export interface DeviceUsed {
  deviceName: string;
  firstLogin: string; // ISO 8601 format
  lastLogin: string; // ISO 8601 format
  isLoggedIn: boolean;
  ips: string[];
}
