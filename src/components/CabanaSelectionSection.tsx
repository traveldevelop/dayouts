import React, { useState } from 'react';
import { CabanaUnit, Currency, SanctuaryProperty, CabanaPackageTier, CabanaSpecifications } from '../types';
import { USD_EXCHANGE_RATE, getPropertyCabanas } from '../data/mockData';
import { getCabanaSpecifications } from '../data/cabanasData';
import { SubCabanaSpecificationsAccordion } from './SubCabanaSpecificationsAccordion';
import { SubCabanaDetailModal } from './SubCabanaDetailModal';

interface CabanaSelectionSectionProps {
  property: SanctuaryProperty;
  currency: Currency;
  selectedCabana: CabanaUnit;
  selectedTier?: CabanaPackageTier;
  onSelectCabana: (cabana: CabanaUnit, tier?: CabanaPackageTier) => void;
}

export const CabanaSelectionSection: React.FC<CabanaSelectionSectionProps> = ({
  property,
  currency,
  selectedCabana,
  selectedTier,
  onSelectCabana
}) => {
  const cabanas = getPropertyCabanas(property);
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'accordion' | 'cards' | 'matrix'>('accordion');
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);

  // Per-card active photo preview index dictionary: { [cabanaId]: number }
  const [activePhotoByCabana, setActivePhotoByCabana] = useState<Record<string, number>>({});

  // Full Specifications & Photo Gallery Modal state
  const [specModalCabana, setSpecModalCabana] = useState<CabanaUnit | null>(null);
  const [specModalTab, setSpecModalTab] = useState<'photos' | 'specs' | 'pricing' | 'layout'>('specs');

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const filteredCabanas = cabanas.filter((cab) => {
    if (filterType === 'all') return true;
    if (filterType === 'oceanfront') return cab.type === 'oceanfront';
    if (filterType === 'poolside') return cab.type === 'poolside';
    if (filterType === 'vip') return cab.type === 'vip';
    if (filterType === 'family') return cab.type === 'family';
    return true;
  });

  const handleCardThumbnailClick = (e: React.MouseEvent, cabanaId: string, photoIdx: number) => {
    e.stopPropagation();
    setActivePhotoByCabana((prev) => ({
      ...prev,
      [cabanaId]: photoIdx
    }));
  };

  const togglePackageExpand = (e: React.MouseEvent, cabanaId: string) => {
    e.stopPropagation();
    setExpandedPackageId((prev) => (prev === cabanaId ? null : cabanaId));
  };

  const handleOpenModal = (cabana: CabanaUnit, tab: 'photos' | 'specs' | 'pricing' | 'layout' = 'specs') => {
    setSpecModalCabana(cabana);
    setSpecModalTab(tab);
  };

  return (
    <section id="private-cabanas-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e5] shadow-xs">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-[#f0f4f2]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#006a66] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-sm">deck</span>
            පෞද්ගලික Cabana පිරිවිතර &amp; පැකේජ • Sub-Cabanas Specifications &amp; Pricing
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-[#003528]">
            Explore Sub-Cabanas ({cabanas.length} Verified Units)
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#55635e] max-w-2xl leading-relaxed">
            Expand any sub-cabana below to inspect architectural floor dimensions, photo galleries, dining plans, swimming access, and individualized package pricing.
          </p>
        </div>

        {/* Selected Spot indicator */}
        <div className="bg-[#f4f7f6] border border-[#e2e8e5] rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-white shadow-xs">
            <img src={selectedCabana.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <span className="text-[10px] text-[#55635e] font-semibold uppercase block">Active Cabana Selection</span>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-[#003528] text-white text-[10px] font-mono font-bold">
                {selectedCabana.code}
              </span>
              <span className="text-xs font-bold text-[#003528] truncate max-w-[170px]">
                {selectedCabana.name}
              </span>
            </div>
            {selectedTier && (
              <span className="text-[10px] text-[#006a66] font-semibold block truncate">
                Tier: {selectedTier.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Control Bar: Category Filter + View Mode Switcher */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-[#003528] text-white shadow-xs'
                : 'bg-[#f4f7f6] text-[#404945] hover:bg-[#e2e8e5]'
            }`}
          >
            All Cabanas ({cabanas.length})
          </button>
          <button
            onClick={() => setFilterType('oceanfront')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              filterType === 'oceanfront'
                ? 'bg-[#003528] text-white shadow-xs'
                : 'bg-[#f4f7f6] text-[#404945] hover:bg-[#e2e8e5]'
            }`}
          >
            Oceanfront &amp; Beach
          </button>
          <button
            onClick={() => setFilterType('poolside')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              filterType === 'poolside'
                ? 'bg-[#003528] text-white shadow-xs'
                : 'bg-[#f4f7f6] text-[#404945] hover:bg-[#e2e8e5]'
            }`}
          >
            Infinity Poolside
          </button>
          <button
            onClick={() => setFilterType('vip')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              filterType === 'vip'
                ? 'bg-[#003528] text-white shadow-xs'
                : 'bg-[#f4f7f6] text-[#404945] hover:bg-[#e2e8e5]'
            }`}
          >
            VIP &amp; Jacuzzi
          </button>
          <button
            onClick={() => setFilterType('family')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              filterType === 'family'
                ? 'bg-[#003528] text-white shadow-xs'
                : 'bg-[#f4f7f6] text-[#404945] hover:bg-[#e2e8e5]'
            }`}
          >
            Family Pavilions
          </button>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center gap-1 bg-[#f4f7f6] p-1 rounded-xl border border-[#e2e8e5] shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('accordion')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'accordion'
                ? 'bg-white text-[#003528] shadow-xs'
                : 'text-[#55635e] hover:text-[#003528]'
            }`}
            title="Expandable Accordion Specifications View"
          >
            <span className="material-symbols-outlined text-sm">view_agenda</span>
            <span>Specifications Accordion</span>
          </button>

          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-[#003528] shadow-xs'
                : 'text-[#55635e] hover:text-[#003528]'
            }`}
            title="Grid Cards View"
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            <span>Cards</span>
          </button>

          <button
            onClick={() => setViewMode('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              viewMode === 'matrix'
                ? 'bg-white text-[#003528] shadow-xs'
                : 'text-[#55635e] hover:text-[#003528]'
            }`}
            title="Comparison Matrix Table View"
          >
            <span className="material-symbols-outlined text-sm">table_chart</span>
            <span>Compare Matrix</span>
          </button>
        </div>
      </div>

      {/* Main Display Body based on viewMode */}
      <div className="mt-6">
        {/* VIEW 1: ACCORDION SPECIFICATIONS VIEW (Requested Feature) */}
        {viewMode === 'accordion' && (
          <SubCabanaSpecificationsAccordion
            cabanas={filteredCabanas}
            currency={currency}
            selectedCabana={selectedCabana}
            selectedTier={selectedTier}
            onSelectCabana={onSelectCabana}
            onOpenModal={handleOpenModal}
          />
        )}

        {/* VIEW 2: VISUAL CARDS GRID */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCabanas.map((cabana) => {
              const isSelected = selectedCabana.id === cabana.id;
              const currentPhotoIdx = activePhotoByCabana[cabana.id] || 0;
              const displayImage = cabana.images[currentPhotoIdx] || cabana.coverImage;
              const isExpanded = expandedPackageId === cabana.id;
              const pkg = cabana.packageDetails;
              const tiers = pkg?.packageTiers || [];
              const specs: CabanaSpecifications = cabana.specifications || getCabanaSpecifications(cabana);

              return (
                <div
                  key={cabana.id}
                  onClick={() => onSelectCabana(cabana)}
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden bg-white flex flex-col justify-between cursor-pointer group shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-[#003528] ring-2 ring-[#003528]/20 bg-emerald-50/15'
                      : 'border-[#e2e8e5] hover:border-[#ccd5d1]'
                  }`}
                >
                  <div>
                    {/* Image Stage + Interactive Thumbnail Carousel */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={displayImage}
                        alt={cabana.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />

                      {/* Top Bar on Image */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-[#003528] text-white text-xs font-mono font-bold shadow-xs">
                            {cabana.code}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-emerald-300 text-[11px] font-bold">
                            {cabana.typeLabel}
                          </span>
                        </div>

                        {isSelected ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-md">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            SELECTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-[#003528] text-[10px] font-bold">
                            {cabana.slotsRemaining} Available
                          </span>
                        )}
                      </div>

                      {/* View Type & HD Photos Button */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="flex items-center gap-1 font-medium bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px]">
                          <span className="material-symbols-outlined text-sm text-amber-300">visibility</span>
                          {cabana.viewType}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenModal(cabana, 'photos');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-[#003528] font-bold text-[11px] flex items-center gap-1 shadow-sm transition cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">photo_library</span>
                          View {cabana.images.length} Photos
                        </button>
                      </div>
                    </div>

                    {/* Mini Clickable Photo Thumbnails Bar */}
                    <div className="px-4 py-2 bg-[#f4f7f6] border-b border-[#e2e8e5] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                        {cabana.images.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => handleCardThumbnailClick(e, cabana.id, idx)}
                            className={`relative w-11 h-8 rounded-md overflow-hidden shrink-0 border transition cursor-pointer ${
                              currentPhotoIdx === idx
                                ? 'border-[#003528] ring-2 ring-[#003528]/40 scale-105'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                            title={`Click to preview photo ${idx + 1}`}
                          >
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>

                      <span className="text-[10px] text-[#55635e] font-mono shrink-0">
                        Photo {currentPhotoIdx + 1}/{cabana.images.length}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-headline text-base sm:text-lg font-bold text-[#003528] group-hover:text-[#006a66] transition">
                          {cabana.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#55635e] line-clamp-2 leading-relaxed">
                        {cabana.description}
                      </p>

                      {/* Capacity & Key Specs */}
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-[#eefaf8] text-[#006a66] text-xs font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">group</span>
                          {cabana.capacity}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-[#f4f7f6] text-[#404945] text-xs font-medium">
                          Area: <strong>{specs.floorAreaSqFt} sq.ft</strong>
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-[#f4f7f6] text-[#404945] text-xs font-medium">
                          Privacy: <strong>{cabana.privacyLevel}</strong>
                        </span>
                      </div>

                      {/* Tailored Cabana Package Highlight Box */}
                      <div className="mt-3.5 p-3.5 rounded-xl bg-[#f8faf9] border border-[#e2e8e5] space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-[#003528] pb-1.5 border-b border-[#e8eeea]">
                          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#006a66]">
                            <span className="material-symbols-outlined text-sm">lunch_dining</span>
                            Package Details
                          </span>
                          <button
                            onClick={(e) => togglePackageExpand(e, cabana.id)}
                            className="text-[11px] text-[#006a66] hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
                          >
                            <span>{isExpanded ? 'Less' : 'View Full Details'}</span>
                            <span className="material-symbols-outlined text-sm">
                              {isExpanded ? 'expand_less' : 'expand_more'}
                            </span>
                          </button>
                        </div>

                        <div className="text-xs space-y-1.5 text-[#404945]">
                          <div className="flex items-start gap-1.5">
                            <span className="font-semibold text-[#003528] shrink-0">🍽️ Dining:</span>
                            <span className="truncate">{pkg.diningPlan}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="font-semibold text-[#003528] shrink-0">🥥 Refreshment:</span>
                            <span className="truncate">{pkg.welcomeRefreshment}</span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="font-semibold text-[#003528] shrink-0">🍾 BYOB / Corkage:</span>
                            <span className="truncate">{pkg.corkagePolicy}</span>
                          </div>
                        </div>

                        {/* Expandable Package Details Drawer */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-[#e2e8e5] space-y-2.5 text-xs text-[#404945] animate-in fade-in duration-150">
                            <div>
                              <span className="font-semibold text-[#003528] block">🏊 Swimming &amp; Water:</span>
                              <span className="text-[11px] text-[#55635e]">{pkg.swimmingAccess}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-[#003528] block">🚿 Changing Suite &amp; Towels:</span>
                              <span className="text-[11px] text-[#55635e]">{pkg.changingRoom}. {pkg.towelPolicy}.</span>
                            </div>

                            <div>
                              <span className="font-semibold text-[#003528] block mb-1">Exclusive Cabana Perks:</span>
                              <div className="space-y-1">
                                {pkg.exclusivePerks.map((perk, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                                    <span className="material-symbols-outlined text-emerald-600 text-xs shrink-0">check_circle</span>
                                    <span>{perk}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Package Tiers Options if available */}
                            {tiers.length > 0 && (
                              <div className="pt-2 border-t border-[#e2e8e5]">
                                <span className="font-bold text-[#003528] block mb-1.5 text-[11px] uppercase tracking-wider">
                                  Package Tier Options for this Cabana:
                                </span>
                                <div className="space-y-1.5">
                                  {tiers.map((t) => (
                                    <div
                                      key={t.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectCabana(cabana, t);
                                      }}
                                      className={`p-2 rounded-lg border text-[11px] flex items-center justify-between cursor-pointer transition ${
                                        isSelected && selectedTier?.id === t.id
                                          ? 'bg-emerald-100/60 border-emerald-600 font-bold text-[#003528]'
                                          : 'bg-white border-[#e2e8e5] hover:bg-[#f4f7f6]'
                                      }`}
                                    >
                                      <div>
                                        <span className="font-semibold">{t.name}</span>
                                        {t.badge && (
                                          <span className="ml-1.5 px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                            {t.badge}
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-mono text-[#003528]">
                                        {t.priceDeltaLkr === 0 ? 'Included' : `+ ${formatPrice(t.priceDeltaLkr)}`}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 sm:px-5 sm:pb-5 pt-3 border-t border-[#e2e8e5] flex items-center justify-between gap-3 bg-white">
                    <div>
                      <span className="text-[10px] text-[#55635e] font-semibold uppercase block">Package &amp; Cabana Rate</span>
                      <span className="text-xs font-bold font-mono text-[#003528]">
                        {cabana.priceDeltaLkr === 0 ? (
                          <span className="text-emerald-700 font-extrabold">Included in Day Pass</span>
                        ) : (
                          <span>+ {formatPrice(cabana.priceDeltaLkr)} Upgrade</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(cabana, 'specs');
                        }}
                        className="px-3 py-2 rounded-xl border border-[#ccd5d1] text-xs font-bold text-[#2d3834] hover:bg-[#f4f7f6] transition cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">architecture</span>
                        <span>Specs &amp; Photos</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCabana(cabana);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white shadow-sm'
                            : 'bg-[#003528] text-white hover:bg-[#004d3b]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isSelected ? 'check' : 'radio_button_unchecked'}
                        </span>
                        <span>{isSelected ? 'Cabana Selected' : 'Select Cabana'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: SIDE-BY-SIDE SPECIFICATIONS COMPARISON MATRIX */}
        {viewMode === 'matrix' && (
          <div className="overflow-x-auto rounded-2xl border border-[#e2e8e5] bg-white shadow-xs">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#f0faf7] border-b border-[#b2e4dc] text-[#003528]">
                  <th className="p-3.5 font-bold uppercase text-[11px]">Cabana Unit</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Floor Area</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Capacity</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Bedding Setup</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Climate &amp; En-suite</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Proximity</th>
                  <th className="p-3.5 font-bold uppercase text-[11px]">Pricing Rate</th>
                  <th className="p-3.5 font-bold uppercase text-[11px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f4f2]">
                {filteredCabanas.map((c) => {
                  const isSelected = selectedCabana.id === c.id;
                  const specs: CabanaSpecifications = c.specifications || getCabanaSpecifications(c);

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-[#f8faf9] transition ${
                        isSelected ? 'bg-emerald-50/40 font-semibold' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#e2e8e5]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-[#003528] text-white text-[10px] font-mono font-bold block w-fit mb-0.5">
                              {c.code}
                            </span>
                            <span className="font-bold text-[#003528] block truncate max-w-[140px]">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-[#55635e]">{c.typeLabel}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <strong className="text-[#003528]">{specs.floorAreaSqFt} sq.ft</strong>
                        <span className="text-[11px] text-[#55635e] block">Deck: {specs.deckAreaSqFt} sq.ft</span>
                      </td>

                      <td className="p-3.5">
                        <span className="text-[#003528] font-medium">{c.capacity}</span>
                        <span className="text-[10px] text-[#55635e] block">Privacy: {c.privacyLevel}</span>
                      </td>

                      <td className="p-3.5 max-w-[180px]">
                        <span className="text-[#404945] text-[11px] line-clamp-2">{specs.bedLayout}</span>
                      </td>

                      <td className="p-3.5 max-w-[180px]">
                        <span className="text-[#003528] text-[11px] block">{specs.climateControl}</span>
                        <span className="text-[#55635e] text-[10px] block truncate">{specs.bathroomChanging}</span>
                      </td>

                      <td className="p-3.5 text-[11px] text-[#55635e]">
                        <div>Pool: <strong className="text-[#003528]">{specs.distanceToPool}</strong></div>
                        {specs.distanceToBeach && <div>Beach: <strong className="text-[#003528]">{specs.distanceToBeach}</strong></div>}
                      </td>

                      <td className="p-3.5 font-mono">
                        {c.priceDeltaLkr === 0 ? (
                          <span className="text-emerald-700 font-bold">Included</span>
                        ) : (
                          <span className="text-[#003528] font-bold">+ {formatPrice(c.priceDeltaLkr)}</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenModal(c, 'specs')}
                            className="p-1.5 rounded-lg border border-[#ccd5d1] text-[#2d3834] hover:bg-[#f4f7f6] transition cursor-pointer"
                            title="Inspect Specs & Photos"
                          >
                            <span className="material-symbols-outlined text-base">architecture</span>
                          </button>

                          <button
                            onClick={() => onSelectCabana(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-[#003528] text-white hover:bg-[#004d3b]'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Specifications & Photo Gallery Modal */}
      {specModalCabana && (
        <SubCabanaDetailModal
          cabana={specModalCabana}
          currency={currency}
          isSelected={selectedCabana.id === specModalCabana.id}
          selectedTierId={selectedTier?.id}
          onSelectCabana={onSelectCabana}
          onClose={() => setSpecModalCabana(null)}
          initialTab={specModalTab}
        />
      )}
    </section>
  );
};
