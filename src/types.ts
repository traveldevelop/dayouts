export type Currency = 'LKR' | 'USD';
export type Language = 'EN' | 'SI' | 'TA';

export type PageType = 
  | 'explore-stays'
  | 'day-out-packages'
  | 'deals-and-offers'
  | 'villas-stays'
  | 'tour-packages'
  | 'corporate-events'
  | 'for-property-owners'
  | 'property-detail'
  | 'checkout'
  | 'owner-portal'
  | 'admin-console'
  | 'my-bookings';

export interface CabanaPackageTier {
  id: string;
  name: string;
  priceDeltaLkr: number;
  timing: string;
  badge?: string;
  diningPlan: string;
  highlights: string[];
}

export interface CabanaPackageDetails {
  tierName: string;
  diningPlan: string;
  welcomeRefreshment: string;
  swimmingAccess: string;
  towelPolicy: string;
  corkagePolicy: string;
  changingRoom: string;
  schedule: string;
  exclusivePerks: string[];
  packageTiers?: CabanaPackageTier[];
}

export interface CabanaSpecifications {
  floorAreaSqFt: number;
  deckAreaSqFt: number;
  bedLayout: string;
  furniture: string;
  climateControl: string;
  powerAudio: string;
  bathroomChanging: string;
  shadeRating: string;
  distanceToPool: string;
  distanceToBeach?: string;
  orientation: string;
  accessibility: string;
}

export interface CabanaUnit {
  id: string;
  name: string;
  code: string;
  type: 'oceanfront' | 'poolside' | 'vip' | 'family' | 'lagoon' | 'garden';
  typeLabel: string;
  tagline: string;
  capacity: string;
  maxAdults: number;
  maxKids: number;
  priceDeltaLkr: number; // 0 if standard included, or extra upgrade price
  coverImage: string;
  images: string[];
  features: string[];
  viewType: string;
  privacyLevel: 'Standard' | 'High' | 'Exclusive VIP';
  status: 'AVAILABLE' | 'FEW_LEFT' | 'RESERVED';
  slotsRemaining: number;
  description: string;
  packageDetails: CabanaPackageDetails;
  specifications?: CabanaSpecifications;
}

export interface SanctuaryProperty {
  id: string;
  name: string;
  tagline: string;
  location: string;
  district: string;
  province: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  passType: 'dayout' | 'stay' | 'dual' | 'adventure';
  passTypeLabel: string;
  verificationBadge: string;
  sltdaLicense?: string;
  timeSlot: string;
  slotsLeft: number;
  priceLkr: number;
  pricePerStayLkr?: number;
  inclusions: string[];
  features: string[];
  description?: string;
  category?: 'cabana' | 'villa' | 'glamping' | 'cottages' | 'chalets' | string;
  subUnits?: CabanaUnit[];
}

export interface BookingState {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyLocation: string;
  propertyImage: string;
  selectedDate: string;
  selectedSlot: string;
  packageName: string;
  adults: number;
  children: number;
  addOns: {
    jetski: boolean;
    transfer: boolean;
    byob: boolean;
  };
  totalLkr: number;
  totalUsd: number;
  status: 'AWAITING_OWNER_APPROVAL' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'REJECTED';
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nicPassport: string;
    bookingMode: 'guest' | 'loyalty';
    arrivalTime: string;
    cabanaLocation: string;
    specialRequests: string;
    paymentChoice: 'pay_at_property' | 'online';
    sendWhatsApp: boolean;
  };
  selectedCabana?: CabanaUnit;
  selectedTier?: CabanaPackageTier;
  createdAt: string;
}
