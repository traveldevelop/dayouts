import React, { useState } from 'react';
import { SanctuaryProperty, Currency, PageType } from '../types';
import { PROPERTIES, USD_EXCHANGE_RATE } from '../data/mockData';

interface DayOutsPageProps {
  currency: Currency;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onStartBooking: (property: SanctuaryProperty) => void;
  onNavigate: (page: PageType) => void;
  wishlist: string[];
  onToggleWishlist: (propertyId: string) => void;
}

const TIME_SLOTS = [
  { id: 'all', label: 'All Time Slots' },
  { id: 'morning', label: 'Morning Pass (9 AM – 2 PM)' },
  { id: 'sunset', label: 'Sunset & Pool (1 PM – 7 PM)' },
  { id: 'fullday', label: 'Full Day Retreat (9 AM – 6 PM)' }
];

const EXPERIENCE_THEMES = [
  { id: 'all', label: 'All Experiences', icon: 'explore' },
  { id: 'pool', label: 'Pool & Cabanas', icon: 'pool' },
  { id: 'adventure', label: 'Rafting & Water Sports', icon: 'kayaking' },
  { id: 'buffet', label: 'Grand Seafood Buffet', icon: 'restaurant' },
  { id: 'hill', label: 'Hill Country Tea & Mist', icon: 'landscape' },
  { id: 'beach', label: 'Beachfront Lounges', icon: 'beach_access' }
];

