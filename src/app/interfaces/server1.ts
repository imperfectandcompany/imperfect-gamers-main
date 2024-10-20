// interfaces/server1.ts

import { RowDataPacket } from "mysql2";

// Define TypeScript interfaces for the data structures

export interface User extends RowDataPacket {
  id: number;
  email: string;
  status: 'online' | 'away' | 'offline' | 'dnd';
  admin: boolean;
  verified: boolean;
  createdAt: string;
}

// interface PlayerReplay extends RowDataPacket {
//     MapName: string;
//     SteamID: string;
//     Style: number;
//     Replay?: string;
//   }

export interface Profile {
  username: string;
  bio_short: string;
  avatar: string;
  steam_id?: string;
  steam_id_64?: string;
  steam_id_3?: string;
}

export interface Profile extends RowDataPacket {
  username: string;
  bio_short: string;
  avatar: string;
  steam_id?: string;
  steam_id_64?: string;
  steam_id_3?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  status: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}

export interface ActivityLog extends RowDataPacket {
  id: number;
  user_id: number;
  action: string;
  created_at: string;
  [key: string]: any; // If there are additional fields
}

export interface Device extends RowDataPacket {
  id: number;
  user_id: number;
  device_name: string;
  first_login: string;
  last_login: string;
  is_logged_in: boolean;
  ips: DeviceIP[];
}

export interface DeviceIP extends RowDataPacket {
  id: number;
  device_id: number;
  ip_address: string;
  created_at: string;
}

export interface LoginLog extends RowDataPacket {
  id: number;
  user_id: number;
  device_id: number;
  ip_address: string;
  timestamp: string;
  success: boolean;
}

export interface LoginToken extends RowDataPacket {
  id: number;
  user_id: number;
  token: string;
  device_id: number;
  expiration_time: string;
}

export interface Payment extends RowDataPacket {
  id: number;
  payer_user_id: number;
  recipient_user_id: number;
  transaction_email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  payment_data: any;
}

export interface CheckoutDetail extends RowDataPacket {
  id: number;
  user_id: number;
  basket_id: string;
  package_id: string;
  checkout_url: string;
  created_at: string;
  updated_at: string;
}

export interface AdditionalData {
  potentialAltAccounts: string[];
  devicesUsed: DeviceUsed[];
  recentActivity: ActivityLog[];
}

export interface DeviceUsed {
  deviceName: string;
  firstLogin: string;
  lastLogin: string;
  isLoggedIn: boolean;
  ips: string[];
}

export interface UserProfile {
  id: number;
  email: string;
  status: string;
  admin: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  profile: Profile | null;
}
