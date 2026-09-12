export const DRIVER_LOCATION = { lat: 36.8065, lng: 10.1815 };
export const CUSTOMER_LOCATION = { lat: 36.812, lng: 10.175 };

export const STORAGE_KEYS = {
  DELIVERIES: 'droplink_deliveries',
  DRIVER: 'droplink_driver',
  AUTH: 'droplink_auth',
};

export const WHATSAPP_MESSAGE = (link: string, customerName: string) =>
  `🚚 Your delivery is on the way.\n\nHi ${customerName}, please open this link and share your location with your driver:\n${link}`;

export const PLAN_LIMITS = {
  free: 5,
  pro: Infinity,
};
