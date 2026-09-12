export type DeliveryStatus = 'waiting_location' | 'location_received' | 'delivered';

export interface Delivery {
  id: string;
  customerName: string;
  reference: string;
  amount?: number;
  notes?: string;
  status: DeliveryStatus;
  shareUrl: string;
  customerLatitude?: number;
  customerLongitude?: number;
  createdAt: string;
  linkSentAt?: string;
  customerOpenedAt?: string;
  locationReceivedAt?: string;
  completedAt?: string;
  distance?: number;
}

export interface Driver {
  name: string;
  phone: string;
  email: string;
  plan: 'free' | 'pro';
}

export interface TimelineEvent {
  time: string;
  label: string;
}
