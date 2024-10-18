// interfaces/server2.ts

export interface PlayerStats {
    SteamID: string;
    PlayerName?: string;
    TimesConnected?: number;
    LastConnected?: number;
    GlobalPoints?: number;
    HideTimerHud?: boolean;
    HideKeys?: boolean;
    SoundsEnabled?: boolean;
    IsVip?: boolean;
    BigGifID?: string;
    HideJS?: boolean;
    PlayerFov?: number;
  }
  
  export interface PlayerRecord {
    MapName: string;
    SteamID: string;
    PlayerName?: string;
    TimerTicks?: number;
    FormattedTime?: string;
    UnixStamp?: number;
    TimesFinished?: number;
    LastFinished?: number;
    Style: number;
  }
  
  export interface PlayerStageTime {
    MapName: string;
    SteamID: string;
    PlayerName?: string;
    Stage: number;
    TimerTicks?: number;
    FormattedTime?: string;
    Velocity?: string;
  }
  