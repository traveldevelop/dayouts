import React, { useState } from 'react';
import { CabanaUnit, Currency, CabanaPackageTier, CabanaSpecifications } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';
import { getCabanaSpecifications } from '../data/cabanasData';

interface SubCabanaSpecificationsAccordionProps {
  cabanas: CabanaUnit[];
  currency: Currency;
  selectedCabana: CabanaUnit;
  selectedTier?: CabanaPackageTier;
  onSelectCabana: (cabana: CabanaUnit, tier?: CabanaPackageTier) => void;
  onOpenModal: (cabana: CabanaUnit, tab?: 'photos' | 'specs' | 'pricing' | 'layout') => void;
}

export const SubCabanaSpecificationsAccordion: React.FC<SubCabanaSpecificationsAccordionProps> = ({
  cabanas,
  currency,
  selectedCabana,
  selectedTier,
  onSelectCabana,
  onOpenModal
}) => {
  // Default expanded to the currently selected cabana
  const [expandedId, setExpandedId] = useState<string | null>(selectedCabana.id);
  // Store active photo index per cabana
  const [activePhotoIdxByCabana, setActivePhotoIdxByCabana] = useState<Record<string, number>>({});

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const toggleAccordion = (cabanaId: string) => {
    setExpandedId((prev) => (prev === cabanaId ? null : cabanaId));
  };

  const setPhotoIndex = (e: React.MouseEvent, cabanaId: string, idx: number) => {
    e.stopPropagation();
    setActivePhotoIdxByCabana((prev) => ({
      ...prev,
      [cabanaId]: idx
    }));
  };

  return (
    <div className="space-y-4">
      {cabanas.map((cabana) => {
        const isExpanded = expandedId === cabana.id;
        const isSelected = selectedCabana.id === cabana.id;
        const specs: CabanaSpecifications = cabana.specifications || getCabanaSpecifications(cabana);
        const pkg = cabana.packageDetails;
        const tiers = pkg?.packageTiers || [];

        const currentPhotoIdx = activePhotoIdxByCabana[cabana.id] || 0;
        const currentPhoto = cabana.images[currentPhotoIdx] || cabana.coverImage;

        return (
          <div
            key={cabana.id}
            className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden bg-white shadow-xs ${
              isSelected
                ? 'border-[#003528] ring-2 ring-[#003528]/15'
                : 'border-[#e2e8e5] hover:border-[#ccd5d1]'
            }`}
          >
            {/* Accordion Item Header */}
            <div
              onClick={() => toggleAccordion(cabana.id)}
              className={`p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none transition ${
                isExpanded ? 'bg-[#f8faf9] border-b border-[#e2e8e5]' : 'bg-white hover:bg-[#fafbfb]'
              }`}
            >
              {/* Left Info: Code, Thumbnail, Title & Type */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Thumbnail Avatar */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-[#e2e8e5] shadow-xs">
                  <img
                    src={cabana.coverImage}
                    alt={cabana.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white font-mono text-[9px] font-bold text-center py-0.5">
                    {cabana.code}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#003528] text-white text-[11px] font-mono font-bold">
                      {cabana.code}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[#006a66]">
                      {cabana.typeLabel}
                    </span>
                    <span className="text-xs text-[#55635e] font-medium hidden sm:inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-[#006a66]">group</span>
                      {cabana.capacity}
                    </span>
                    <span className="text-xs text-[#55635e] font-mono hidden md:inline">
                      • {specs.floorAreaSqFt} sq.ft
                    </span>
                  </div>

                  <h3 className="font-headline text-base sm:text-lg font-bold text-[#003528] truncate">
                    {cabana.name}
                  </h3>
                  <p className="text-xs text-[#55635e] truncate hidden sm:block">
                    {cabana.tagline}
                  </p>
                </div>
              </div>

              {/* Right Action: Price, Selected Badge & Expand Chevron */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Cabana Pricing</span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#003528]">
                    {cabana.priceDeltaLkr === 0 ? (
                      <span className="text-emerald-700 font-bold">Included</span>
                    ) : (
                      <span>+ {formatPrice(cabana.priceDeltaLkr)} Upgrade</span>
                    )}
                  </span>
                </div>

                {isSelected && (
                  <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-xs">check</span>
                    SELECTED
                  </span>
                )}

                <button
                  type="button"
                  aria-label={isExpanded ? 'Collapse cabana details' : 'Expand cabana details'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition border ${
                    isExpanded
                      ? 'bg-[#003528] text-white border-[#003528]'
                      : 'bg-white text-[#55635e] border-[#e2e8e5] hover:bg-[#f4f7f6]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl transition-transform duration-200">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>
            </div>

            {/* Accordion Expanded Details Body */}
            {isExpanded && (
              <div className="p-4 sm:p-6 bg-white animate-in fade-in duration-200">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Column 1: Photo Gallery Stage (lg: 4 cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-900 border border-[#e2e8e5] shadow-xs group">
                      <img
                        src={currentPhoto}
                        alt={`${cabana.name} view`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                        <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono">
                          Photo {currentPhotoIdx + 1} of {cabana.images.length}
                        </span>
                        <span className="bg-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                          {cabana.viewType}
                        </span>
                      </div>

                      <button
                        onClick={() => onOpenModal(cabana, 'photos')}
                        className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-[#003528] px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">photo_library</span>
                        <span>View All {cabana.images.length} Photos</span>
                      </button>
                    </div>

                    {/* Thumbnails Row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {cabana.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => setPhotoIndex(e, cabana.id, idx)}
                          className={`relative w-16 h-11 rounded-lg overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                            currentPhotoIdx === idx
                              ? 'border-[#003528] ring-2 ring-[#003528]/30 scale-102'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </button>
                      ))}
                    </div>

                    {/* Quick Badges */}
                    <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[#55635e]">Privacy Rating:</span>
                        <strong className="text-[#003528]">{cabana.privacyLevel}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#55635e]">Availability:</span>
                        <span className="text-emerald-700 font-bold">{cabana.slotsRemaining} Spots Remaining</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#55635e]">Schedule:</span>
                        <span className="font-mono text-[#003528]">{pkg.schedule}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Detailed Specifications (lg: 4 cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f2]">
                      <h4 className="font-headline text-sm font-bold text-[#003528] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-[#006a66]">architecture</span>
                        <span>Detailed Specifications</span>
                      </h4>
                      <button
                        onClick={() => onOpenModal(cabana, 'specs')}
                        className="text-xs text-[#006a66] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>Full Specs</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Spatial Dimensions */}
                      <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5]">
                        <span className="text-[10px] uppercase font-bold text-[#006a66] block mb-0.5">
                          Dimensions &amp; Living Space
                        </span>
                        <div className="font-semibold text-[#003528]">
                          {specs.floorAreaSqFt} sq.ft Total Living Area • {specs.deckAreaSqFt} sq.ft Deck
                        </div>
                        <div className="text-[11px] text-[#55635e] mt-0.5">
                          {cabana.capacity} • {cabana.maxAdults} Adults + {cabana.maxKids} Children
                        </div>
                      </div>

                      {/* Bedding Setup */}
                      <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5]">
                        <span className="text-[10px] uppercase font-bold text-[#006a66] block mb-0.5">
                          Bedding &amp; Loungers
                        </span>
                        <div className="font-semibold text-[#003528]">
                          {specs.bedLayout}
                        </div>
                        <div className="text-[11px] text-[#55635e] mt-0.5">
                          {specs.furniture}
                        </div>
                      </div>

                      {/* Climate & Shade */}
                      <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5]">
                        <span className="text-[10px] uppercase font-bold text-[#006a66] block mb-0.5">
                          Climate &amp; Shade
                        </span>
                        <div className="font-semibold text-[#003528]">
                          {specs.climateControl}
                        </div>
                        <div className="text-[11px] text-[#55635e] mt-0.5">
                          Shade: {specs.shadeRating}
                        </div>
                      </div>

                      {/* Bathroom & Hygiene */}
                      <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5]">
                        <span className="text-[10px] uppercase font-bold text-[#006a66] block mb-0.5">
                          Private En-suite &amp; Shower
                        </span>
                        <div className="font-semibold text-[#003528]">
                          {specs.bathroomChanging}
                        </div>
                        <div className="text-[11px] text-[#55635e] mt-0.5">
                          {pkg.towelPolicy}
                        </div>
                      </div>

                      {/* Distances & Orientation */}
                      <div className="p-2.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5]">
                        <span className="text-[10px] uppercase font-bold text-[#006a66] block mb-0.5">
                          Proximity &amp; Orientation
                        </span>
                        <div className="text-[11px] text-[#003528] font-semibold flex items-center gap-3 flex-wrap">
                          <span>🏊 Pool: {specs.distanceToPool}</span>
                          {specs.distanceToBeach && <span>🏖️ Beach: {specs.distanceToBeach}</span>}
                        </div>
                        <div className="text-[11px] text-[#55635e] mt-0.5">
                          {specs.orientation}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Individual Package Pricing & Tiers (lg: 4 cols) */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f2]">
                      <h4 className="font-headline text-sm font-bold text-[#003528] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-[#006a66]">payments</span>
                        <span>Package Options &amp; Menus</span>
                      </h4>
                      <button
                        onClick={() => onOpenModal(cabana, 'pricing')}
                        className="text-xs text-[#006a66] hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>All Menus</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </button>
                    </div>

                    {/* Surcharge summary pill */}
                    <div className="p-3 rounded-xl bg-[#f0faf7] border border-[#b2e4dc] flex items-center justify-between text-xs">
                      <span className="text-[#004d3b] font-bold">Cabana Location Rate:</span>
                      <strong className="font-mono text-[#003528]">
                        {cabana.priceDeltaLkr === 0 ? 'Included in Day Pass' : `+ ${formatPrice(cabana.priceDeltaLkr)}`}
                      </strong>
                    </div>

                    {/* Selectable Package Tiers List */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#55635e] block">
                        Select Package Tier for {cabana.code}:
                      </span>

                      {tiers.map((tier) => {
                        const isTierActive = isSelected && selectedTier?.id === tier.id;

                        return (
                          <div
                            key={tier.id}
                            onClick={() => onSelectCabana(cabana, tier)}
                            className={`p-3 rounded-xl border-2 transition cursor-pointer text-xs ${
                              isTierActive
                                ? 'border-[#003528] bg-emerald-50/40 ring-1 ring-[#003528]/20'
                                : 'border-[#e2e8e5] bg-white hover:border-[#ccd5d1]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#003528]">{tier.name}</span>
                                {tier.badge && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-bold text-[#003528]">
                                {tier.priceDeltaLkr === 0 ? 'Included' : `+ ${formatPrice(tier.priceDeltaLkr)} / guest`}
                              </span>
                            </div>

                            <div className="text-[11px] text-[#55635e] line-clamp-1 mb-1">
                              🍽️ {tier.diningPlan}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-[#55635e]">
                              <span>🕒 {tier.timing}</span>
                              <span className={`font-bold ${isTierActive ? 'text-[#006a66]' : 'text-[#889691]'}`}>
                                {isTierActive ? '● Active Tier' : '○ Click to Select'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inclusions summary */}
                    <div className="p-3 rounded-xl bg-[#f8faf9] border border-[#e2e8e5] text-[11px] space-y-1 text-[#404945]">
                      <p>• <strong>Dining:</strong> {pkg.diningPlan}</p>
                      <p>• <strong>Welcome:</strong> {pkg.welcomeRefreshment}</p>
                      <p>• <strong>Corkage:</strong> {pkg.corkagePolicy}</p>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onOpenModal(cabana, 'specs')}
                        className="flex-1 py-2.5 px-3 rounded-xl border border-[#ccd5d1] text-xs font-bold text-[#2d3834] hover:bg-[#f4f7f6] transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        <span>Inspect Modal</span>
                      </button>

                      <button
                        onClick={() => onSelectCabana(cabana, tiers[0])}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-[#003528] text-white hover:bg-[#004d3b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                        <span>{isSelected ? 'Cabana Selected' : 'Select This Cabana'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
