import React, { useState, useEffect } from 'react';
import { CabanaUnit, Currency, CabanaPackageTier } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';

interface CabanaGalleryModalProps {
  cabana: CabanaUnit;
  currency: Currency;
  isSelected: boolean;
  selectedTierId?: string;
  onSelectCabana: (cabana: CabanaUnit, tier?: CabanaPackageTier) => void;
  onClose: () => void;
}

export const CabanaGalleryModal: React.FC<CabanaGalleryModalProps> = ({
  cabana,
  currency,
  isSelected,
  selectedTierId,
  onSelectCabana,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'package' | 'tiers'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);
  const [chosenTier, setChosenTier] = useState<CabanaPackageTier | undefined>(
    cabana.packageDetails?.packageTiers?.find((t) => t.id === selectedTierId) ||
    cabana.packageDetails?.packageTiers?.[0]
  );

  // Close on Escape key press, handle left/right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && activeTab === 'photos') {
        setActivePhotoIndex((prev) => (prev + 1) % cabana.images.length);
      } else if (e.key === 'ArrowLeft' && activeTab === 'photos') {
        setActivePhotoIndex((prev) => (prev - 1 + cabana.images.length) % cabana.images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cabana.images.length, activeTab, onClose]);

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const currentImage = cabana.images[activePhotoIndex] || cabana.coverImage;
  const pkg = cabana.packageDetails;
  const tiers = pkg?.packageTiers || [];

  const tierUpgrade = chosenTier ? chosenTier.priceDeltaLkr : 0;
  const totalCabanaDelta = (cabana.priceDeltaLkr || 0) + tierUpgrade;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 border-b border-[#e2e8e5] flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-[#003528] text-white font-mono font-bold text-xs">
              {cabana.code}
            </span>
            <div>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-[#003528] leading-tight">
                {cabana.name}
              </h3>
              <p className="text-xs text-[#55635e] hidden sm:block">{cabana.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switchers */}
            <div className="hidden sm:flex items-center bg-[#f4f7f6] p-1 rounded-xl border border-[#e2e8e5]">
              <button
                onClick={() => setActiveTab('photos')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'photos'
                    ? 'bg-white text-[#003528] shadow-xs'
                    : 'text-[#55635e] hover:text-[#003528]'
                }`}
              >
                Photos ({cabana.images.length})
              </button>
              <button
                onClick={() => setActiveTab('package')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                  activeTab === 'package'
                    ? 'bg-white text-[#003528] shadow-xs'
                    : 'text-[#55635e] hover:text-[#003528]'
                }`}
              >
                <span>Package Details</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </button>
              {tiers.length > 0 && (
                <button
                  onClick={() => setActiveTab('tiers')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === 'tiers'
                      ? 'bg-white text-[#003528] shadow-xs'
                      : 'text-[#55635e] hover:text-[#003528]'
                  }`}
                >
                  Package Options ({tiers.length})
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#f4f7f6] hover:bg-[#e2e8e5] text-[#2d3834] flex items-center justify-center transition cursor-pointer ml-1"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="sm:hidden flex items-center bg-[#f4f7f6] px-3 py-2 border-b border-[#e2e8e5] text-xs font-bold overflow-x-auto scrollbar-none gap-2">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'photos' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
          >
            Photos ({cabana.images.length})
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'package' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
          >
            Package Details &amp; Menu
          </button>
          {tiers.length > 0 && (
            <button
              onClick={() => setActiveTab('tiers')}
              className={`px-3 py-1 rounded-lg shrink-0 ${activeTab === 'tiers' ? 'bg-[#003528] text-white' : 'text-[#55635e]'}`}
            >
              Package Tiers ({tiers.length})
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          {/* Left Column (8 cols): Changes based on activeTab */}
          <div className="lg:col-span-8 bg-zinc-950 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
            {activeTab === 'photos' && (
              <div className="flex flex-col justify-between h-full space-y-4">
                {/* Main Photo Display */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 flex items-center justify-center select-none shadow-inner">
                  <img
                    src={currentImage}
                    alt={`${cabana.name} - View ${activePhotoIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />

                  {cabana.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActivePhotoIndex((prev) => (prev - 1 + cabana.images.length) % cabana.images.length)
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <button
                        onClick={() =>
                          setActivePhotoIndex((prev) => (prev + 1) % cabana.images.length)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-mono font-semibold">
                    Photo {activePhotoIndex + 1} of {cabana.images.length}
                  </div>

                  <div className="absolute top-3 left-3 bg-[#003528]/85 backdrop-blur-sm text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/30">
                    {cabana.viewType}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none pt-1">
                  {cabana.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                        activePhotoIndex === idx
                          ? 'border-emerald-400 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'package' && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-[#2d3834] space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8e5]">
                  <div>
                    <span className="text-[10px] text-[#006a66] font-bold uppercase tracking-wider block">
                      Dedicated Package Overview
                    </span>
                    <h4 className="font-headline text-lg sm:text-xl font-bold text-[#003528]">
                      {pkg.tierName}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006a66] font-mono text-xs font-bold border border-emerald-200 shrink-0">
                    {pkg.schedule}
                  </span>
                </div>

                {/* Detailed Inclusions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">restaurant</span>
                      Dining &amp; Meal Plan
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">{pkg.diningPlan}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">local_bar</span>
                      Welcome Drink &amp; Refreshments
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">{pkg.welcomeRefreshment}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">pool</span>
                      Pool &amp; Water Access
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">{pkg.swimmingAccess}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">liquor</span>
                      BYOB &amp; Corkage Policy
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">{pkg.corkagePolicy}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">shower</span>
                      Changing Suite &amp; Towels
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">
                      {pkg.changingRoom}. {pkg.towelPolicy}.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <div className="flex items-center gap-2 mb-1 text-[#003528] font-bold text-xs uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base text-[#006a66]">verified</span>
                      SLTDA Guarantee
                    </div>
                    <p className="text-xs text-[#404945] leading-relaxed">
                      All food and service verified under official tourism standards. Dedicated host reception.
                    </p>
                  </div>
                </div>

                {/* Exclusive Perks List */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#003528] mb-2.5">
                    Exclusive Perks Included in this Cabana:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pkg.exclusivePerks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#404945]">
                        <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">
                          check_circle
                        </span>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tiers' && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 text-[#2d3834] space-y-4">
                <div>
                  <span className="text-[10px] text-[#006a66] font-bold uppercase tracking-wider block">
                    Choose Your Package Tier
                  </span>
                  <h4 className="font-headline text-lg sm:text-xl font-bold text-[#003528]">
                    Available Package Options for {cabana.code}
                  </h4>
                  <p className="text-xs text-[#55635e] mt-1">
                    Select a tailored package option to customize your day-out dining and hospitality experience.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {tiers.map((tier) => {
                    const isTierSelected = chosenTier?.id === tier.id;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setChosenTier(tier)}
                        className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isTierSelected
                            ? 'border-[#003528] bg-emerald-50/40 shadow-sm'
                            : 'border-[#e2e8e5] hover:border-[#ccd5d1] bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isTierSelected ? 'border-[#003528] bg-[#003528]' : 'border-slate-400'
                            }`}>
                              {isTierSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                            <h5 className="font-bold text-sm text-[#003528]">{tier.name}</h5>
                            {tier.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                {tier.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#55635e] mt-1 pl-6">
                            🍽️ {tier.diningPlan}
                          </p>
                          <div className="mt-2 pl-6 flex flex-wrap gap-1.5 text-[11px] text-[#404945]">
                            {tier.highlights.map((h, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-[#f4f7f6] border border-[#e2e8e5]">
                                {h}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0 pl-6 sm:pl-0">
                          <span className="font-mono text-xs sm:text-sm font-bold text-[#003528] block">
                            {tier.priceDeltaLkr === 0 ? 'Included' : `+ ${formatPrice(tier.priceDeltaLkr)} / guest`}
                          </span>
                          <span className="text-[10px] text-[#55635e]">{tier.timing}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Summary & Select Action */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-white flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#e2e8e5]">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[#006a66] text-xs font-bold border border-emerald-200">
                    {cabana.typeLabel}
                  </span>
                  <span className="text-xs text-[#55635e] font-medium">
                    Privacy: <strong className="text-[#003528]">{cabana.privacyLevel}</strong>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#404945] leading-relaxed">
                  {cabana.description}
                </p>
              </div>

              {/* Key Specs Pill Matrix */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#f0f4f2]">
                <div className="p-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <span className="text-[10px] text-[#55635e] font-semibold block uppercase">Guest Capacity</span>
                  <span className="text-xs font-bold text-[#003528] flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-sm text-[#006a66]">group</span>
                    {cabana.capacity}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <span className="text-[10px] text-[#55635e] font-semibold block uppercase">View Perspective</span>
                  <span className="text-xs font-bold text-[#003528] flex items-center gap-1 mt-0.5 truncate">
                    <span className="material-symbols-outlined text-sm text-[#006a66]">visibility</span>
                    {cabana.viewType}
                  </span>
                </div>
              </div>

              {/* Chosen Tier snapshot if selected */}
              {chosenTier && (
                <div className="p-3 rounded-xl bg-[#eefaf8] border border-[#b2e4dc]">
                  <span className="text-[10px] text-[#006a66] font-bold uppercase tracking-wider block">
                    Selected Package Tier
                  </span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs font-bold text-[#003528]">{chosenTier.name}</span>
                    <span className="text-[11px] font-mono font-bold text-[#003528]">
                      {chosenTier.priceDeltaLkr === 0 ? 'Included' : `+ ${formatPrice(chosenTier.priceDeltaLkr)}`}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#55635e] mt-1 truncate">🍽️ {chosenTier.diningPlan}</p>
                </div>
              )}

              {/* Package Snapshot Pills */}
              <div className="space-y-2 pt-2 border-t border-[#f0f4f2] text-xs">
                <div className="flex items-start gap-2 text-[#404945]">
                  <span className="material-symbols-outlined text-[#006a66] text-sm shrink-0 mt-0.5">restaurant</span>
                  <span className="text-[11px] line-clamp-2"><strong>Meal Plan:</strong> {pkg.diningPlan}</span>
                </div>
                <div className="flex items-start gap-2 text-[#404945]">
                  <span className="material-symbols-outlined text-[#006a66] text-sm shrink-0 mt-0.5">local_bar</span>
                  <span className="text-[11px] line-clamp-1"><strong>Drink:</strong> {pkg.welcomeRefreshment}</span>
                </div>
                <div className="flex items-start gap-2 text-[#404945]">
                  <span className="material-symbols-outlined text-[#006a66] text-sm shrink-0 mt-0.5">liquor</span>
                  <span className="text-[11px] line-clamp-1"><strong>BYOB:</strong> {pkg.corkagePolicy}</span>
                </div>
              </div>
            </div>

            {/* Bottom Booking Action in Modal */}
            <div className="pt-4 mt-4 border-t border-[#e2e8e5]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#55635e] font-medium">Cabana &amp; Tier Upgrade:</span>
                <span className="font-mono text-sm font-bold text-[#003528]">
                  {totalCabanaDelta === 0 ? (
                    <span className="text-emerald-700 font-bold">Included in Pass</span>
                  ) : (
                    <span>+ {formatPrice(totalCabanaDelta)} Upgrade</span>
                  )}
                </span>
              </div>

              <button
                onClick={() => {
                  onSelectCabana(cabana, chosenTier);
                  onClose();
                }}
                className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-[#003528] text-white hover:bg-[#004d3b]'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {isSelected ? 'verified' : 'deck'}
                </span>
                <span>{isSelected ? 'Keep this Cabana & Package' : 'Select this Cabana & Package'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
