import React, { useState, useEffect } from 'react';
import { BookingState, Currency, PageType, SanctuaryProperty, CabanaUnit, CabanaPackageTier } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';

interface CheckoutPageProps {
  property: SanctuaryProperty;
  initialParams?: {
    date?: string;
    slot?: string;
    packageName?: string;
    adults?: number;
    children?: number;
    addOns?: { jetski: boolean; transfer: boolean; byob: boolean };
    totalLkr?: number;
    totalUsd?: number;
    selectedCabana?: CabanaUnit;
    selectedTier?: CabanaPackageTier;
    cabanaLocation?: string;
  };
  currency: Currency;
  onNavigate: (page: PageType) => void;
  onBookingConfirmed: (booking: BookingState) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  property,
  initialParams,
  currency,
  onNavigate,
  onBookingConfirmed
}) => {
  // Form fields
  const [firstName, setFirstName] = useState('Anuka');
  const [lastName, setLastName] = useState('Perera');
  const [email, setEmail] = useState('anuka.perera@colombo.lk');
  const [phone, setPhone] = useState('77 419 8820');
  const [nicPassport, setNicPassport] = useState('199214502391');
  const initialCabana = initialParams?.selectedCabana;
  const [arrivalTime, setArrivalTime] = useState('10:00 AM');
  const [cabanaLocation, setCabanaLocation] = useState(
    initialParams?.cabanaLocation ||
      (initialCabana ? `${initialCabana.code} - ${initialCabana.name}` : 'CAB-01 - Oceanfront Grand Pavilion')
  );
  const [specialRequests, setSpecialRequests] = useState('Fresh King Coconuts on arrival for guests.');
  const [paymentChoice, setPaymentChoice] = useState<'pay_at_property' | 'online'>('pay_at_property');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Countdown timer: 11m 40s
  const [secondsLeft, setSecondsLeft] = useState(700);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timerFormatted = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(
    secondsLeft % 60
  ).padStart(2, '0')}`;

  const date = initialParams?.date || '2025-04-20';
  const slot = initialParams?.slot || property.timeSlot;
  const packageName = initialParams?.packageName || property.passTypeLabel;
  const adults = initialParams?.adults || 2;
  const children = initialParams?.children || 0;
  const totalLkr = initialParams?.totalLkr || property.priceLkr * adults;
  const totalUsd = initialParams?.totalUsd || Number((totalLkr / USD_EXCHANGE_RATE).toFixed(2));

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking: BookingState = {
        id: `DO-${Math.floor(1000 + Math.random() * 9000)}`,
        propertyId: property.id,
        propertyName: property.name,
        propertyLocation: property.location,
        propertyImage: property.imageUrl,
        selectedDate: date,
        selectedSlot: slot,
        packageName,
        adults,
        children,
        addOns: initialParams?.addOns || { jetski: false, transfer: false, byob: true },
        totalLkr,
        totalUsd,
        status: 'AWAITING_OWNER_APPROVAL',
        guestInfo: {
          firstName,
          lastName,
          email,
          phone,
          nicPassport,
          bookingMode: 'guest',
          arrivalTime,
          cabanaLocation,
          specialRequests,
          paymentChoice,
          sendWhatsApp
        },
        selectedCabana: initialCabana,
        selectedTier: initialParams?.selectedTier,
        createdAt: new Date().toISOString()
      };

      setIsSubmitting(false);
      onBookingConfirmed(newBooking);
    }, 800);
  };

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-20">
      {/* Breadcrumb Bar */}
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
            <button
              onClick={() => onNavigate('property-detail')}
              className="hover:text-[#003528] font-medium transition cursor-pointer"
            >
              {property.name}
            </button>
            <span>/</span>
            <span className="text-[#003528] font-semibold">Secure Reservation Hold</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#006a66]">
            <span className="w-2 h-2 rounded-full bg-[#006a66]"></span>
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#006a66] mb-1">
            SLTDA Verified Gate Clearance
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold text-[#003528] tracking-tight">
            Complete Your Reservation Hold
          </h1>
          <p className="text-sm text-[#55635e] mt-1">
            Fill in guest credentials to generate your official resort digital voucher and gate QR pass.
          </p>
        </div>

        {/* 2-Column Split: Form Left, Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Column: 3 Steps Form */}
          <form onSubmit={handleConfirmReservation} className="lg:col-span-2 space-y-8">
            {/* Step 1: Guest Identity & Verification */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e8e5] shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#f0f4f2]">
                <div className="w-8 h-8 rounded-full bg-[#003528] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#003528]">
                    Lead Guest Identity &amp; SLTDA Security Pass
                  </h3>
                  <p className="text-xs text-[#55635e]">
                    Required by resort security for gate access and day-out wristband issue.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Sri Lankan WhatsApp / Mobile
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#e2e8e5] bg-[#f4f7f6] text-xs text-[#55635e] font-mono">
                      +94
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] font-mono"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    National Identity Card (NIC) or Passport Number
                  </label>
                  <input
                    type="text"
                    required
                    value={nicPassport}
                    onChange={(e) => setNicPassport(e.target.value)}
                    placeholder="e.g. 199214502391 or N8291041"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] font-mono"
                  />
                  <p className="text-[11px] text-[#55635e] mt-1">
                    Used strictly for SLTDA tourism security compliance and resort gate matching.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Arrival & Cabana Seating Preferences */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e8e5] shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#f0f4f2]">
                <div className="w-8 h-8 rounded-full bg-[#003528] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#003528]">
                    Arrival Arrangements &amp; Cabana Preferences
                  </h3>
                  <p className="text-xs text-[#55635e]">
                    Notify the sanctuary team of your planned check-in time and seating choice.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Estimated Arrival Time
                  </label>
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] cursor-pointer"
                  >
                    <option value="09:30 AM">09:30 AM (Opening Gate)</option>
                    <option value="10:00 AM">10:00 AM (Recommended)</option>
                    <option value="11:30 AM">11:30 AM (Pre-Lunch)</option>
                    <option value="01:00 PM">01:00 PM (Afternoon Pass)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Assigned Cabana / Spot
                  </label>
                  {initialCabana ? (
                    <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#006a66] bg-[#f0faf7]">
                      <span className="px-2 py-0.5 rounded bg-[#003528] text-white text-xs font-mono font-bold">
                        {initialCabana.code}
                      </span>
                      <span className="text-xs font-bold text-[#003528] truncate">
                        {initialCabana.name}
                      </span>
                    </div>
                  ) : (
                    <select
                      value={cabanaLocation}
                      onChange={(e) => setCabanaLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-semibold text-[#003528] focus:outline-none focus:border-[#003528] cursor-pointer"
                    >
                      <option value="Infinity Pool Edge">Infinity Pool Edge (Sun Loungers)</option>
                      <option value="Oceanfront Lawn">Oceanfront Coconut Lawn (Shaded)</option>
                      <option value="Lagoon Pavilion">Lagoon Veranda (Breeze Seating)</option>
                      <option value="Private Cabana">Private Covered Family Cabana</option>
                    </select>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#55635e] mb-1.5">
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Vegetarian buffet options, king coconuts on arrival, birthday celebration..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e2e8e5] text-xs font-medium text-[#003528] focus:outline-none focus:border-[#003528]"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Settlement Choice */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e8e5] shadow-xs">
              <div className="flex items-center gap-3 pb-4 mb-6 border-b border-[#f0f4f2]">
                <div className="w-8 h-8 rounded-full bg-[#003528] text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#003528]">
                    Payment Guarantee Option
                  </h3>
                  <p className="text-xs text-[#55635e]">
                    Choose how you prefer to settle your reservation.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${paymentChoice === 'pay_at_property' ? 'border-[#003528] bg-[#f4f7f6]' : 'border-[#e2e8e5]'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentChoice === 'pay_at_property'}
                    onChange={() => setPaymentChoice('pay_at_property')}
                    className="mt-1 accent-[#003528]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#003528] block">
                      Pay 100% Upon Arrival at Sanctuary Gate (Recommended)
                    </span>
                    <span className="text-[11px] text-[#55635e]">
                      No card required right now. Pay via Cash, LANKAQR, or Credit Card directly at resort reception.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition cursor-pointer ${paymentChoice === 'online' ? 'border-[#003528] bg-[#f4f7f6]' : 'border-[#e2e8e5]'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentChoice === 'online'}
                    onChange={() => setPaymentChoice('online')}
                    className="mt-1 accent-[#003528]"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#003528] block">
                      Pay 20% Advance Online via Secure Gateway
                    </span>
                    <span className="text-[11px] text-[#55635e]">
                      Guarantees poolside cabana reservation with priority early check-in.
                    </span>
                  </div>
                </label>
              </div>

              <div className="mt-4 pt-4 border-t border-[#f0f4f2]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#003528] font-medium">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(e) => setSendWhatsApp(e.target.checked)}
                    className="rounded accent-[#003528]"
                  />
                  <span>Send official SLTDA Digital QR Gate Pass to my WhatsApp (+94 {phone})</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white font-headline text-base font-bold shadow-xl transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Generating Official SLTDA Pass...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>Confirm Reservation &amp; Generate Digital Pass</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Sticky Summary */}
          <div className="sticky top-28 bg-white rounded-3xl border border-[#e2e8e5] shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#f0f4f2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#006a66]">
                Reservation Summary
              </span>
              <span className="font-mono text-xs font-bold text-[#003528] bg-[#f4f7f6] px-2.5 py-1 rounded-md border border-[#e2e8e5]">
                {timerFormatted} Hold
              </span>
            </div>

            {/* Property Snapshot */}
            <div className="flex gap-4">
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-24 h-20 rounded-xl object-cover shrink-0 border border-[#e2e8e5]"
                referrerPolicy="no-referrer"
              />
              <div>
                <h4 className="font-headline text-sm font-bold text-[#003528] leading-snug">
                  {property.name}
                </h4>
                <p className="text-xs text-[#55635e] mt-1">{property.location}</p>
                <span className="text-[11px] font-bold text-[#006a66] block mt-1">
                  {packageName}
                </span>
              </div>
            </div>

            {/* Assigned Private Cabana & Package Details */}
            {initialCabana && (
              <div className="p-3.5 rounded-2xl bg-[#eefaf8] border border-[#b2e4dc] space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-200 border border-teal-200">
                    <img
                      src={initialCabana.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] text-[#006a66] font-bold uppercase tracking-wider">
                        Assigned Spot
                      </span>
                      {initialParams?.selectedTier && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#006a66] text-white">
                          {initialParams.selectedTier.badge || initialParams.selectedTier.name}
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-[#003528] truncate">
                      {initialCabana.code} · {initialCabana.name}
                    </h5>
                    <span className="text-[10px] text-[#55635e] block truncate">
                      {initialCabana.capacity} • {initialCabana.viewType}
                    </span>
                  </div>
                </div>

                {/* Specific Cabana Package Inclusions */}
                <div className="pt-2 border-t border-[#b2e4dc]/60 space-y-1.5 text-[11px] text-[#003528]">
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#006a66] shrink-0 mt-0.5">restaurant</span>
                    <span>
                      <strong className="text-[#004d3b]">Dining: </strong>
                      {initialParams?.selectedTier?.diningPlan || initialCabana.packageDetails.diningPlan}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#006a66] shrink-0 mt-0.5">local_bar</span>
                    <span>
                      <strong className="text-[#004d3b]">Welcome: </strong>
                      {initialCabana.packageDetails.welcomeRefreshment}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-xs text-[#006a66] shrink-0 mt-0.5">wine_bar</span>
                    <span>
                      <strong className="text-[#004d3b]">Corkage: </strong>
                      {initialCabana.packageDetails.corkagePolicy}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Inclusions summary */}
            <div className="p-3.5 rounded-xl bg-[#f4f7f6] text-xs space-y-2 border border-[#e2e8e5]">
              <div className="flex justify-between">
                <span className="text-[#55635e]">Date:</span>
                <span className="font-bold text-[#003528] font-mono">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55635e]">Time Slot:</span>
                <span className="font-bold text-[#003528]">{slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#55635e]">Guests:</span>
                <span className="font-bold text-[#003528]">{adults} Adults {children > 0 ? `, ${children} Children` : ''}</span>
              </div>
            </div>

            {/* Transparent Price Breakdown */}
            <div className="pt-2 border-t border-[#f0f4f2] space-y-2 text-xs">
              <div className="flex justify-between text-[#55635e]">
                <span>Base Sanctuary Pass ({adults} guests):</span>
                <span className="font-mono">{formatPrice(property.priceLkr * adults)}</span>
              </div>

              {initialCabana && initialCabana.priceDeltaLkr > 0 && (
                <div className="flex justify-between text-[#55635e]">
                  <span>VIP Cabana Upgrade ({initialCabana.code}):</span>
                  <span className="font-mono text-[#003528] font-bold">+ {formatPrice(initialCabana.priceDeltaLkr)}</span>
                </div>
              )}

              {initialParams?.selectedTier && initialParams.selectedTier.priceDeltaLkr > 0 && (
                <div className="flex justify-between text-[#55635e]">
                  <span>Package Tier Upgrade ({initialParams.selectedTier.name}):</span>
                  <span className="font-mono text-[#003528] font-bold">+ {formatPrice(initialParams.selectedTier.priceDeltaLkr * adults)}</span>
                </div>
              )}

              {initialParams?.addOns?.byob && (
                <div className="flex justify-between text-[#55635e]">
                  <span>BYOB Service &amp; Chiller Bucket:</span>
                  <span className="font-mono">{formatPrice(1500)}</span>
                </div>
              )}

              {initialParams?.addOns?.jetski && (
                <div className="flex justify-between text-[#55635e]">
                  <span>Jet Ski Water Sports:</span>
                  <span className="font-mono">{formatPrice(8500)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#55635e]">
                <span>SLTDA Tourism Regulatory Surcharge:</span>
                <span className="font-mono text-emerald-700">Included (0%)</span>
              </div>

              <div className="pt-3 flex justify-between items-baseline font-bold text-base text-[#003528] border-t border-[#f0f4f2]">
                <span>Total Amount:</span>
                <span className="font-headline text-2xl font-black tabular-nums">
                  {formatPrice(totalLkr)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#eaf4f3] border border-[#d2e4e1] text-[11px] text-[#003528] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#006a66]">verified</span>
              <span>100% Guaranteed Entry with official SLTDA digital pass voucher</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
