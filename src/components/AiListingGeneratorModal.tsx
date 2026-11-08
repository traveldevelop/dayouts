import React, { useState } from 'react';
import { SanctuaryProperty, CabanaUnit, Currency } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';
import { getCabanaSpecifications } from '../data/cabanasData';

interface AiListingGeneratorModalProps {
  currency: Currency;
  onClose: () => void;
  onListingCreated: (newProperty: SanctuaryProperty) => void;
}

export const AiListingGeneratorModal: React.FC<AiListingGeneratorModalProps> = ({
  currency,
  onClose,
  onListingCreated
}) => {
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extracted Property State
  const [extractedData, setExtractedData] = useState<any | null>(null);

  // Owner Image Additions ("images witarak owner add karai")
  const [coverImageUrl, setCoverImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');

  const samplePavanaText = `මීගමුවෙන් රු3000 ට Couple Room එකක්😮🍇🦀🐬🌿🐙🌻

මේක නම් වාසී🤩මිගමුවෙන් බජට් Place ඉල්ලපු අයට, අතේ ඇති ගානට නිදහස උපරිමයෙන් භුක්ති විදින්න, මීගමුව Beach Road එකේම නිදහස නවාතැනක්🥰🥺

මේ Pavana Beach Hotel - Negambo ❤️
☎️ Call Now : 0771583494 / 0773580154
📲 Whatsapp : wa.me/+94771583494

🛑 Couple Dayout Packages
    - Comfortable Bedroom
    - Welcome Drink
    - Complimentary Lunch
    - 9AM to 4PM

✅ LKR 3,990/- Standard Room without A/C
✅ LKR 5,490/- Standard Room with A/C
✅ LKR 5,490/- Apartment type Room without A/C
✅ LKR 6,990/- Apartment type Room with A/C
.
.
🛑 Night Stay Room Only Packages
      2PM to Next Day 12PM

✅ LKR 3,000/- Standard Room without A/C
✅ LKR 4,500/- Standard Room with A/C
✅ LKR 4,500/- Apartment type Room without A/C
✅ LKR 6,500/- Apartment type Room with A/C

ඒ වගේම Long Stay එකකට එනව නම් විශේෂ මිල ගනන් යටතේ Packages Customize කරලා ගන්න පුලුවන්🥳

🛑 Facilities
🔰 Comfortable Bedrooms
🔰 A/C & Non A/C Rooms
🔰 Attached Bathrooms 
🔰 Free parking
🔰 Meals available on order`;

  const handleUseSample = () => {
    setRawText(samplePavanaText);
    setErrorMsg(null);
  };

  const handleAnalyzeWithAi = async () => {
    if (!rawText.trim()) {
      setErrorMsg('Please paste some text or promotional details first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/parse-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to extract listing details with AI');
      }

      setExtractedData(resData.data);
    } catch (err: any) {
      console.error('AI extraction error:', err);
      setErrorMsg(err.message || 'Error communicating with AI service');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddImage = () => {
    if (customImageUrlInput.trim()) {
      setGalleryImages((prev) => [...prev, customImageUrlInput.trim()]);
      setCustomImageUrlInput('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCoverImageUrl(dataUrl);
          setGalleryImages((prev) => [dataUrl, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishListing = () => {
    if (!extractedData) return;

    const propertyId = `prop-${extractedData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    // Build Sub-Units / Room Types for this property
    const subUnits: CabanaUnit[] = (extractedData.subUnits || []).map((u: any, idx: number) => {
      const subId = `${propertyId}-rm-${idx + 1}`;
      const baseUnit: CabanaUnit = {
        id: subId,
        code: u.code || `RM-0${idx + 1}`,
        name: u.name,
        type: (u.type as any) || 'oceanfront',
        typeLabel: u.typeLabel || (u.acAvailable ? 'A/C Room' : 'Non-A/C Room'),
        tagline: `${u.name} with ${u.diningPlan || 'included meals'}`,
        capacity: u.capacity || 'Up to 2 Adults (Couple)',
        maxAdults: u.maxAdults || 2,
        maxKids: u.maxKids || 1,
        priceDeltaLkr: Math.max(0, (u.dayOutPriceLkr || 0) - (extractedData.dayOutPriceLkr || 0)),
        coverImage: galleryImages[idx % galleryImages.length] || coverImageUrl,
        images: galleryImages,
        features: [
          u.acAvailable ? 'Air Conditioned' : 'Ceiling Fan Cooling',
          'Attached Private Bathroom with Shower',
          u.diningPlan || 'Complimentary Lunch included',
          u.welcomeDrink || 'Welcome drink on arrival'
        ],
        viewType: 'Garden & Coastal Breeze',
        privacyLevel: 'High',
        status: 'AVAILABLE',
        slotsRemaining: 4,
        description: u.description || `${u.name} for Day Out (${extractedData.dayOutTimeSlot || '9AM - 4PM'}) and Night Stay (${extractedData.nightStayTimeSlot || '2PM - 12PM'}).`,
        packageDetails: {
          tierName: `${u.name} Day Pass`,
          diningPlan: u.diningPlan || 'Complimentary Lunch + Welcome Drink',
          welcomeRefreshment: u.welcomeDrink || 'Fresh Welcome Drink on arrival',
          swimmingAccess: 'Beach walk & courtyard lounge access',
          towelPolicy: 'Fresh room towels provided',
          corkagePolicy: 'BYOB Permitted (Corkage Free) + Ice on request',
          changingRoom: 'Private attached bathroom & bedroom suite',
          schedule: extractedData.dayOutTimeSlot || '09:00 AM – 04:00 PM',
          exclusivePerks: [
            'Private bedroom for dayout relaxation',
            'Attached modern bathroom',
            'Free secure vehicle parking'
          ],
          packageTiers: [
            {
              id: `${subId}-dayout`,
              name: `Couple Day Out Pass (9AM - 4PM)`,
              priceDeltaLkr: 0,
              timing: extractedData.dayOutTimeSlot || '09:00 AM – 04:00 PM',
              diningPlan: u.diningPlan || 'Complimentary Lunch',
              highlights: ['Comfortable Bedroom', 'Welcome Drink', 'Attached Bathroom']
            },
            {
              id: `${subId}-night`,
              name: `Night Stay Room Only (2PM - Next Day 12PM)`,
              priceDeltaLkr: Math.max(0, (u.nightStayPriceLkr || 0) - (u.dayOutPriceLkr || 0)),
              timing: extractedData.nightStayTimeSlot || '02:00 PM – 12:00 PM (Next Day)',
              diningPlan: 'Room Only (Meals available on order)',
              highlights: ['Overnight Bedroom Stay', 'Next Day 12 PM Checkout', 'Free Parking']
            }
          ]
        }
      };

      baseUnit.specifications = getCabanaSpecifications(baseUnit);
      return baseUnit;
    });

    const newProperty: SanctuaryProperty = {
      id: propertyId,
      name: extractedData.name,
      tagline: extractedData.tagline || 'Coastal couple retreat & dayout sanctuary',
      location: extractedData.location,
      district: extractedData.district || 'Negombo',
      province: extractedData.province || 'Western Province',
      imageUrl: coverImageUrl,
      rating: 4.8,
      reviewCount: 1,
      passType: 'dual',
      passTypeLabel: 'Day Out Pass & Night Stay',
      verificationBadge: 'SLTDA Verified Listing',
      timeSlot: extractedData.dayOutTimeSlot || '09:00 AM – 04:00 PM',
      nightStaySlot: extractedData.nightStayTimeSlot || '02:00 PM – 12:00 PM (Next Day)',
      slotsLeft: 6,
      priceLkr: extractedData.dayOutPriceLkr || 3990,
      pricePerStayLkr: extractedData.nightStayPriceLkr || 3000,
      phone: extractedData.phone || '0771583494',
      whatsapp: extractedData.whatsapp || '+94771583494',
      inclusions: extractedData.inclusions || [
        'Comfortable Bedroom',
        'Welcome Drink',
        'Complimentary Lunch',
        'Attached Bathrooms',
        'Free Parking'
      ],
      features: [
        'Beach Road Location',
        'A/C & Non A/C Rooms Available',
        'Day Out (9AM-4PM) & Night Stay Options',
        'Attached Modern Bathrooms',
        'Free Secure Parking'
      ],
      description: extractedData.description || rawText,
      category: extractedData.category || 'hotel',
      subUnits: subUnits.length > 0 ? subUnits : undefined
    };

    onListingCreated(newProperty);
    onClose();
  };

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#e2e8e5]">
        {/* Modal Top Header */}
        <div className="bg-[#003528] text-white p-5 sm:p-6 shrink-0 relative flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-teal-300 text-lg animate-pulse">auto_awesome</span>
              <span className="text-[11px] font-mono text-teal-300 uppercase tracking-wider font-bold">
                AI MAGIC LISTING CREATOR · AI ස්වයංක්‍රීය දැන්වීම් පද්ධතිය
              </span>
            </div>
            <h2 className="font-headline text-xl sm:text-2xl font-bold">
              Paste Promo Text &amp; Auto-Extract All Details
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              AI automatically extracts property name, couple dayout packages, A/C &amp; Non-A/C room rates, contacts, and timings. You only add the images!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs text-[#121d1e]">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm shrink-0">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Raw Text Input */}
          {!extractedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#003528] text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#006a66]">description</span>
                  <span>Paste Social Media Post, WhatsApp Message or Notes:</span>
                </label>

                <button
                  type="button"
                  onClick={handleUseSample}
                  className="px-3 py-1 rounded-lg bg-[#eaf4f3] hover:bg-[#d8ece9] text-[#006a66] font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">magic_button</span>
                  <span>Try Pavana Beach Hotel Sample</span>
                </button>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={9}
                placeholder="Paste any Sinhala or English promotional text here (e.g. මීගමුවෙන් රු3000 ට Couple Room එකක්... Pavana Beach Hotel Negombo... Couple Dayout Packages 9AM to 4PM LKR 3,990... Night Stay LKR 3,000... 0771583494)..."
                className="w-full p-4 rounded-2xl border border-[#ccd5d1] focus:border-[#003528] focus:ring-2 focus:ring-[#003528]/15 outline-none font-mono text-xs leading-relaxed bg-[#fafbfb]"
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#55635e]">
                  Supports Sinhala (සිංහල), English, Singlish, emoji-heavy Facebook posts, and WhatsApp flyers.
                </span>

                <button
                  type="button"
                  onClick={handleAnalyzeWithAi}
                  disabled={isAnalyzing || !rawText.trim()}
                  className="px-6 py-3 rounded-xl bg-[#003528] hover:bg-[#004d3b] disabled:bg-slate-300 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>AI Extracting Details...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                      <span>Analyze &amp; Extract with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Extracted Data Review & Owner Images ("images witarak owner add karai") */}
          {extractedData && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Success Banner */}
              <div className="p-3.5 rounded-2xl bg-[#eefaf8] border border-[#b2e4dc] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a66] text-xl">check_circle</span>
                  <div>
                    <strong className="text-[#003528] text-xs">AI Extraction Succeeded!</strong>
                    <span className="text-[#55635e] text-[11px] block">
                      All pricing, dayout and night stay room types, facilities, and contact details have been structured.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExtractedData(null)}
                  className="text-xs text-[#006a66] hover:underline font-bold"
                >
                  Edit Raw Text
                </button>
              </div>

              {/* 1. Property Details Card */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66]">
                    1. Basic Property Information
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                    {extractedData.category || 'Hotel'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#55635e] uppercase block">Property Name</label>
                    <input
                      type="text"
                      value={extractedData.name}
                      onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-[#ccd5d1] font-bold text-[#003528]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#55635e] uppercase block">Location / Town</label>
                    <input
                      type="text"
                      value={extractedData.location}
                      onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-[#ccd5d1]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#55635e] uppercase block">Phone Contact</label>
                    <input
                      type="text"
                      value={extractedData.phone || ''}
                      onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-[#ccd5d1] font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#55635e] uppercase block">WhatsApp Number</label>
                    <input
                      type="text"
                      value={extractedData.whatsapp || ''}
                      onChange={(e) => setExtractedData({ ...extractedData, whatsapp: e.target.value })}
                      className="w-full mt-1 p-2 rounded-lg border border-[#ccd5d1] font-mono text-emerald-800"
                    />
                  </div>
                </div>

                {/* DayOut & Night Stay Rates */}
                <div className="pt-2 border-t border-[#f0f4f2] grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <span className="text-[10px] font-bold text-[#55635e] block">Base Day Out ({extractedData.dayOutTimeSlot})</span>
                    <strong className="text-sm font-bold text-[#003528] font-mono">
                      {formatPrice(extractedData.dayOutPriceLkr || 3990)}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#f4f7f6] border border-[#e2e8e5]">
                    <span className="text-[10px] font-bold text-[#55635e] block">Base Night Stay ({extractedData.nightStayTimeSlot})</span>
                    <strong className="text-sm font-bold text-[#003528] font-mono">
                      {formatPrice(extractedData.nightStayPriceLkr || 3000)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. Extracted Room Types & Sub-Units */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66] block">
                  2. Room Types &amp; Package Tiers ({extractedData.subUnits?.length || 0} Units Extracted)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(extractedData.subUnits || []).map((unit: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl border border-[#e2e8e5] bg-[#fafbfb] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 rounded bg-[#003528] text-white font-mono text-[9px] font-bold">
                          {unit.code || `RM-0${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-[#006a66]">
                          {unit.acAvailable ? 'Air Conditioned' : 'Non-A/C'}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#003528]">{unit.name}</h4>
                      <div className="text-[11px] text-[#55635e] flex items-center justify-between pt-1 border-t border-[#e2e8e5]">
                        <span>Day Out: <strong>{formatPrice(unit.dayOutPriceLkr)}</strong></span>
                        <span>Night: <strong>{formatPrice(unit.nightStayPriceLkr)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Facilities & Inclusions */}
              <div className="p-4 rounded-2xl bg-white border border-[#e2e8e5] shadow-xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66] block">
                  3. Inclusions &amp; Facilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(extractedData.inclusions || []).map((inc: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#eaf4f3] text-[#003528] font-semibold text-[11px] flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-emerald-600">check</span>
                      <span>{inc}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Owner Photo Manager ("images witarak owner add karai") */}
              <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#006a66]/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a66] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">photo_camera</span>
                      4. Owner Image Upload (ඡායාරූප පමණක් ඇතුළත් කරන්න)
                    </span>
                    <p className="text-[#55635e] text-[11px]">
                      Upload hotel/room photos from device or enter image URLs:
                    </p>
                  </div>

                  <label className="px-3 py-1.5 rounded-xl bg-[#003528] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#004d3b] transition">
                    <span className="material-symbols-outlined text-sm">upload</span>
                    <span>Upload from Device</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Cover Photo Preview */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#55635e] block mb-1">
                    Main Cover Image:
                  </span>
                  <div className="relative aspect-[16/8] sm:aspect-[16/6] rounded-xl overflow-hidden bg-slate-100 border border-[#e2e8e5]">
                    <img src={coverImageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                      Main Listing Photo
                    </span>
                  </div>
                </div>

                {/* Additional Gallery Photos Strip */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-[#55635e]">
                      Room &amp; Property Gallery Photos ({galleryImages.length}):
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border border-[#e2e8e5] group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition"
                          title="Remove photo"
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image by URL */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (e.g. https://...)..."
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-[#ccd5d1] text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={!customImageUrlInput.trim()}
                      className="px-3 py-2 rounded-xl bg-[#006a66] text-white font-bold text-xs hover:bg-[#00524f] disabled:opacity-50 transition cursor-pointer"
                    >
                      Add Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-[#f8faf9] border-t border-[#e2e8e5] p-4 sm:p-5 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-bold text-[#55635e] hover:bg-white transition cursor-pointer"
          >
            Cancel
          </button>

          {extractedData && (
            <button
              type="button"
              onClick={handlePublishListing}
              className="px-6 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              <span>Publish Listing to dayouts.lk</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
