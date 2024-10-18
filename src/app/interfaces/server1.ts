// interfaces/server1.ts

export interface Server1User {
    id: number;
    email: string;
    status: 'online' | 'away' | 'offline' | 'dnd';
    admin: boolean;
    verified: boolean;
    createdAt: Date;
    updatedAt?: number;
  
    // Relations
    profile?: Profile;
    devices?: Device[];
    loginTokens?: LoginToken[];
    payments?: Payment[];
  }
  
  export interface Profile {
    id: number;
    user_id: number;
    username: string;
    bio_short?: string;
    avatar?: string;
    steam_id?: string;
    steam_id_64?: string;
    steam_id_3?: number;
    basket_id?: string;
    package_id?: string;
    checkout_url?: string;
  }
  
  export interface Device {
    id: number;
    user_id: number;
    device_name: string;
    created_at: Date;
    first_login?: Date;
    last_login?: Date;
    is_logged_in: boolean;
    expired: boolean;
  }
  
  export interface LoginToken {
    id: number;
    token: string;
    user_id: number;
    device_id: number;
    expiration_time: Date;
  }
  
  export interface Payment {
    id: number;
    payer_user_id: number;
    recipient_user_id: number;
    transaction_email?: string;
    amount: number;
    currency?: string;
    payment_method?: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    payment_data?: any; // JSON field
  }
  