export const DayOutsPage: React.FC<DayOutsPageProps> = ({
  currency,
  onSelectProperty,
  onStartBooking,
  onNavigate,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [filterByobOnly, setFilterByobOnly] = useState<boolean>(false);
  const [filterBuffetOnly, setFilterBuffetOnly] = useState<boolean>(false);

  // Filter only properties suited for Day Outs (passType === 'dayout' | 'dual' | 'adventure')
  const dayOutProperties = PROPERTIES.filter((p) => {
    // Only day outs or dual passes or adventure
    if (p.passType !== 'dayout' && p.passType !== 'dual' && p.passType !== 'adventure') {
      return false;
    }

    // District filter
    if (selectedDistrict !== 'all') {
      const match = `${p.district} ${p.location} ${p.province}`.toLowerCase().includes(selectedDistrict.toLowerCase());
      if (!match) return false;
    }

    // Theme filter
    if (selectedTheme !== 'all') {
      const textToSearch = `${p.name} ${p.tagline} ${p.description || ''} ${p.category || ''} ${p.inclusions.join(' ')} ${p.features.join(' ')}`.toLowerCase();
      if (selectedTheme === 'pool' && !textToSearch.includes('pool') && !textToSearch.includes('cabana')) return false;
      if (selectedTheme === 'adventure' && !textToSearch.includes('rafting') && !textToSearch.includes('adventure') && !textToSearch.includes('safari') && !textToSearch.includes('kayak')) return false;
      if (selectedTheme === 'buffet' && !textToSearch.includes('buffet') && !textToSearch.includes('seafood') && !textToSearch.includes('bbq')) return false;
      if (selectedTheme === 'hill' && !textToSearch.includes('kandy') && !textToSearch.includes('nuwara eliya') && !textToSearch.includes('ella') && !textToSearch.includes('tea')) return false;
      if (selectedTheme === 'beach' && !textToSearch.includes('beach') && !textToSearch.includes('bentota') && !textToSearch.includes('ocean') && !textToSearch.includes('mirissa')) return false;
    }

    // Inclusions filters
    if (filterByobOnly) {
      const hasByob = p.inclusions.some((inc) => inc.toLowerCase().includes('byob')) ||
        p.features.some((f) => f.toLowerCase().includes('byob')) ||
        p.id === 'dutch-fort-villa-galle' ||
        p.id === 'cinnamon-wild-bentota';
      if (!hasByob) return false;
    }

    if (filterBuffetOnly) {
      const hasBuffet = p.inclusions.some((inc) => inc.toLowerCase().includes('buffet') || inc.toLowerCase().includes('bbq') || inc.toLowerCase().includes('lunch'));
      if (!hasBuffet) return false;
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
      {/* Hero Banner Section */}
      <section className="relative bg-[#003528] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#26a69a_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="material-symbols-outlined text-sm">wb_sunny</span>
            Day-Out Packages &amp; Pool Cabanas
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-white leading-tight">
                Sri Lanka's Finest Day Out Escapes &amp; Pool Passes
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[#c5ded5] leading-relaxed">
                Enjoy luxury swimming pools, lavish seafood buffets, private cabanas, water sports, and changing suites. Instant digital confirmation with no overnight room charge required.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shrink-0">
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-white">{dayOutProperties.length}</span>
                <span className="text-[11px] text-emerald-200 font-medium">Day Passes</span>
              </div>
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-amber-300">100%</span>
                <span className="text-[11px] text-emerald-200 font-medium">Pool Access</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-white">0%</span>
                <span className="text-[11px] text-emerald-200 font-medium">Overnight Fee</span>
              </div>
            </div>
          </div>

          {/* Quick Experience Filter Chips */}
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {EXPERIENCE_THEMES.map((theme) => {
              const active = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#003528] shadow-md scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{theme.icon}</span>
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8e5] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Destination Dropdown */}
            <div className="flex items-center gap-2 bg-[#f4f7f6] px-3.5 py-2 rounded-xl border border-[#e2e8e5]">
              <span className="material-symbols-outlined text-[#006a66] text-lg">location_on</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-[#2d3834] focus:outline-none cursor-pointer"
              >
                <option value="all">All Sri Lanka Regions</option>
                <option value="Bentota">Bentota &amp; Aluthgama</option>
                <option value="Colombo">Colombo &amp; Mount Lavinia</option>
                <option value="Galle">Galle &amp; Unawatuna</option>
                <option value="Kandy">Kandy &amp; Central Hills</option>
                <option value="Kitulgala">Kitulgala &amp; Rafting</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Ella">Ella Mountain Ridge</option>
              </select>
            </div>

            {/* Time Slot Filter */}
            <div className="flex items-center gap-2 bg-[#f4f7f6] px-3.5 py-2 rounded-xl border border-[#e2e8e5]">
              <span className="material-symbols-outlined text-[#006a66] text-lg">schedule</span>
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-[#2d3834] focus:outline-none cursor-pointer"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Inclusions */}
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f4f7f6] cursor-pointer text-xs font-semibold text-[#404945]">
              <input
                type="checkbox"
                checked={filterBuffetOnly}
                onChange={(e) => setFilterBuffetOnly(e.target.checked)}
                className="rounded border-[#ccd5d1] text-[#006a66] focus:ring-[#006a66] w-4 h-4 cursor-pointer"
              />
              <span>Buffet Lunch Included</span>
            </label>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#f4f7f6] cursor-pointer text-xs font-semibold text-[#404945]">
              <input
                type="checkbox"
                checked={filterByobOnly}
                onChange={(e) => setFilterByobOnly(e.target.checked)}
                className="rounded border-[#ccd5d1] text-[#006a66] focus:ring-[#006a66] w-4 h-4 cursor-pointer"
              />
              <span>BYOB / Corkage-Free</span>
            </label>
          </div>

          <div className="text-xs font-bold text-[#6b7772]">
            Showing <span className="text-[#003528] font-extrabold">{dayOutProperties.length}</span> Day Out Packages
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {dayOutProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#e2e8e5] p-8">
            <span className="material-symbols-outlined text-6xl text-[#ccd5d1]">pool</span>
            <h3 className="mt-4 text-xl font-bold text-[#2d3834]">No Day Out Packages Match Your Filters</h3>
            <p className="mt-2 text-sm text-[#6b7772]">Try clearing some filters to see all available resort day passes.</p>
            <button
              onClick={() => {
                setSelectedTheme('all');
                setSelectedDistrict('all');
                setFilterBuffetOnly(false);
                setFilterByobOnly(false);
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#003528] text-white font-semibold text-sm hover:bg-[#004d3b] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {dayOutProperties.map((property) => {
              const isSaved = wishlist.includes(property.id);
              return (
                <div
                  key={property.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  {/* Image & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={property.imageUrl}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Bar on Image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-[#003528]/90 backdrop-blur-sm text-emerald-300 font-bold text-[11px] tracking-wide uppercase border border-emerald-500/30">
                        {property.passTypeLabel || 'DAY PASS'}
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
                        title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isSaved ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>

                    {/* Hours & Availability Pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="flex items-center gap-1.5 font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-amber-300">schedule</span>
                        {property.timeSlot}
                      </span>
                      <span className="bg-emerald-600/90 font-bold px-2.5 py-1 rounded-lg text-[11px]">
                        {property.slotsLeft} Passes Left
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Location & Rating */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                      <span className="flex items-center gap-1 text-[#006a66] font-semibold truncate">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1 font-bold text-[#2d3834] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
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

                    {/* Inclusions Checkmarks */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4f2] space-y-1.5">
                      {property.inclusions.slice(0, 3).map((inclusion, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#404945]">
                          <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">check_circle</span>
                          <span className="truncate">{inclusion}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-4 border-t border-[#e2e8e5] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] text-[#6b7772] uppercase tracking-wider font-semibold block">Per Person Pass</span>
                        <span className="text-lg font-black text-[#003528] font-mono">
                          {formatPrice(property.priceLkr)}
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
                          className="px-4 py-2 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b] shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>Book Pass</span>
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

      {/* Sri Lankan Day-Out Information Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-[#003528] to-[#00523e] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold uppercase tracking-wider">
              DayOuts.lk Guest Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-headline mt-3">
              How Day Out Passes Work in Sri Lanka
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg mb-3">
                  1
                </span>
                <h4 className="font-bold text-base mb-1">Instant QR Pass</h4>
                <p className="text-xs text-[#c5ded5] leading-relaxed">
                  Lock your slot online with 20% advance or full payment. Receive an instant SLTDA-standard QR voucher on your phone.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg mb-3">
                  2
                </span>
                <h4 className="font-bold text-base mb-1">Check In &amp; Swim</h4>
                <p className="text-xs text-[#c5ded5] leading-relaxed">
                  Arrive at the resort gate, present your voucher, and head directly to your reserved pool cabana and changing suite.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <span className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg mb-3">
                  3
                </span>
                <h4 className="font-bold text-base mb-1">Seafood Feast &amp; BYOB</h4>
                <p className="text-xs text-[#c5ded5] leading-relaxed">
                  Savor the grand buffet lunch, afternoon Ceylon tea, and BYOB privileges at verified participating properties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
