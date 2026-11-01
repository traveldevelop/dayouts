import React, { useState } from 'react';
import { SanctuaryProperty, Currency, PageType } from '../types';
import { PROPERTIES, USD_EXCHANGE_RATE } from '../data/mockData';

interface OffersPageProps {
  currency: Currency;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onStartBooking: (property: SanctuaryProperty) => void;
  onNavigate: (page: PageType) => void;
  wishlist: string[];
  onToggleWishlist: (propertyId: string) => void;
}

interface PromoCodeItem {
  code: string;
  discount: string;
  description: string;
  validUntil: string;
  minSpendLkr: number;
  category: 'all' | 'dayout' | 'villa' | 'bank';
  tag: string;
}

const PROMO_CODES: PromoCodeItem[] = [
  {
    code: 'DAYOUT25',
    discount: '25% OFF',
    description: 'Valid on all Day-Out pool cabana packages for 3+ guests',
    validUntil: 'Valid this Weekend',
    minSpendLkr: 15000,
    category: 'dayout',
    tag: 'Trending Deal'
  },
  {
    code: 'ISLANDVILLA',
    discount: 'LKR 12,000 OFF',
    description: 'Flat discount on luxury private villa bookings of 2 nights or more',
    validUntil: 'Expires in 3 days',
    minSpendLkr: 40000,
    category: 'villa',
    tag: 'Villa Exclusive'
  },
  {
    code: 'COMBANK20',
    discount: '20% OFF',
    description: 'Special rebate with Commercial Bank Visa / Mastercard credit cards',
    validUntil: 'Valid until month end',
    minSpendLkr: 10000,
    category: 'bank',
    tag: 'Bank Partner'
  },
  {
    code: 'SAMPATH20',
    discount: '20% OFF',
    description: 'Sampath Bank Vishwa & credit card exclusive weekend deal',
    validUntil: 'Valid this Friday–Sunday',
    minSpendLkr: 10000,
    category: 'bank',
    tag: 'Bank Partner'
  },
  {
    code: 'EARLYBIRD',
    discount: '15% OFF',
    description: 'Early bird promotion for reservations booked 7+ days in advance',
    validUntil: 'All 2025 dates',
    minSpendLkr: 8000,
    category: 'all',
    tag: 'Advance Booking'
  }
];

