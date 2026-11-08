import React, { useState, useEffect } from 'react';
import { SanctuaryProperty, Currency, PageType } from '../types';
import { PROPERTIES, USD_EXCHANGE_RATE, HERO_BANNER_IMAGE } from '../data/mockData';

interface ExplorePageProps {
  currency: Currency;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onStartBooking: (property: SanctuaryProperty) => void;
  onNavigate: (page: PageType) => void;
  wishlist: string[];
  onToggleWishlist: (propertyId: string) => void;
  currentPage?: PageType;
  properties?: SanctuaryProperty[];
  onOpenAiCreator?: () => void;
}

const TYPOLOGIES = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'cabana', label: 'Cabana', icon: 'deck' },
  { id: 'villa', label: 'Villa', icon: 'villa' },
  { id: 'glamping', label: 'Glamping', icon: 'camping' },
  { id: 'cottages', label: 'Cottages', icon: 'cottage' },
  { id: 'chalets', label: 'Chalets', icon: 'cabin' }
];

export const ExplorePage: React.FC<ExplorePageProps> = ({
  currency,
  onSelectProperty,
  onStartBooking,
  onNavigate,
  wishlist,
  onToggleWishlist,
  currentPage = 'explore-stays',
  properties = PROPERTIES,
  onOpenAiCreator
}) => {
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedTypology, setSelectedTypology] = useState<string>('all');
  const [passTypeFilter, setPassTypeFilter] = useState<'all' | 'dayout' | 'stay'>('all');
  const [searchDate, setSearchDate] = useState<string>('2025-04-20');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>(null);

  // Sync passTypeFilter when navigated from top menu
  useEffect(() => {
    if (currentPage === 'day-out-packages') {
      setPassTypeFilter('dayout');
    } else if (currentPage === 'villas-stays') {
      setPassTypeFilter('stay');
    } else if (currentPage === 'explore-stays') {
      setPassTypeFilter('all');
    }
  }, [currentPage]);

  // Filter properties
  const allPropertiesList = properties && properties.length > 0 ? properties : PROPERTIES;
  const filteredProperties = allPropertiesList.filter((p) => {
    // Destination filter
    if (selectedDestination !== 'all') {
      const destClean = selectedDestination.toLowerCase().replace(/-/g, ' ');
      const searchTarget = `${p.district} ${p.location} ${p.province} ${p.name} ${p.description || ''}`.toLowerCase();
      const matchLoc = searchTarget.includes(destClean) || searchTarget.includes(selectedDestination.toLowerCase());
      if (!matchLoc) return false;
    }

    // Pass Type filter
    if (passTypeFilter === 'dayout' && p.passType !== 'dayout' && p.passType !== 'dual' && p.passType !== 'adventure') {
      return false;
    }
    if (passTypeFilter === 'stay' && p.passType !== 'stay' && p.passType !== 'dual') {
      return false;
    }

    // Category / Typology filter (All, Cabana, Villa, Glamping, Cottages, Chalets)
    if (selectedTypology !== 'all') {
      const pCategory = (p.category || '').toLowerCase();
      const pName = p.name.toLowerCase();
      const pTagline = p.tagline.toLowerCase();
      const pDesc = (p.description || '').toLowerCase();
      const pTypeLabel = p.passTypeLabel.toLowerCase();
      const textToSearch = `${pCategory} ${pName} ${pTagline} ${pDesc} ${pTypeLabel}`;

      if (selectedTypology === 'cabana' && !textToSearch.includes('cabana') && !textToSearch.includes('pavilion')) {
        return false;
      }
      if (selectedTypology === 'villa' && !textToSearch.includes('villa') && !textToSearch.includes('sanctuary')) {
        return false;
      }
      if (selectedTypology === 'glamping' && !textToSearch.includes('glamping') && !textToSearch.includes('eco') && !textToSearch.includes('tent')) {
        return false;
      }
      if (selectedTypology === 'cottages' && !textToSearch.includes('cottage') && !textToSearch.includes('chalet') && !textToSearch.includes('cabin')) {
        return false;
      }
      if (selectedTypology === 'chalets' && !textToSearch.includes('chalet') && !textToSearch.includes('cabin')) {
        return false;
      }
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
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BANNER_IMAGE}
            alt="Sri Lanka Tropical Luxury Sanctuaries"
            className="w-full h-full object-cover object-center scale-105 transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002118] via-[#002118]/70 to-[#002118]/40 backdrop-blur-[0.5px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-6">
            <span className="material-symbols-outlined text-sm text-[#9cf1ec]">verified</span>
            <span>SLTDA Certified Day Escapes &amp; Luxury Villas</span>
          </div>

          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl text-balance">
            Handcrafted Sri Lankan Day Out &amp; Private Villa Escapes
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl font-normal leading-relaxed">
            Reserve verified oceanfront pool pavilions, colonial rampart villas, and misty tea-ridge chalets with instant gate passes.
          </p>

          {/* Search Bar Console */}
          <div className="w-full max-w-4xl mt-10 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-[#e2e8e5] text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Destination */}
              <div className="p-2 sm:p-3 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635e] mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a66] text-lg">location_on</span>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#003528] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Sri Lanka (සියලුම ප්‍රදේශ)</option>

                    <optgroup label="Western Province (බස්නාහිර)">
                      <option value="colombo">Colombo & Suburbs (කොළඹ)</option>
                      <option value="negombo">Negombo Beach (මීගමුව)</option>
                      <option value="mount-lavinia">Mount Lavinia (ගල්කිස්ස)</option>
                      <option value="kalutara">Kalutara & Wadduwa (කළුතර)</option>
                    </optgroup>

                    <optgroup label="Southern Coast & Riviera (දකුණු වෙරළ)">
                      <option value="bentota">Bentota & Beruwala (බෙන්තොට)</option>
                      <option value="galle">Galle Historic Fort (ගාල්ල)</option>
                      <option value="unawatuna">Unawatuna Bay (උණවටුන)</option>
                      <option value="hikkaduwa">Hikkaduwa Coral Reef (හික්කඩුව)</option>
                      <option value="mirissa">Mirissa & Weligama (මිරිස්ස / වැලිගම)</option>
                      <option value="tangalle">Tangalle & Hiriketiya (තංගල්ල)</option>
                      <option value="matara">Matara Coast (මාතර)</option>
                    </optgroup>

                    <optgroup label="Central Highlands & Tea Hills (මධ්‍යම කඳුකරය)">
                      <option value="kandy">Kandy & Hanthana (මහනුවර)</option>
                      <option value="nuwara eliya">Nuwara Eliya & Little England (නුවරඑළිය)</option>
                      <option value="ella">Ella & Badulla Valley (ඇල්ල)</option>
                      <option value="hatton">Hatton & Maskeliya (හැටන්)</option>
                      <option value="kitulgala">Kitulgala Rainforest (කිතුල්ගල)</option>
                    </optgroup>

                    <optgroup label="Cultural Triangle (සංස්කෘතික ත්‍රිකෝණය)">
                      <option value="sigiriya">Sigiriya & Dambulla (සීගිරිය / දඹුල්ල)</option>
                      <option value="anuradhapura">Anuradhapura Sacred City (අනුරාධපුරය)</option>
                      <option value="polonnaruwa">Polonnaruwa Ancient Kingdom (පොළොන්නරුව)</option>
                      <option value="kurunegala">Kurunegala (කුරුණෑගල)</option>
                    </optgroup>

                    <optgroup label="Wildlife & Nature Sanctuaries (වනජීවී සහ ස්වභාවික)">
                      <option value="yala">Yala & Tissamaharama (යාල)</option>
                      <option value="udawalawe">Udawalawe Elephant Sanctuary (උඩවලව)</option>
                      <option value="wilpattu">Wilpattu National Park (විල්පත්තුව)</option>
                      <option value="sinharaja">Sinharaja Rainforest (සිංහරාජය)</option>
                    </optgroup>

                    <optgroup label="East & North Coast (නැගෙනහිර සහ උතුර)">
                      <option value="trincomalee">Trincomalee & Nilaveli (ත්‍රිකුණාමලය)</option>
                      <option value="arugam bay">Arugam Bay Surf Haven (ආරුගම්බේ)</option>
                      <option value="pasikudah">Pasikudah Shallow Bay (පාසිකුඩා)</option>
                      <option value="jaffna">Jaffna Peninsula (යාපනය)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Pass Mode */}
              <div className="p-2 sm:p-3 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635e] mb-1">
                  Pass Typology
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a66] text-lg">schedule</span>
                  <select
                    value={passTypeFilter}
                    onChange={(e) => setPassTypeFilter(e.target.value as any)}
                    className="w-full bg-transparent text-sm font-semibold text-[#003528] focus:outline-none cursor-pointer"
                  >
                    <option value="all">Day Out &amp; Overnight</option>
                    <option value="dayout">Day Out Passes Only</option>
                    <option value="stay">Overnight Villa Stays</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="p-2 sm:p-3 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635e] mb-1">
                  Travel Date
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a66] text-lg">calendar_today</span>
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-[#003528] focus:outline-none cursor-pointer font-mono"
                  />
                </div>
              </div>

              {/* Guests & Search Button */}
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2 sm:p-3 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#55635e] mb-1">
                    Guests
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#006a66] text-lg">group</span>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-transparent text-sm font-semibold text-[#003528] focus:outline-none cursor-pointer"
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests (Couple)</option>
                      <option value={4}>4 Guests (Family)</option>
                      <option value={6}>6+ Guests (Group)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const section = document.getElementById('escapes-grid');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="h-full px-5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white flex items-center justify-center font-bold text-sm shadow-md transition cursor-pointer shrink-0"
                  title="Search sanctuaries"
                >
                  <span className="material-symbols-outlined">search</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Listing Quick Banner for Hosts */}
          {onOpenAiCreator && (
            <div className="mt-5 flex items-center justify-center">
              <button
                type="button"
                onClick={onOpenAiCreator}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold border border-white/30 transition shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-teal-300 animate-pulse">auto_awesome</span>
                <span>Hotel or Villa Owner? <strong>Paste WhatsApp/Promo Text to Add Listing with AI</strong></span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Typology Bar Filter */}
      <section className="border-b border-[#e2e8e5] bg-white sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 shrink-0 py-1">
            {TYPOLOGIES.map((typ) => {
              const isSelected = selectedTypology === typ.id;
              return (
                <button
                  key={typ.id}
                  onClick={() => setSelectedTypology(typ.id)}
                  aria-pressed={isSelected}
                  className={`group px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 select-none ${
                    isSelected
                      ? 'bg-[#003528] text-white font-bold shadow-md shadow-[#003528]/25 scale-105 ring-2 ring-[#003528]/25 ring-offset-1 ring-offset-white z-10'
                      : 'bg-[#f4f7f6] text-[#55635e] font-medium border border-[#e2e8e5] hover:text-[#003528] hover:bg-[#ebf0ee] hover:border-[#c8d4ce] hover:scale-102 active:scale-95'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                      isSelected ? 'text-[#9cf1ec] scale-110' : 'text-[#6b7772] group-hover:text-[#003528]'
                    }`}
                  >
                    {typ.icon}
                  </span>
                  <span className="tracking-tight">{typ.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-[#55635e] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#006a66]"></span>
            <span>{filteredProperties.length} Sanctuaries Available</span>
          </div>
        </div>
      </section>

      {/* Main Grid & Interactive Map Section */}
      <section id="escapes-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#e2e8e5] gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#006a66] mb-1">
              Curated Sri Lankan Sanctuaries
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#003528] tracking-tight">
              Verified Day Out Passes &amp; Exclusive Stays
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#55635e]">Showing:</span>
            <span className="text-xs font-bold text-[#003528] bg-[#f4f7f6] px-3 py-1.5 rounded-lg border border-[#e2e8e5] capitalize">
              {selectedDestination === 'all' ? 'All Sri Lanka' : selectedDestination.replace(/-/g, ' ')}
            </span>
          </div>
        </div>

        {/* Contextual Top Menu Spotlight Banners */}
        {currentPage === 'deals-and-offers' && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#003528] to-[#006a66] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-emerald-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-amber-300 text-2xl">local_offer</span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Limited Island Offers
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold mt-1">
                  Exclusive Day Out &amp; Stay Discounts
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Save up to 25% on verified Bentota, Galle, Kandy &amp; Ella retreats with instant SLTDA voucher locking.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-2 rounded-xl bg-amber-400 text-[#003528] font-bold text-xs uppercase tracking-wider shadow-sm font-mono">
                PROMO: DAYOUT25
              </span>
            </div>
          </div>
        )}

        {currentPage === 'corporate-events' && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0f2c25] to-[#144237] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-teal-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-teal-300 text-2xl">groups</span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-400 text-[#003528] text-[10px] font-bold uppercase tracking-wider">
                  Corporate &amp; Group Outings
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold mt-1">
                  Company Day-Outs, Team Building &amp; Event Sanctuaries
                </h3>
                <p className="text-xs text-teal-100 mt-0.5">
                  Tailored seafood buffets, private cabanas, water sports, and dedicated lawns for 10 to 150+ team members.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const sec = document.getElementById('escapes-grid');
                sec?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#003528] font-bold text-xs shrink-0 cursor-pointer transition shadow-sm"
            >
              Explore Group Passes
            </button>
          </div>
        )}

        {/* 3-Column Luxury Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            const isSaved = wishlist.includes(property.id);

            return (
              <div
                key={property.id}
                className="bg-white rounded-2xl border border-[#e2e8e5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Property Image Showcase */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Top Badges & Actions */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[#9cf1ec] text-sm">verified</span>
                      {property.passTypeLabel}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(property.id);
                      }}
                      className="pointer-events-auto w-9 h-9 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-[#404945] hover:text-rose-500 flex items-center justify-center transition shadow-sm cursor-pointer"
                      title={isSaved ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      aria-label="Wishlist"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'text-rose-500 font-variation-fill' : ''}`}>
                        favorite
                      </span>
                    </button>
                  </div>

                  {/* Bottom Time Slot Chip */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#003528] px-2.5 py-1 rounded-md text-[11px] font-mono font-medium shadow-xs">
                    {property.timeSlot}
                  </div>
                </div>

                {/* Property Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location & Reviews metadata */}
                    <div className="flex items-center justify-between text-xs text-[#55635e] mb-1.5">
                      <span className="truncate">{property.location}</span>
                      <span className="font-bold text-[#003528] flex items-center gap-1 shrink-0 ml-2">
                        <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                        {property.rating} ({property.reviewCount})
                      </span>
                    </div>

                    {/* Property Title */}
                    <h3
                      onClick={() => onSelectProperty(property)}
                      className="font-headline text-lg font-bold text-[#003528] group-hover:text-[#006a66] transition cursor-pointer leading-snug line-clamp-2"
                    >
                      {property.name}
                    </h3>

                    {/* Tagline / Inclusions Preview */}
                    <p className="mt-2 text-xs text-[#55635e] line-clamp-2 leading-relaxed">
                      {property.tagline} • Includes: {property.inclusions.slice(0, 2).join(' · ')}
                    </p>
                  </div>

                  {/* Pricing & Reservation CTAs */}
                  <div className="mt-5 pt-4 border-t border-[#f0f4f2] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#55635e] block">
                        From
                      </span>
                      <div className="font-headline text-xl font-black text-[#003528] tabular-nums">
                        {formatPrice(property.priceLkr)}
                        <span className="text-xs font-normal text-[#55635e] font-body ml-1">
                          / guest
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProperty(property)}
                        className="px-3 py-2 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#003528] hover:bg-[#f4f7f6] transition cursor-pointer"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onStartBooking(property)}
                        className="px-4 py-2 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold shadow-xs transition cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e2e8e5] p-8 max-w-lg mx-auto">
            <span className="material-symbols-outlined text-4xl text-[#006a66] mb-3">travel_explore</span>
            <h3 className="font-headline text-lg font-bold text-[#003528]">No sanctuaries found</h3>
            <p className="text-xs text-[#55635e] mt-1 mb-4">
              Try adjusting your destination or typology filters to find available day passes and stays.
            </p>
            <button
              onClick={() => {
                setSelectedDestination('all');
                setSelectedTypology('all');
                setPassTypeFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#003528] text-white text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Interactive Sanctuary Map Explorer Block */}
        <div className="mt-16 bg-white rounded-3xl border border-[#e2e8e5] shadow-sm p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#f0f4f2] gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                Island Geographic Discovery
              </span>
              <h3 className="font-headline text-2xl font-bold text-[#003528] mt-0.5">
                Sri Lanka Sanctuary Hotspots
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#55635e]">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#003528]"></span>
                Coastal Riviera
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006a66]"></span>
                Central Highlands
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Interactive Map Visual */}
            <div className="lg:col-span-2 relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#eaf4f3] border border-[#d2e4e1] flex items-center justify-center p-4">
              {/* SVG Stylized Map of Sri Lanka with interactive hotspot pins */}
              <svg viewBox="0 0 400 500" className="h-full w-auto drop-shadow-md">
                {/* Island Outline */}
                <path
                  d="M 180 30 C 230 60, 260 120, 270 200 C 280 270, 275 350, 240 420 C 210 470, 160 480, 130 450 C 100 410, 110 320, 120 250 C 130 180, 140 100, 170 40 Z"
                  fill="#cbe5df"
                  stroke="#89b8af"
                  strokeWidth="2.5"
                />

                {/* Colombo Pin */}
                <g
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMapPin('colombo')}
                >
                  <circle cx="125" cy="310" r="8" fill="#003528" />
                  <circle cx="125" cy="310" r="14" fill="#003528" opacity="0.2" className="animate-ping" />
                  <text x="140" y="314" fontSize="11" fontWeight="700" fill="#003528" fontFamily="Plus Jakarta Sans">
                    Colombo (18)
                  </text>
                </g>

                {/* Bentota Pin */}
                <g
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMapPin('bentota')}
                >
                  <circle cx="135" cy="360" r="10" fill="#006a66" />
                  <circle cx="135" cy="360" r="18" fill="#006a66" opacity="0.3" className="animate-ping" />
                  <text x="155" y="364" fontSize="12" fontWeight="800" fill="#006a66" fontFamily="Plus Jakarta Sans">
                    Bentota (32)
                  </text>
                </g>

                {/* Galle Fort Pin */}
                <g
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMapPin('galle')}
                >
                  <circle cx="155" cy="425" r="9" fill="#003528" />
                  <circle cx="155" cy="425" r="16" fill="#003528" opacity="0.25" className="animate-ping" />
                  <text x="175" y="429" fontSize="11" fontWeight="700" fill="#003528" fontFamily="Plus Jakarta Sans">
                    Galle Fort (24)
                  </text>
                </g>

                {/* Ella Pin */}
                <g
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMapPin('ella')}
                >
                  <circle cx="230" cy="340" r="9" fill="#006a66" />
                  <circle cx="230" cy="340" r="16" fill="#006a66" opacity="0.25" className="animate-ping" />
                  <text x="245" y="344" fontSize="11" fontWeight="700" fill="#006a66" fontFamily="Plus Jakarta Sans">
                    Ella Valley (14)
                  </text>
                </g>

                {/* Kitulgala Pin */}
                <g
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedMapPin('kitulgala')}
                >
                  <circle cx="170" cy="315" r="8" fill="#003528" />
                  <text x="185" y="318" fontSize="10" fontWeight="700" fill="#003528" fontFamily="Plus Jakarta Sans">
                    Kitulgala (8)
                  </text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold text-[#003528] shadow-xs">
                Click any hotspot to focus escapes
              </div>
            </div>

            {/* Selected Hotspot Card */}
            <div className="bg-[#f4f7f6] p-6 rounded-2xl border border-[#e2e8e5] flex flex-col justify-between h-full">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#006a66]">
                  Active Geographic Cluster
                </span>
                <h4 className="font-headline text-xl font-bold text-[#003528] mt-1">
                  {selectedMapPin === 'bentota'
                    ? 'Bentota Riviera Coastal Enclave'
                    : selectedMapPin === 'galle'
                    ? 'Galle Fort UNESCO Heritage Ramparts'
                    : selectedMapPin === 'ella'
                    ? 'Ella Ridge & Tea Highlands'
                    : selectedMapPin === 'kitulgala'
                    ? 'Kitulgala Kelani Rainforest River'
                    : 'Western & Southern Coastal Corridor'}
                </h4>
                <p className="text-xs text-[#55635e] mt-2 leading-relaxed">
                  Direct access from Colombo via the Southern Expressway (E01). All properties verified with SLTDA registration, private pool facilities, and verified security clearance.
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[#003528]">
                    <span>Highway Transit:</span>
                    <strong className="font-mono">1h 15m (E01 Exit)</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#003528]">
                    <span>Available Day Passes:</span>
                    <strong className="font-mono">42 Slots Today</strong>
                  </div>
                  <div className="flex items-center justify-between text-[#003528]">
                    <span>Average Pass Price:</span>
                    <strong className="font-mono">LKR 6,800</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedDestination(selectedMapPin || 'bentota');
                  const el = document.getElementById('escapes-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#003528] text-white text-xs font-bold hover:bg-[#004d3b] transition"
              >
                Filter Escapes in this Zone
              </button>
            </div>
          </div>
        </div>

        {/* SLTDA Regulatory Trust Strip */}
        <div className="mt-16 p-8 rounded-3xl bg-[#003528] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#9cf1ec] shrink-0">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <div>
              <h4 className="font-headline text-lg sm:text-xl font-bold tracking-tight">
                Sri Lanka Tourism Development Authority (SLTDA) Assurance
              </h4>
              <p className="text-xs text-white/80 mt-1 max-w-xl">
                Every sanctuary undergoes rigorous on-site hygiene, pool chemical verification, and security screening. 100% money-back guarantee under SLTDA Escrow.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-teal-200">
              Gazette Verified #7712
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
