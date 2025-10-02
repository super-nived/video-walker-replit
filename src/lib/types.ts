export interface VisionStats {
  raisedAmount: number;
  campaigns: number;
  winners: number;
}

export interface Sponsor {
  id: string;
  name: string;
  campaigns: number;
  amount: number;
}
