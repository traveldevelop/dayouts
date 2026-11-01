import React, { useState } from 'react';
import { SanctuaryProperty, Currency, PageType } from '../types';
import { PROPERTIES, USD_EXCHANGE_RATE } from '../data/mockData';

interface VillasStaysPageProps {
  currency: Currency;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onStartBooking: (property: SanctuaryProperty) => void;
  onNavigate: (page: PageType) => void;
  wishlist: string[];
  onToggleWishlist: (propertyId: string) => void;
}

const VILLA_TYPOLOGIES = [
  { id: 'all', label: 'All Stays & Sanctuaries', icon: 'holiday_village' },
  { id: 'villa', label: 'Private Beach & Fort Villas', icon: 'villa' },
  { id: 'cottages', label: 'Colonial Tea Bungalows', icon: 'cottage' },
  { id: 'chalets', label: 'Mountain Ridge Chalets', icon: 'cabin' },
  { id: 'glamping', label: 'Luxury Safari & Glamping', icon: 'camping' }
];

export const VillasStaysPage: React.FC<VillasStaysPageProps> = ({
  currency,
  onSelectProperty,
  onStartBooking,
  onNavigate,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedTypology, setSelectedTypology] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [filterChefOnly, setFilterChefOnly] = useState<boolean>(false);
  const [filterPoolOnly, setFilterPoolOnly] = useState<boolean>(false);

  // Stays: properties that offer overnight stays (passType === 'stay' || passType === 'dual' or have pricePerStayLkr)
  const villaProperties = PROPERTIES.filter((p) => {
    // Only stays or dual passes or properties that have overnight stays
    const hasStay = p.passType === 'stay' || p.passType === 'dual' || (p.pricePerStayLkr && p.pricePerStayLkr > 0);
    if (!hasStay) return false;

    // Location filter
    if (selectedLocation !== 'all') {
      const match = `${p.district} ${p.location} ${p.province}`.toLowerCase().includes(selectedLocation.toLowerCase());
      if (!match) return false;
    }

    // Typology filter
    if (selectedTypology !== 'all') {
      const pCat = (p.category || '').toLowerCase();
      const pName = p.name.toLowerCase();
      const pTag = p.tagline.toLowerCase();
      const text = `${pCat} ${pName} ${pTag}`;

      if (selectedTypology === 'villa' && !text.includes('villa') && !text.includes('fort') && !text.includes('sanctuary')) return false;
      if (selectedTypology === 'cottages' && !text.includes('cottage') && !text.includes('tea') && !text.includes('bungalow')) return false;
      if (selectedTypology === 'chalets' && !text.includes('chalet') && !text.includes('cabin') && !text.includes('mountain') && !text.includes('ella')) return false;
      if (selectedTypology === 'glamping' && !text.includes('glamping') && !text.includes('tent') && !text.includes('safari') && !text.includes('yala')) return false;
    }

    // Inclusions filters
    if (filterChefOnly) {
      const hasChef = p.inclusions.some((inc) => inc.toLowerCase().includes('chef') || inc.toLowerCase().includes('butler')) ||
        p.features.some((f) => f.toLowerCase().includes('chef') || f.toLowerCase().includes('butler'));
      if (!hasChef) return false;
    }

    if (filterPoolOnly) {
      const hasPool = p.inclusions.some((inc) => inc.toLowerCase().includes('pool')) ||
        p.features.some((f) => f.toLowerCase().includes('pool')) ||
        p.name.toLowerCase().includes('pool');
      if (!hasPool) return false;
    }

    return true;
  });

  const formatPrice = (lkrAmount: number) => {
    if (currency === 'USD') {
      return `$${(lkrAmount / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkrAmount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24">
      {/* Luxury Stays Hero Banner */}
      <section className="relative bg-[#00281e] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background motif */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#a7f3d0_1px,transparent_1px)] [background-size:28px_28px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="material-symbols-outlined text-sm">villa</span>
            Overnight Luxury &amp; Private Stays
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-white leading-tight">
                Private Villas, Colonial Tea Bungalows &amp; Glamping
              </h1>
              <p className="mt-3 text-base sm:text-lg text-emerald-100/80 leading-relaxed">
                Rent exclusive whole private villas with dedicated chefs, private infinity plunge pools, and uninterrupted Ceylon landscapes from Galle Fort to the Ella highlands.
              </p>
            </div>

            {/* Curated Stays Stats */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shrink-0">
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-white">{villaProperties.length}</span>
                <span className="text-[11px] text-emerald-200 font-medium">Whole Stays</span>
              </div>
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-amber-300">Private</span>
                <span className="text-[11px] text-emerald-200 font-medium">Chef &amp; Butler</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-white">100%</span>
                <span className="text-[11px] text-emerald-200 font-medium">Exclusive Use</span>
              </div>
            </div>
          </div>

          {/* Typology Selectors */}
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {VILLA_TYPOLOGIES.map((typology) => {
              const active = selectedTypology === typology.id;
              return (
                <button
                  key={typology.id}
                  onClick={() => setSelectedTypology(typology.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#00281e] shadow-md scale-105 font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{typology.icon}</span>
                  <span>{typology.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8e5] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Location selector */}
            <div className="flex items-center gap-2 bg-[#f4f7f6] px-3.5 py-2 rounded-xl border border-[#e2e8e5]">
              <span className="material-symbols-outlined text-[#006a66] text-lg">explore</span>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-[#2d3834] focus:outline-none cursor-pointer"
              >
                <option value="all">All Island Locations</option>
                <option value="Galle">Galle Fort &amp; Southern Coast</option>
                <option value="Bentota">Bentota Riviera</option>
                <option value="Mirissa">Mirissa &amp; Weligama Bay</option>
                <option value="Kandy">Kandy &amp; Hanthana Hills</option>
                <option value="Nuwara Eliya">Nuwara Eliya Tea Gardens</option>
                <option value="Ella">Ella Valley Ridge</option>
                <option value="Sigiriya">Sigiriya Cultural Enclave</option>
                <option value="Yala">Yala Safari Wilderness</option>
              </select>
            </div>

            {/* Checkbox Inclusions */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f4f7f6] cursor-pointer text-xs font-semibold text-[#404945]">
              <input
                type="checkbox"
                checked={filterChefOnly}
                onChange={(e) => setFilterChefOnly(e.target.checked)}
                className="rounded border-[#ccd5d1] text-[#006a66] focus:ring-[#006a66] w-4 h-4 cursor-pointer"
              />
              <span>Private Chef / Butler</span>
            </label>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f4f7f6] cursor-pointer text-xs font-semibold text-[#404945]">
              <input
                type="checkbox"
                checked={filterPoolOnly}
                onChange={(e) => setFilterPoolOnly(e.target.checked)}
                className="rounded border-[#ccd5d1] text-[#006a66] focus:ring-[#006a66] w-4 h-4 cursor-pointer"
              />
              <span>Private Swimming Pool</span>
            </label>
          </div>

          <div className="text-xs font-bold text-[#6b7772]">
            Showing <span className="text-[#00281e] font-extrabold">{villaProperties.length}</span> Exclusive Stays
          </div>
        </div>
      </section>

      {/* Main Stays Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {villaProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e2e8e5] p-8">
            <span className="material-symbols-outlined text-6xl text-[#ccd5d1]">villa</span>
            <h3 className="mt-4 text-xl font-bold text-[#2d3834]">No Villas Match Selected Filters</h3>
            <p className="mt-2 text-sm text-[#6b7772]">Try resetting your filters to explore all private villas and stays.</p>
            <button
              onClick={() => {
                setSelectedTypology('all');
                setSelectedLocation('all');
                setFilterChefOnly(false);
                setFilterPoolOnly(false);
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#00281e] text-white font-semibold text-sm hover:bg-[#004d3b] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {villaProperties.map((property) => {
              const isSaved = wishlist.includes(property.id);
              const stayPrice = property.pricePerStayLkr || (property.priceLkr * 4);

              return (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Luxury Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                    {/* Top Bar Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#00281e]/90 backdrop-blur-sm text-emerald-300 font-bold text-[11px] tracking-wide uppercase border border-emerald-500/30">
                        {property.passType === 'stay' ? 'EXCLUSIVE VILLA' : 'VILLA & RESORT STAY'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(property.id);
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          isSaved
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isSaved ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>

                    {/* Bottom Amenities on Image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-amber-300">bed</span>
                        Sleeps 4 – 10 Guests
                      </span>
                      <span className="bg-emerald-600/90 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                        {property.slotsLeft} Stays Available
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#006a66] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#2d3834] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                        {property.rating} ({property.reviewCount})
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="font-headline text-lg font-bold text-[#00281e] group-hover:text-[#006a66] transition-colors cursor-pointer line-clamp-1"
                    >
                      {property.name}
                    </h3>
                    <p className="text-xs text-[#55635e] line-clamp-1 mt-0.5">{property.tagline}</p>

                    {/* Features chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {property.features.slice(0, 3).map((feat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#f4f7f6] text-[#404945] text-[10px] font-semibold">
                          {feat}
                        </span>
                      ))}
                    </div>

                    {/* Inclusions */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4f2] space-y-1.5">
                      {property.inclusions.slice(0, 3).map((inclusion, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#404945]">
                          <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">done_all</span>
                          <span className="truncate">{inclusion}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing & Reservation */}
                    <div className="mt-auto pt-4 border-t border-[#e2e8e5] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[#6b7772] uppercase tracking-wider font-semibold block">Per Night • Whole Stay</span>
                        <span className="text-lg font-black text-[#00281e] font-mono">
                          {formatPrice(stayPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectProperty(property)}
                          className="px-3 py-2 rounded-xl border border-[#ccd5d1] text-xs font-bold text-[#2d3834] hover:bg-[#f4f7f6] transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onStartBooking(property)}
                          className="px-4 py-2 rounded-xl bg-[#00281e] text-white text-xs font-bold hover:bg-[#004d3b] shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>Reserve Stay</span>
                          <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Villa Concierge & Host Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e2e8e5] shadow-md">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#006a66] text-xs font-bold uppercase tracking-wider border border-emerald-200">
              The DayOuts.lk Villa Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline text-[#00281e] mt-3">
              Why Book Your Sri Lanka Villa With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#006a66] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <h4 className="font-bold text-base text-[#2d3834] mb-2">100% SLTDA Verified Hosts</h4>
              <p className="text-xs text-[#55635e] leading-relaxed">
                Every luxury villa is physically inspected and authenticated under Sri Lanka Tourism Development Authority guidelines.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#006a66] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
              </div>
              <h4 className="font-bold text-base text-[#2d3834] mb-2">Private Chef Coordination</h4>
              <p className="text-xs text-[#55635e] leading-relaxed">
                Enjoy customized Ceylon seafood menus, Jaffna curries, or continental breakfasts prepared fresh in your villa's private kitchen.
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-[#006a66] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
              </div>
              <h4 className="font-bold text-base text-[#2d3834] mb-2">24/7 Island Concierge</h4>
              <p className="text-xs text-[#55635e] leading-relaxed">
                From airport transfers in luxury vans to private whale watching charters in Mirissa, our local concierge is on-call throughout your stay.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
