import React, { useState } from 'react';
import { CabanaUnit, Currency, CabanaPackageTier, CabanaSpecifications } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';
import { getCabanaSpecifications } from '../data/cabanasData';

interface SubCabanaDetailModalProps {
  cabana: CabanaUnit;
  currency: Currency;
  isSelected: boolean;
  selectedTierId?: string;
  onSelectCabana: (cabana: CabanaUnit, tier?: CabanaPackageTier) => void;
  onClose: () => void;
  initialTab?: 'photos' | 'specs' | 'pricing' | 'layout';
}

export const SubCabanaDetailModal: React.FC<SubCabanaDetailModalProps> = ({
  cabana,
  currency,
  isSelected,
  selectedTierId,
  onSelectCabana,
  onClose,
  initialTab = 'specs'
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'specs' | 'pricing' | 'layout'>(initialTab);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const pkg = cabana.packageDetails;
  const tiers = pkg?.packageTiers || [];
  const specs: CabanaSpecifications = cabana.specifications || getCabanaSpecifications(cabana);

  // Selected tier local state initialized to parent selection or first tier
  const [currentTier, setCurrentTier] = useState<CabanaPackageTier | undefined>(
    tiers.find((t) => t.id === selectedTierId) || tiers[0]
  );

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const handleApplySelection = () => {
    onSelectCabana(cabana, currentTier);
    onClose();
  };

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % cabana.images.length);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + cabana.images.length) % cabana.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#e2e8e5]">
        {/* Modal Top Header */}
        <div className="bg-[#003528] text-white p-5 sm:p-6 shrink-0 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 pr-8">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-400 text-[#002118] text-xs font-mono font-bold">
                {cabana.code}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/15 text-emerald-200">
                {cabana.typeLabel}
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1 font-mono">
                <span className="material-symbols-outlined text-sm text-teal-300">group</span>
                {cabana.capacity}
              </span>
              {isSelected && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">check</span>
                  Currently Selected
                </span>
              )}
            </div>

            <h3 className="font-headline text-xl sm:text-2xl font-bold truncate">
              {cabana.name}
            </h3>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {cabana.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              title="Close Modal"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 border-b border-[#e2e8e5] bg-[#f8faf9] px-4 sm:px-6 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#003528] text-[#003528] bg-white'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#006a66]">architecture</span>
            <span>Detailed Specifications</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'photos'
                ? 'border-[#003528] text-[#003528] bg-white'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#006a66]">photo_library</span>
            <span>Photo Gallery ({cabana.images.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'border-[#003528] text-[#003528] bg-white'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#006a66]">payments</span>
            <span>Package Pricing &amp; Menus ({tiers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'layout'
                ? 'border-[#003528] text-[#003528] bg-white'
                : 'border-transparent text-[#55635e] hover:text-[#003528]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#006a66]">map</span>
            <span>Floor Plan &amp; Orientation</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: DETAILED SPECIFICATIONS */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              {/* Top Overview Banner */}
              <div className="bg-[#f0faf7] p-4 rounded-2xl border border-[#b2e4dc] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006a66] block">
                    Architectural &amp; Comfort Profile
                  </span>
                  <h4 className="font-headline text-lg font-bold text-[#003528] mt-0.5">
                    {cabana.name}
                  </h4>
                  <p className="text-xs text-[#55635e] mt-1 max-w-xl">
                    {cabana.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-white p-3 rounded-xl border border-[#b2e4dc] text-center min-w-[90px]">
                    <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Total Area</span>
                    <strong className="font-headline text-base text-[#003528]">
                      {specs.floorAreaSqFt} sq.ft
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#b2e4dc] text-center min-w-[90px]">
                    <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Sun Deck</span>
                    <strong className="font-headline text-base text-[#003528]">
                      {specs.deckAreaSqFt} sq.ft
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#b2e4dc] text-center min-w-[90px]">
                    <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Privacy</span>
                    <strong className="font-headline text-base text-emerald-800">
                      {cabana.privacyLevel}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 6-Card Detailed Technical Specification Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Bedding & Lounge Layout */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">king_bed</span>
                    <span className="text-xs uppercase tracking-wider">Bedding &amp; Daybed Setup</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.bedLayout}
                  </p>
                  <p className="text-[#55635e] text-[11px] leading-relaxed">
                    Fitted with high-density foam, waterproof teak fabric, and soft Bohemian throw pillows.
                  </p>
                </div>

                {/* 2. Furniture & Dining Suite */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">table_restaurant</span>
                    <span className="text-xs uppercase tracking-wider">Dining &amp; Lounge Furniture</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.furniture}
                  </p>
                  <p className="text-[#55635e] text-[11px] leading-relaxed">
                    Designed for family feasts and lazy afternoon cocktails directly inside your private pavilion.
                  </p>
                </div>

                {/* 3. Climate & Natural Ventilation */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">mode_fan</span>
                    <span className="text-xs uppercase tracking-wider">Climate Control &amp; Shade</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.climateControl}
                  </p>
                  <p className="text-[#55635e] text-[11px]">
                    Shade Rating: <strong className="text-[#004d3b]">{specs.shadeRating}</strong>
                  </p>
                </div>

                {/* 4. En-suite Changing Suite & Hygiene */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">shower</span>
                    <span className="text-xs uppercase tracking-wider">Private Bathroom &amp; Changing</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.bathroomChanging}
                  </p>
                  <p className="text-[#55635e] text-[11px]">
                    Towel Policy: {pkg.towelPolicy}
                  </p>
                </div>

                {/* 5. Power, Audio & High-Speed Connectivity */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">power</span>
                    <span className="text-xs uppercase tracking-wider">Power, Audio &amp; Devices</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.powerAudio}
                  </p>
                  <p className="text-[#55635e] text-[11px]">
                    High-Speed Starlink WiFi mesh coverage throughout the cabana deck.
                  </p>
                </div>

                {/* 6. Proximity, Orientation & Accessibility */}
                <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#006a66] font-bold">
                    <span className="material-symbols-outlined text-lg">explore</span>
                    <span className="text-xs uppercase tracking-wider">Orientation &amp; Distances</span>
                  </div>
                  <p className="font-semibold text-[#003528] text-xs">
                    {specs.orientation}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#55635e] flex-wrap">
                    <span>🏊 To Pool: <strong className="text-[#003528]">{specs.distanceToPool}</strong></span>
                    {specs.distanceToBeach && (
                      <span>🏖️ To Beach: <strong className="text-[#003528]">{specs.distanceToBeach}</strong></span>
                    )}
                  </div>
                  <p className="text-[#55635e] text-[11px]">
                    Accessibility: {specs.accessibility}
                  </p>
                </div>
              </div>

              {/* Exclusive Perks Bar */}
              <div className="p-4 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5]">
                <span className="text-[11px] font-bold text-[#003528] uppercase tracking-wider block mb-2">
                  Special Inclusions &amp; Amenities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {pkg.exclusivePerks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#404945]">
                      <span className="material-symbols-outlined text-emerald-600 text-sm">check_circle</span>
                      <span>{perk}</span>
                    </div>
                  ))}
                  {cabana.features.map((feat, i) => (
                    <div key={`feat-${i}`} className="flex items-center gap-2 text-[#404945]">
                      <span className="material-symbols-outlined text-[#006a66] text-sm">verified</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO GALLERY */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Main Photo Viewport */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-[#e2e8e5]">
                <img
                  src={cabana.images[activePhotoIdx] || cabana.coverImage}
                  alt={`${cabana.name} view ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover transition duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Photo Perspective Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-black/60 backdrop-blur-sm px-4 py-2.5 rounded-xl">
                  <div>
                    <span className="font-bold block">
                      {cabana.name} · View Angle {activePhotoIdx + 1}
                    </span>
                    <span className="text-[11px] text-emerald-300 font-mono">
                      {activePhotoIdx === 0
                        ? 'Master Exterior Deck & Water Panorama'
                        : activePhotoIdx === 1
                        ? 'Interior Daybed & Dining Suite Lounge'
                        : activePhotoIdx === 2
                        ? 'Sunset / Landscape View from Sunbeds'
                        : 'Private Rain Shower & En-suite Amenities'}
                    </span>
                  </div>

                  <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded">
                    {activePhotoIdx + 1} / {cabana.images.length}
                  </span>
                </div>

                {/* Left/Right Arrows */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition cursor-pointer"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>

              {/* Clickable Thumbnails Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {cabana.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activePhotoIdx === idx
                        ? 'border-[#003528] ring-2 ring-[#003528]/30 scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGE PRICING & MENU TIERS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#b2e4dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66]">
                    Tailored Dining &amp; Pass Options
                  </span>
                  <h4 className="font-headline text-base font-bold text-[#003528]">
                    Package Options for {cabana.code} · {cabana.name}
                  </h4>
                  <p className="text-xs text-[#55635e] mt-0.5">
                    Select a package tier to include with this cabana. Prices adjust per guest.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Cabana Surcharge</span>
                  <strong className="font-mono text-base font-bold text-[#003528]">
                    {cabana.priceDeltaLkr === 0 ? 'Included (LKR 0)' : `+ ${formatPrice(cabana.priceDeltaLkr)}`}
                  </strong>
                </div>
              </div>

              {/* Package Tiers Cards */}
              <div className="space-y-3">
                {tiers.map((t) => {
                  const isCurrent = currentTier?.id === t.id;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setCurrentTier(t)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCurrent
                          ? 'border-[#003528] bg-emerald-50/30 ring-2 ring-[#003528]/15'
                          : 'border-[#e2e8e5] bg-white hover:border-[#ccd5d1]'
                      }`}
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-headline text-sm font-bold text-[#003528]">
                            {t.name}
                          </span>
                          {t.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                              {t.badge}
                            </span>
                          )}
                          <span className="text-xs text-[#55635e] font-mono flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {t.timing}
                          </span>
                        </div>

                        <div className="text-xs text-[#404945] flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-sm text-[#006a66] shrink-0 mt-0.5">restaurant</span>
                          <span><strong>Menu:</strong> {t.diningPlan}</span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-[#55635e] flex-wrap">
                          {t.highlights.map((h, i) => (
                            <span key={i} className="flex items-center gap-1 bg-[#f4f7f6] px-2 py-0.5 rounded">
                              <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center md:flex-col items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-[#e2e8e5] pt-3 md:pt-0 md:pl-5 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-[#55635e] uppercase block">Tier Price</span>
                          <span className="font-mono text-sm font-extrabold text-[#003528]">
                            {t.priceDeltaLkr === 0 ? 'Standard Included' : `+ ${formatPrice(t.priceDeltaLkr)} / guest`}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            isCurrent
                              ? 'bg-[#003528] text-white'
                              : 'border border-[#e2e8e5] text-[#55635e] hover:bg-[#f4f7f6]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isCurrent ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <span>{isCurrent ? 'Selected Tier' : 'Select Tier'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Standard Included Inclusions Box */}
              <div className="p-4 rounded-xl bg-[#f8faf9] border border-[#e2e8e5] text-xs space-y-1 text-[#404945]">
                <strong className="text-[#003528] block mb-1">Universal Privileges with this Cabana:</strong>
                <p>• <strong>Welcome Drinks:</strong> {pkg.welcomeRefreshment}</p>
                <p>• <strong>Corkage Terms:</strong> {pkg.corkagePolicy}</p>
                <p>• <strong>Pool &amp; Water Access:</strong> {pkg.swimmingAccess}</p>
                <p>• <strong>Changing Room:</strong> {pkg.changingRoom}</p>
              </div>
            </div>
          )}

          {/* TAB 4: FLOOR PLAN & LAYOUT SCHEMATIC */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#f0faf7] border border-[#b2e4dc] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66]">
                    Architectural Layout
                  </span>
                  <h4 className="font-headline text-base font-bold text-[#003528]">
                    {cabana.code} Floor Plan Schematic ({specs.floorAreaSqFt} sq.ft)
                  </h4>
                </div>
                <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-md border border-[#b2e4dc] text-[#006a66]">
                  Scale: 1:50
                </span>
              </div>

              {/* Stylized Architectural Blueprint Diagram */}
              <div className="p-6 rounded-2xl bg-[#0d2822] text-white border border-[#1b4b40] font-mono text-xs relative overflow-hidden shadow-inner">
                {/* Compass & North Arrow */}
                <div className="absolute top-4 right-4 flex flex-col items-center text-emerald-300">
                  <span className="material-symbols-outlined text-2xl">explore</span>
                  <span className="text-[10px] font-bold">N</span>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="border border-emerald-500/40 rounded-xl p-4 bg-emerald-950/40 space-y-3">
                    <div className="flex items-center justify-between text-emerald-300 pb-2 border-b border-emerald-800">
                      <span>[ WATER / HORIZON VIEW FRONT ]</span>
                      <span className="text-[11px] text-amber-300">{specs.orientation}</span>
                    </div>

                    {/* Zone 1: Sun Deck & Loungers */}
                    <div className="p-3 rounded-lg border border-dashed border-emerald-400/50 bg-emerald-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-emerald-400">wb_sunny</span>
                        <span>Outdoor Teak Sun Deck ({specs.deckAreaSqFt} sq.ft)</span>
                      </div>
                      <span className="text-[10px] text-emerald-300">2x Sun Loungers + Umbrella</span>
                    </div>

                    {/* Zone 2: Shaded Main Living & King Daybed */}
                    <div className="p-4 rounded-xl border border-emerald-400 bg-emerald-900/50 space-y-2">
                      <div className="flex items-center justify-between font-bold text-emerald-200">
                        <span className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-emerald-300">deck</span>
                          Covered Shaded Pavilion
                        </span>
                        <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded">
                          Whisper Fan + Linen Drapes
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-emerald-950/70 border border-emerald-700/50">
                          <strong className="text-white block">Daybed Area:</strong>
                          <span className="text-emerald-300">{specs.bedLayout}</span>
                        </div>
                        <div className="p-2 rounded bg-emerald-950/70 border border-emerald-700/50">
                          <strong className="text-white block">Dining Table:</strong>
                          <span className="text-emerald-300">{specs.furniture}</span>
                        </div>
                      </div>
                    </div>

                    {/* Zone 3: En-suite Changing Suite & Shower */}
                    <div className="p-3 rounded-lg border border-dashed border-teal-400/50 bg-teal-950/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-teal-300">shower</span>
                        <span>En-suite Changing Room &amp; Rain Shower</span>
                      </div>
                      <span className="text-[10px] text-teal-300">Private AC Suite &amp; Locker</span>
                    </div>

                    <div className="text-center text-[10px] text-emerald-400 pt-1">
                      [ ACCESS CORRIDOR / FRANGIPANI WALKWAY ]
                    </div>
                  </div>
                </div>
              </div>

              {/* Spatial Distances Bar */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Distance to Pool</span>
                  <strong className="text-[#003528] font-headline">{specs.distanceToPool}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Distance to Beach</span>
                  <strong className="text-[#003528] font-headline">{specs.distanceToBeach || 'Direct Shoreline'}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <span className="text-[10px] text-[#55635e] uppercase block font-semibold">Accessibility</span>
                  <strong className="text-[#003528] font-headline text-[11px] truncate block">{specs.accessibility}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-[#f8faf9] border-t border-[#e2e8e5] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-[#55635e] uppercase font-semibold block">Active Selection</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#003528] text-sm">
                {cabana.code} · {cabana.name}
              </span>
              {currentTier && (
                <span className="text-xs text-[#006a66] font-semibold">
                  ({currentTier.name})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#55635e] hover:bg-white transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleApplySelection}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>Confirm &amp; Select This Cabana</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
