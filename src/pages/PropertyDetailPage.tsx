import React, { useState, useEffect } from 'react';
import { SanctuaryProperty, Currency, PageType, CabanaUnit, CabanaPackageTier } from '../types';
import { USD_EXCHANGE_RATE, getPropertyCabanas } from '../data/mockData';
import { CabanaSelectionSection } from '../components/CabanaSelectionSection';
import { SubCabanaDetailModal } from '../components/SubCabanaDetailModal';

interface PropertyDetailPageProps {
  property: SanctuaryProperty;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onNavigate: (page: PageType) => void;
  onProceedToCheckout: (checkoutParams: {
    property: SanctuaryProperty;
    date: string;
    slot: string;
    packageName: string;
    adults: number;
    children: number;
    addOns: { jetski: boolean; transfer: boolean; byob: boolean };
    totalLkr: number;
    totalUsd: number;
    selectedCabana?: CabanaUnit;
    selectedTier?: CabanaPackageTier;
    cabanaLocation?: string;
  }) => void;
  isSaved: boolean;
  onToggleWishlist: (propertyId: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  currency,
  onNavigate,
  onProceedToCheckout,
  isSaved,
  onToggleWishlist
}) => {
  const [selectedPackageType, setSelectedPackageType] = useState<'dayout' | 'overnight'>('dayout');
  const [selectedDate, setSelectedDate] = useState<string>('2025-04-20');
  const [selectedSlot, setSelectedSlot] = useState<string>('09:30 AM – 05:30 PM');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [addJetSki, setAddJetSki] = useState<boolean>(false);
  const [addTransfer, setAddTransfer] = useState<boolean>(false);
  const [addByob, setAddByob] = useState<boolean>(true);
  const [paymentChoice, setPaymentChoice] = useState<'deposit' | 'full'>('deposit');
  const [showFullGalleryModal, setShowFullGalleryModal] = useState<boolean>(false);
  const [activeFullGalleryIdx, setActiveFullGalleryIdx] = useState<number>(0);

  // Available private cabanas inside this property (4 to 5 units)
  const availableCabanas = getPropertyCabanas(property);
  const [selectedCabana, setSelectedCabana] = useState<CabanaUnit>(availableCabanas[0]);
  const [selectedTier, setSelectedTier] = useState<CabanaPackageTier | undefined>(
    availableCabanas[0]?.packageDetails?.packageTiers?.[0]
  );
  const [showSelectedCabanaModal, setShowSelectedCabanaModal] = useState<boolean>(false);

  // Synchronize selected cabana and tier whenever property changes
  useEffect(() => {
    const freshCabanas = getPropertyCabanas(property);
    if (freshCabanas && freshCabanas.length > 0) {
      setSelectedCabana(freshCabanas[0]);
      setSelectedTier(freshCabanas[0]?.packageDetails?.packageTiers?.[0]);
    }
  }, [property]);

  const handleSelectCabana = (cabana: CabanaUnit, tier?: CabanaPackageTier) => {
    setSelectedCabana(cabana);
    if (tier) {
      setSelectedTier(tier);
    } else {
      setSelectedTier(cabana.packageDetails?.packageTiers?.[0]);
    }
  };

  // Live Slot Hold Timer countdown
  const [timerSeconds, setTimerSeconds] = useState<number>(718); // 11m 58s

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerDisplay = `${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(
    timerSeconds % 60
  ).padStart(2, '0')}`;

  // Price calculations
  const basePrice = selectedPackageType === 'dayout' ? property.priceLkr : (property.pricePerStayLkr || 42000);
  const adultsTotal = selectedPackageType === 'dayout' ? basePrice * adults : basePrice;
  const childrenTotal = selectedPackageType === 'dayout' ? Math.round(basePrice * 0.5) * children : 0;
  const jetskiCost = addJetSki ? 8500 : 0;
  const transferCost = addTransfer ? 12000 : 0;
  const byobCost = addByob ? 1500 : 0;
  const cabanaUpgradeCost = selectedCabana ? (selectedCabana.priceDeltaLkr || 0) : 0;
  const tierUpgradeCost = (selectedTier?.priceDeltaLkr || 0) * adults;

  const totalLkr = adultsTotal + childrenTotal + jetskiCost + transferCost + byobCost + cabanaUpgradeCost + tierUpgradeCost;
  const totalUsd = Number((totalLkr / USD_EXCHANGE_RATE).toFixed(2));
  const payableNowLkr = paymentChoice === 'deposit' ? Math.round(totalLkr * 0.2) : totalLkr;

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const handleCheckoutClick = () => {
    const pkgName = selectedTier
      ? `${selectedCabana.code} (${selectedCabana.typeLabel}) · ${selectedTier.name}`
      : `${selectedCabana.code} · ${selectedCabana.packageDetails?.tierName || 'Day Pass'}`;

    onProceedToCheckout({
      property,
      date: selectedDate,
      slot: selectedSlot,
      packageName: pkgName,
      adults,
      children,
      addOns: {
        jetski: addJetSki,
        transfer: addTransfer,
        byob: addByob
      },
      totalLkr,
      totalUsd,
      selectedCabana,
      selectedTier,
      cabanaLocation: `${selectedCabana.code} - ${selectedCabana.name}`
    });
  };

  // Full sanctuary gallery images
  const allPropertyPhotos = [
    property.imageUrl,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA1yaD1jKP08nNpCh0Z-kEE6F8xdx6Iz4PehiNqN3GSAk9EPjYeHPREOoPi_d-VAWu1TW4wJFgR2LwgqgQ4MiooOSIPZboIMnWB0kjvqSyepJKgf0iVEoG3fphEJxn_6YLOlJ-_GnK9GH2GUX9eQXGtcZtnaK-DDU76APMXU-wSh9chXaqlX-udUc_jNoAg-hprK5knXICwG6bPWxTXuIlc-5WhEDQz5i_7FlI-eMpFdIZWyzy4paav',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuADEoVD0RY4y8v3FocVRlEOeFGj0sfPs0j10HlKgpN8hPDQgG1Cp0XPwtF0wzEcnBkssXMf5ap88gLC3O0W-nqzgrFptbAuI2zrkqWvWxM-lH5CIdPqQfQtOG2aV-0WoeqmLcgYEMK1Etb7zGjygx3SEat-6Em5mpWaetSQJvM2OSRURcqIv68AfCYJYdJD5uOcRd0t7xBe3HpTGKkFP-9Lbviq9NKimu3_Lf6D-3sPP53OMPrcRaOa',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0'
  ];

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-[#e2e8e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#55635e]">
            <button
              onClick={() => onNavigate('explore-stays')}
              className="hover:text-[#003528] font-medium transition cursor-pointer"
            >
              Explore Sanctuaries
            </button>
            <span>/</span>
            <span>{property.province || 'Sri Lanka'}</span>
            <span>/</span>
            <span className="text-[#003528] font-semibold truncate max-w-xs">{property.name}</span>
          </div>

          <button
            onClick={() => onToggleWishlist(property.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#003528] hover:text-rose-600 transition cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'text-rose-500 font-variation-fill' : ''}`}>
              favorite
            </span>
            <span>{isSaved ? 'Saved to Wishlist' : 'Save Sanctuary'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#55635e] mb-2 font-mono">
            <span className="font-bold text-[#006a66] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified</span>
              {property.verificationBadge}
            </span>
            <span>·</span>
            <span>License: {property.sltdaLicense || 'SLTDA/SQA/PRO/01824'}</span>
            <span>·</span>
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">star</span>
              {property.rating} ({property.reviewCount} verified reviews)
            </span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#003528] tracking-tight">
            {property.name}
          </h1>

          <p className="mt-2 text-sm text-[#55635e] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#006a66]">location_on</span>
            {property.location} · 1h 20m from Colombo via Southern Expressway
          </p>
        </div>

        {/* Media Bento Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-10 rounded-2xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-slate-100 group">
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
              onClick={() => {
                setActiveFullGalleryIdx(0);
                setShowFullGalleryModal(true);
              }}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
              Oceanfront Pool Pavilion
            </div>
          </div>

          <div
            onClick={() => {
              setActiveFullGalleryIdx(1);
              setShowFullGalleryModal(true);
            }}
            className="aspect-[4/3] overflow-hidden bg-slate-100 relative group cursor-pointer"
          >
            <img
              src={allPropertyPhotos[1]}
              alt="Buffet Dining"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
              Buffet Dining
            </span>
          </div>

          <div
            onClick={() => {
              setActiveFullGalleryIdx(2);
              setShowFullGalleryModal(true);
            }}
            className="aspect-[4/3] overflow-hidden bg-slate-100 relative group cursor-pointer"
          >
            <img
              src={allPropertyPhotos[2]}
              alt="Deluxe Suite"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
              Deluxe Suite
            </span>
          </div>

          <div
            onClick={() => {
              setActiveFullGalleryIdx(3);
              setShowFullGalleryModal(true);
            }}
            className="aspect-[4/3] overflow-hidden bg-slate-100 relative group cursor-pointer"
          >
            <img
              src={allPropertyPhotos[3]}
              alt="Beachfront Loungers"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded">
              Beach Loungers
            </span>
          </div>

          <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative group">
            <img
              src={allPropertyPhotos[4]}
              alt="Private Cabana"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => {
                setActiveFullGalleryIdx(0);
                setShowFullGalleryModal(true);
              }}
              className="absolute inset-0 bg-black/50 hover:bg-black/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">photo_library</span>
              View All Photos
            </button>
          </div>
        </div>

        {/* 2-Column Split: Content Left, Sticky Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: Details, Experience Pass, Cabana Selection, Amenities */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview & Architecture */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-[#003528] mb-3">
                About this Sanctuary
              </h2>
              <p className="text-sm text-[#404945] leading-relaxed">
                {property.description ||
                  'Perched directly on the golden sandy shores of Bentota, The Palms Oceanfront Sanctuary pairs coastal serenity with refined Sri Lankan tropical hospitality. Inspired by tropical modernism, this sanctuary features expansive sun terraces, palm-shaded daybeds, direct Indian ocean access, and Geoffrey Bawa architectural influences.'}
              </p>
            </div>

            {/* Experience / Package Choice */}
            <div className="bg-white rounded-2xl p-6 border border-[#e2e8e5] shadow-xs">
              <h3 className="font-headline text-lg font-bold text-[#003528] mb-4">
                Choose Your Experience Pass
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedPackageType('dayout')}
                  className={`p-4 rounded-xl text-left border-2 transition cursor-pointer ${
                    selectedPackageType === 'dayout'
                      ? 'border-[#003528] bg-[#f4f7f6]'
                      : 'border-[#e2e8e5] bg-white hover:border-[#003528]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline text-sm font-bold text-[#003528]">
                      All-Inclusive Day Out Pass
                    </span>
                    <span className="material-symbols-outlined text-sm text-[#006a66]">
                      {selectedPackageType === 'dayout' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <p className="text-xs text-[#55635e] mb-3">
                    09:30 AM – 05:30 PM • Buffet lunch, infinity pool, welcome king coconuts &amp; cabana
                  </p>
                  <div className="font-headline text-base font-extrabold text-[#003528] tabular-nums">
                    {formatPrice(property.priceLkr)} <span className="text-xs font-normal text-[#55635e]">/ guest</span>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedPackageType('overnight')}
                  className={`p-4 rounded-xl text-left border-2 transition cursor-pointer ${
                    selectedPackageType === 'overnight'
                      ? 'border-[#003528] bg-[#f4f7f6]'
                      : 'border-[#e2e8e5] bg-white hover:border-[#003528]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-headline text-sm font-bold text-[#003528]">
                      Deluxe Ocean Chalet Stay
                    </span>
                    <span className="material-symbols-outlined text-sm text-[#006a66]">
                      {selectedPackageType === 'overnight' ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                  <p className="text-xs text-[#55635e] mb-3">
                    Check-in 02:00 PM • Private ocean veranda, breakfast buffet, 24h pool &amp; butler
                  </p>
                  <div className="font-headline text-base font-extrabold text-[#003528] tabular-nums">
                    {formatPrice(property.pricePerStayLkr || 42000)} <span className="text-xs font-normal text-[#55635e]">/ night</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 5-Star Private Sub-Cabanas Selection Section */}
            <CabanaSelectionSection
              property={property}
              currency={currency}
              selectedCabana={selectedCabana}
              selectedTier={selectedTier}
              onSelectCabana={handleSelectCabana}
            />

            {/* Inclusions Matrix */}
            <div>
              <h3 className="font-headline text-xl font-bold text-[#003528] mb-4">
                Verified Inclusions &amp; Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {property.inclusions.map((inc, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#e2e8e5]">
                    <span className="material-symbols-outlined text-[#006a66] text-lg">check_circle</span>
                    <span className="text-xs font-semibold text-[#003528]">{inc}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#e2e8e5]">
                  <span className="material-symbols-outlined text-[#006a66] text-lg">wifi</span>
                  <span className="text-xs font-semibold text-[#003528]">High-Speed Starlink WiFi</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-[#e2e8e5]">
                  <span className="material-symbols-outlined text-[#006a66] text-lg">liquor</span>
                  <span className="text-xs font-semibold text-[#003528]">BYOB Permitted (Free Corkage)</span>
                </div>
              </div>
            </div>

            {/* SLTDA Regulations & Safety */}
            <div className="p-6 rounded-2xl bg-[#eaf4f3] border border-[#d2e4e1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-headline text-base font-bold text-[#003528]">
                  SLTDA Certified Escapes Policy
                </h4>
                <p className="text-xs text-[#55635e] mt-1">
                  Cancellation free of charge up to 24 hours prior to arrival. 100% refund held in official escrow.
                </p>
              </div>
              <span className="px-3 py-1.5 rounded-lg bg-white text-[#003528] font-mono text-xs font-bold border border-[#d2e4e1] shrink-0">
                Escrow Protected
              </span>
            </div>
          </div>

          {/* Right Column: Sticky Purchase & Hold Module */}
          <div className="sticky top-28 bg-white rounded-3xl border border-[#e2e8e5] shadow-xl p-6 lg:p-7 space-y-6">
            {/* Header: Price & Hold Timer */}
            <div className="flex items-start justify-between pb-4 border-b border-[#f0f4f2]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#55635e]">Price Breakdown</span>
                <div className="font-headline text-3xl font-extrabold text-[#003528] tabular-nums mt-0.5">
                  {formatPrice(totalLkr)}
                </div>
                <span className="text-xs text-[#55635e]">
                  {selectedPackageType === 'dayout' ? `for ${adults} guests` : 'per night suite'}
                </span>
              </div>

              {/* Countdown timer badge */}
              <div className="text-right">
                <span className="text-[10px] text-[#55635e] block uppercase font-mono">Slot Lock</span>
                <span className="font-mono text-xs font-bold text-[#006a66] bg-[#f4f7f6] px-2.5 py-1 rounded-md border border-[#e2e8e5] inline-block mt-0.5">
                  {timerDisplay} left
                </span>
              </div>
            </div>

            {/* Reserved Private Cabana & Package Live Summary Card */}
            <div className="p-3.5 rounded-2xl bg-[#f0faf7] border border-[#b2e4dc] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#006a66] flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">deck</span>
                  Reserved Cabana &amp; Package
                </span>
                <a
                  href="#private-cabanas-section"
                  className="text-[11px] font-bold text-[#006a66] hover:underline"
                >
                  Change Spot
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-white shadow-xs">
                  <img
                    src={selectedCabana.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#003528] text-white text-[10px] font-mono font-bold">
                      {selectedCabana.code}
                    </span>
                    <h4 className="text-xs font-bold text-[#003528] truncate">{selectedCabana.name}</h4>
                  </div>
                  <div className="text-[10px] text-[#55635e] flex items-center gap-2 mt-0.5">
                    <span>{selectedCabana.capacity}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold truncate">{selectedCabana.viewType}</span>
                  </div>
                </div>
              </div>

              {/* Package Details Snapshot */}
              <div className="pt-2 border-t border-[#c6ece6] space-y-1 text-[11px] text-[#404945]">
                <div className="flex items-center justify-between font-bold text-[#003528]">
                  <span>Package Tier:</span>
                  <span className="text-emerald-800">
                    {selectedTier ? selectedTier.name : selectedCabana.packageDetails.tierName}
                  </span>
                </div>
                <div className="flex items-start gap-1 text-[10px] text-[#55635e]">
                  <span className="shrink-0 font-semibold text-[#003528]">Meal:</span>
                  <span className="truncate">
                    {selectedTier ? selectedTier.diningPlan : selectedCabana.packageDetails.diningPlan}
                  </span>
                </div>
                <div className="flex items-start gap-1 text-[10px] text-[#55635e]">
                  <span className="shrink-0 font-semibold text-[#003528]">Welcome:</span>
                  <span className="truncate">{selectedCabana.packageDetails.welcomeRefreshment}</span>
                </div>
                <div className="flex items-start gap-1 text-[10px] text-[#55635e]">
                  <span className="shrink-0 font-semibold text-[#003528]">Corkage:</span>
                  <span className="truncate">{selectedCabana.packageDetails.corkagePolicy}</span>
                </div>
              </div>

              {cabanaUpgradeCost > 0 && (
                <div className="pt-1.5 border-t border-[#c6ece6] flex items-center justify-between text-[11px]">
                  <span className="text-[#55635e]">VIP Cabana Upgrade ({selectedCabana.code}):</span>
                  <span className="font-mono font-bold text-[#003528]">+ {formatPrice(cabanaUpgradeCost)}</span>
                </div>
              )}

              {tierUpgradeCost > 0 && (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#55635e]">Package Tier Upgrade:</span>
                  <span className="font-mono font-bold text-[#003528]">+ {formatPrice(tierUpgradeCost)}</span>
                </div>
              )}

              {/* Quick Spec & Photo Modal Trigger */}
              <button
                type="button"
                onClick={() => setShowSelectedCabanaModal(true)}
                className="w-full mt-2 py-2 px-3 rounded-xl bg-white border border-[#b2e4dc] text-[11px] font-bold text-[#006a66] hover:bg-[#eefaf8] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">architecture</span>
                <span>Inspect Specifications &amp; Photo Gallery</span>
              </button>
            </div>

            {/* Controls: Date, Time Slot, Guests */}
            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] font-mono"
                />
              </div>

              {/* Slot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                  Arrival Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] cursor-pointer"
                >
                  <option value="09:30 AM – 05:30 PM">09:30 AM – 05:30 PM (Full Day)</option>
                  <option value="12:00 PM – 06:00 PM">12:00 PM – 06:00 PM (Sunset Pass)</option>
                </select>
              </div>

              {/* Guest Counter */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Adults
                  </label>
                  <div className="flex items-center justify-between border border-[#e2e8e5] rounded-xl px-2 py-1">
                    <button
                      onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[#f4f7f6] text-[#003528] font-bold flex items-center justify-center hover:bg-[#e2e8e5] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs font-mono">{adults}</span>
                    <button
                      onClick={() => setAdults((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-[#f4f7f6] text-[#003528] font-bold flex items-center justify-center hover:bg-[#e2e8e5] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Kids (5-12)
                  </label>
                  <div className="flex items-center justify-between border border-[#e2e8e5] rounded-xl px-2 py-1">
                    <button
                      onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                      className="w-7 h-7 rounded-lg bg-[#f4f7f6] text-[#003528] font-bold flex items-center justify-center hover:bg-[#e2e8e5] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs font-mono">{children}</span>
                    <button
                      onClick={() => setChildren((prev) => prev + 1)}
                      className="w-7 h-7 rounded-lg bg-[#f4f7f6] text-[#003528] font-bold flex items-center justify-center hover:bg-[#e2e8e5] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Add-Ons */}
              <div className="pt-2 border-t border-[#f0f4f2] space-y-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#55635e]">
                  Optional Escapes Add-Ons
                </span>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addJetSki}
                      onChange={(e) => setAddJetSki(e.target.checked)}
                      className="rounded accent-[#003528]"
                    />
                    <span className="text-[#003528] font-medium">Bentota Sea Jet Ski (30 min)</span>
                  </div>
                  <span className="font-mono font-semibold text-[#003528]">+ {formatPrice(8500)}</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addTransfer}
                      onChange={(e) => setAddTransfer(e.target.checked)}
                      className="rounded accent-[#003528]"
                    />
                    <span className="text-[#003528] font-medium">Private AC Van Transfer (Colombo)</span>
                  </div>
                  <span className="font-mono font-semibold text-[#003528]">+ {formatPrice(12000)}</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#f4f7f6] hover:bg-[#ebf0ee] transition cursor-pointer text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addByob}
                      onChange={(e) => setAddByob(e.target.checked)}
                      className="rounded accent-[#003528]"
                    />
                    <span className="text-[#003528] font-medium">BYOB Service &amp; Ice Chiller Bucket</span>
                  </div>
                  <span className="font-mono font-semibold text-[#003528]">+ {formatPrice(1500)}</span>
                </label>
              </div>
            </div>

            {/* Payment Choice */}
            <div className="pt-2 border-t border-[#f0f4f2]">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="text-[#55635e]">Payable Now (20% Advance):</span>
                <span className="font-headline font-bold text-[#003528] tabular-nums">
                  {formatPrice(payableNowLkr)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#55635e] mb-4">
                <span>Due upon Gate Check-In:</span>
                <span className="font-mono">{formatPrice(totalLkr - payableNowLkr)}</span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Hold Pass &amp; Proceed to Checkout</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>

              {/* Direct Host WhatsApp & Call Actions */}
              {(property.whatsapp || property.phone) && (
                <div className="pt-2.5 grid grid-cols-2 gap-2 text-xs">
                  {property.whatsapp && (
                    <a
                      href={`https://wa.me/${property.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {property.phone && (
                    <a
                      href={`tel:${property.phone.replace(/[^0-9+]/g, '')}`}
                      className="py-2.5 px-3 rounded-xl bg-[#f4f7f6] hover:bg-[#e8eee9] text-[#003528] border border-[#e2e8e5] font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <span className="material-symbols-outlined text-sm text-[#006a66]">call</span>
                      <span>Call Host</span>
                    </a>
                  )}
                </div>
              )}

              <p className="text-[11px] text-center text-[#55635e] mt-2 flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006a66]">lock</span>
                Instant SLTDA Digital QR Gate Pass generated upon confirmation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full Sanctuary Photos Modal */}
      {showFullGalleryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col p-4 sm:p-6 border border-white/20">
            <div className="flex items-center justify-between pb-3 text-white border-b border-white/10 mb-3">
              <div>
                <h3 className="font-bold text-base">{property.name}</h3>
                <span className="text-xs text-slate-400">Photo {activeFullGalleryIdx + 1} of {allPropertyPhotos.length}</span>
              </div>
              <button
                onClick={() => setShowFullGalleryModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="relative aspect-[16/10] bg-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={allPropertyPhotos[activeFullGalleryIdx]}
                alt=""
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveFullGalleryIdx((prev) => (prev - 1 + allPropertyPhotos.length) % allPropertyPhotos.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => setActiveFullGalleryIdx((prev) => (prev + 1) % allPropertyPhotos.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {allPropertyPhotos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFullGalleryIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                    activeFullGalleryIdx === i ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Cabana Detailed Specifications & Photo Gallery Modal */}
      {showSelectedCabanaModal && (
        <SubCabanaDetailModal
          cabana={selectedCabana}
          currency={currency}
          isSelected={true}
          selectedTierId={selectedTier?.id}
          onSelectCabana={handleSelectCabana}
          onClose={() => setShowSelectedCabanaModal(false)}
          initialTab="specs"
        />
      )}
    </div>
  );
};
