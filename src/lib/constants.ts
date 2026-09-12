export const DRIVER_LOCATION = { lat: 36.8065, lng: 10.1815 };
export const CUSTOMER_LOCATION = { lat: 36.812, lng: 10.175 };

export const STORAGE_KEYS = {
  DELIVERIES: 'droplink_deliveries',
  DRIVER: 'droplink_driver',
  AUTH: 'droplink_auth',
};

export const WHATSAPP_MESSAGE = (link: string, customerName: string) =>
  `🚚 Votre livraison est en route.\n\nBonjour ${customerName}, veuillez ouvrir ce lien et partager votre position avec votre livreur :\n${link}`;

export const PLAN_LIMITS = {
  free: 5,
  pro: Infinity,
};