export const OffersPage: React.FC<OffersPageProps> = ({
  currency,
  onSelectProperty,
  onStartBooking,
  onNavigate,
  wishlist,
  onToggleWishlist
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedOfferFilter, setSelectedOfferFilter] = useState<'all' | 'dayout' | 'villa' | 'bank'>('all');

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const formatPrice = (lkrAmount: number) => {
    if (currency === 'USD') {
      return `$${(lkrAmount / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkrAmount.toLocaleString()}`;
  };

  // Curate offer-eligible properties with calculated discount rates
  const discountedProperties = PROPERTIES.map((p, index) => {
    // Generate realistic discount percentages (20%, 25%, 30%, 15%)
    const discountPercent = [25, 30, 20, 25, 15, 20, 35, 25][index % 8];
    const isDayOut = p.passType === 'dayout' || p.passType === 'dual' || p.passType === 'adventure';
    const originalPrice = isDayOut ? p.priceLkr : (p.pricePerStayLkr || p.priceLkr);
    const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    const savingsAmount = originalPrice - discountedPrice;

    return {
      ...p,
      discountPercent,
      originalPrice,
      discountedPrice,
      savingsAmount,
      isDayOut,
      dealType: discountPercent >= 30 ? 'FLASH SALE' : isDayOut ? 'DAY OUT DEAL' : 'VILLA PROMO'
    };
  }).filter((p) => {
    if (selectedOfferFilter === 'dayout') return p.isDayOut;
    if (selectedOfferFilter === 'villa') return !p.isDayOut;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-r from-[#003528] via-[#004d3b] to-[#006a66] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            Island Flash Sales &amp; Bank Offers
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-white leading-tight">
                Exclusive Deals, Coupons &amp; Weekend Offers
              </h1>
              <p className="mt-3 text-base sm:text-lg text-emerald-100 leading-relaxed">
                Save up to 35% on Sri Lanka's finest luxury day packages, private cabanas, and overnight villas. Use coupon codes at checkout or pay with partner bank cards.
              </p>
            </div>

            {/* Flash Counter Badge */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                <span className="material-symbols-outlined text-2xl">alarm</span>
              </div>
              <div>
                <span className="text-[11px] text-rose-200 font-bold uppercase tracking-wider block">Flash Deals End In</span>
                <span className="text-xl font-black font-mono tracking-tight text-white">18h : 42m : 15s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Promo Coupon Voucher Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMO_CODES.map((item) => {
            const isCopied = copiedCode === item.code;
            return (
              <div
                key={item.code}
                className="bg-white rounded-2xl p-5 shadow-lg border border-[#e2e8e5] relative flex flex-col justify-between overflow-hidden group hover:border-[#006a66] transition-all"
              >
                {/* Sawtooth edge or decorative top */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006a66] font-bold text-[11px] border border-emerald-200">
                    {item.tag}
                  </span>
                  <span className="text-[11px] text-[#6b7772] font-medium">{item.validUntil}</span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#003528]">{item.discount}</span>
                    <span className="text-xs font-semibold text-[#6b7772]">DISCOUNT</span>
                  </div>
                  <p className="text-xs text-[#55635e] mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Promo Code Box & Copy Button */}
                <div className="mt-5 pt-4 border-t border-dashed border-[#ccd5d1] flex items-center justify-between gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-[#f4f7f6] border border-[#ccd5d1] font-mono font-bold text-sm text-[#003528] tracking-wider">
                    {item.code}
                  </div>
                  <button
                    onClick={() => handleCopyCode(item.code)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#003528] text-white hover:bg-[#004d3b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {isCopied ? 'check' : 'content_copy'}
                    </span>
                    <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bank Partner Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e8e5] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200">
                Official Banking Partners
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-headline text-[#003528] mt-2">
                Cardholder Privileges &amp; 0% Easy Payment Plans
              </h2>
              <p className="text-xs sm:text-sm text-[#55635e] mt-1">
                Enjoy instant 20% savings on credit cards issued by Commercial Bank, Sampath Bank, HNB, and Nations Trust Bank.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-bold text-[#003528]">
                Commercial Bank
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-bold text-[#003528]">
                Sampath Vishwa
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-bold text-[#003528]">
                HNB Cards
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-bold text-[#003528]">
                NTB Amex
              </span>
              <span className="px-3 py-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs font-bold text-[#003528]">
                FriMi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs for Discounted Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#e2e8e5]">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedOfferFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedOfferFilter === 'all'
                  ? 'bg-[#003528] text-white shadow-sm'
                  : 'bg-white text-[#404945] hover:bg-[#f4f7f6] border border-[#e2e8e5]'
              }`}
            >
              All Deals ({discountedProperties.length})
            </button>
            <button
              onClick={() => setSelectedOfferFilter('dayout')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedOfferFilter === 'dayout'
                  ? 'bg-[#003528] text-white shadow-sm'
                  : 'bg-white text-[#404945] hover:bg-[#f4f7f6] border border-[#e2e8e5]'
              }`}
            >
              Day Out Deals
            </button>
            <button
              onClick={() => setSelectedOfferFilter('villa')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedOfferFilter === 'villa'
                  ? 'bg-[#003528] text-white shadow-sm'
                  : 'bg-white text-[#404945] hover:bg-[#f4f7f6] border border-[#e2e8e5]'
              }`}
            >
              Villa &amp; Stay Discounts
            </button>
          </div>

          <span className="text-xs font-medium text-[#6b7772] hidden sm:inline-block">
            Prices show calculated promo rates
          </span>
        </div>
      </section>

      {/* Discounted Properties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {discountedProperties.map((property) => {
            const isSaved = wishlist.includes(property.id);
            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
              >
                {/* Offer Ribbon Tag */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1 items-start">
                  <span className="px-3 py-1 rounded-md bg-rose-600 text-white font-extrabold text-xs shadow-md tracking-wider uppercase">
                    SAVE {property.discountPercent}%
                  </span>
                  <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-amber-300 text-[10px] font-bold">
                    {property.dealType}
                  </span>
                </div>

                {/* Property Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(property.id);
                    }}
                    className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {isSaved ? 'favorite' : 'favorite_border'}
                    </span>
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {property.location}
                    </span>
                    <span className="bg-emerald-600 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                      {property.slotsLeft} Deals Left
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#006a66] font-semibold">{property.district}</span>
                    <span className="flex items-center gap-1 font-bold text-[#2d3834]">
                      <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                      {property.rating} ({property.reviewCount})
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProperty(property)}
                    className="font-headline text-lg font-bold text-[#003528] group-hover:text-[#006a66] transition-colors cursor-pointer line-clamp-1"
                  >
                    {property.name}
                  </h3>
                  <p className="text-xs text-[#55635e] line-clamp-1 mt-0.5">{property.tagline}</p>

                  {/* Savings summary */}
                  <div className="mt-4 p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Regular Rate</span>
                      <span className="text-xs font-semibold text-[#6b7772] line-through font-mono">
                        {formatPrice(property.originalPrice)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">You Save</span>
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        {formatPrice(property.savingsAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-auto pt-4 border-t border-[#e2e8e5] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] text-[#6b7772] uppercase tracking-wider font-semibold block">
                        {property.isDayOut ? 'Offer Day Pass' : 'Offer Night Rate'}
                      </span>
                      <span className="text-lg font-black text-[#003528] font-mono">
                        {formatPrice(property.discountedPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => onStartBooking(property)}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Claim Deal</span>
                      <span className="material-symbols-outlined text-sm">local_offer</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
