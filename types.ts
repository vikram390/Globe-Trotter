
export enum ActivityCategory {
  FLIGHT = 'Flight',
  HOTEL = 'Hotel',
  DINING = 'Dining',
  SIGHTSEEING = 'Sightseeing',
  TRANSPORT = 'Transport',
  OTHER = 'Other'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  preferences: {
    currency: string;
    travelStyle: string;
  };
}

export interface Activity {
  id: string;
  stop_id: string;
  title: string;
  description: string;
  cost: number;
  category: ActivityCategory;
  date: string; // ISO Date for calendar
  start_time: string;
  end_time: string;
}

export interface Stop {
  id: string;
  trip_id: string;
  name: string;
  order: number;
  activities: Activity[];
  target_budget?: number; // Target budget for this specific section
  start_date?: string;
  end_date?: string;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string; // Added requirement
  trip_type: 'Domestic' | 'International'; // Added requirement
  estimated_budget: number; // Added requirement
  start_date: string;
  end_date: string;
  total_budget: number; // This tracks actual sum of stops/activities
  is_public: boolean;
  share_token: string;
  stops: Stop[];
  status: 'ongoing' | 'upcoming' | 'completed';
  description?: string;
}
