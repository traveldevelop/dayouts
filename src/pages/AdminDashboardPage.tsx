import React, { useState } from 'react';
import { SanctuaryProperty, BookingState, Currency, PageType, CabanaUnit } from '../types';
import { USD_EXCHANGE_RATE, SRI_LANKAN_DISTRICTS } from '../data/mockData';
import { getCabanaSpecifications } from '../data/cabanasData';

interface AdminDashboardPageProps {
  properties: SanctuaryProperty[];
  bookings: BookingState[];
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onNavigate: (page: PageType) => void;
  onSelectProperty: (property: SanctuaryProperty) => void;
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onSaveProperty: (property: SanctuaryProperty) => void;
  onDeleteProperty: (propertyId: string) => void;
  onOpenAiCreator: () => void;
  onViewVoucher: (booking: BookingState) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  properties,
  bookings,
  currency,
  onCurrencyChange,
  onNavigate,
  onSelectProperty,
  onApproveBooking,
  onRejectBooking,
  onSaveProperty,
  onDeleteProperty,
  onOpenAiCreator,
  onViewVoucher
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'bookings' | 'calendar' | 'payouts' | 'governance'>('listings');
  const [adminRole, setAdminRole] = useState<'master_admin' | 'property_owner'>('property_owner');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Manual Add/Edit Property Modal State
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Property Form Fields
  const [propName, setPropName] = useState('');
  const [propTagline, setPropTagline] = useState('');
  const [propCategory, setPropCategory] = useState<'hotel' | 'cabana' | 'villa' | 'glamping' | 'cottages'>('hotel');
  const [propLocation, setPropLocation] = useState('');
  const [propDistrict, setPropDistrict] = useState('Negombo');
  const [propProvince, setPropProvince] = useState('Western Province');
  const [propDayOutPrice, setPropDayOutPrice] = useState<number>(3990);
  const [propNightStayPrice, setPropNightStayPrice] = useState<number>(3000);
  const [propDayOutSlot, setPropDayOutSlot] = useState('09:00 AM – 04:00 PM');
  const [propNightStaySlot, setPropNightStaySlot] = useState('02:00 PM – 12:00 PM (Next Day)');
  const [propPhone, setPropPhone] = useState('0771583494');
  const [propWhatsapp, setPropWhatsapp] = useState('+94771583494');
  const [propImageUrl, setPropImageUrl] = useState('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80');
  const [propDescription, setPropDescription] = useState('');
  const [propInclusions, setPropInclusions] = useState<string[]>([
    'Comfortable Bedroom',
    'Welcome Drink',
    'Complimentary Lunch',
    'Attached Bathrooms',
    'Free Parking'
  ]);
  const [propNewInclusionInput, setPropNewInclusionInput] = useState('');

  // Sub-Units / Room Types Manager Modal State
  const [managingSubUnitsProp, setManagingSubUnitsProp] = useState<SanctuaryProperty | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomCode, setNewRoomCode] = useState('RM-01');
  const [newRoomDayOutPrice, setNewRoomDayOutPrice] = useState<number>(3990);
  const [newRoomNightPrice, setNewRoomNightPrice] = useState<number>(3000);
  const [newRoomAc, setNewRoomAc] = useState<boolean>(false);
  const [newRoomCapacity, setNewRoomCapacity] = useState('Up to 2 Adults (Couple)');

  // Blackout days & Day pass capacity state
  const [dayPassCap, setDayPassCap] = useState<number>(30);
  const [blockedDays, setBlockedDays] = useState<number[]>([22, 28]);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const formatPrice = (lkr: number) => {
    if (currency === 'USD') {
      return `$${(lkr / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkr.toLocaleString()}`;
  };

  // Open Property Form in Create Mode
  const handleOpenCreateProperty = () => {
    setEditingPropertyId(null);
    setPropName('');
    setPropTagline('');
    setPropCategory('hotel');
    setPropLocation('');
    setPropDistrict('Negombo');
    setPropProvince('Western Province');
    setPropDayOutPrice(3990);
    setPropNightStayPrice(3000);
    setPropDayOutSlot('09:00 AM – 04:00 PM');
    setPropNightStaySlot('02:00 PM – 12:00 PM (Next Day)');
    setPropPhone('0771583494');
    setPropWhatsapp('+94771583494');
    setPropImageUrl('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80');
    setPropDescription('');
    setPropInclusions(['Comfortable Bedroom', 'Welcome Drink', 'Complimentary Lunch', 'Attached Bathrooms', 'Free Parking']);
    setIsPropertyModalOpen(true);
  };

  // Open Property Form in Edit Mode
  const handleOpenEditProperty = (prop: SanctuaryProperty) => {
    setEditingPropertyId(prop.id);
    setPropName(prop.name);
    setPropTagline(prop.tagline);
    setPropCategory((prop.category as any) || 'hotel');
    setPropLocation(prop.location);
    setPropDistrict(prop.district);
    setPropProvince(prop.province);
    setPropDayOutPrice(prop.priceLkr);
    setPropNightStayPrice(prop.pricePerStayLkr || 3000);
    setPropDayOutSlot(prop.timeSlot);
    setPropNightStaySlot(prop.nightStaySlot || '02:00 PM – 12:00 PM (Next Day)');
    setPropPhone(prop.phone || '');
    setPropWhatsapp(prop.whatsapp || '');
    setPropImageUrl(prop.imageUrl);
    setPropDescription(prop.description || '');
    setPropInclusions(prop.inclusions || []);
    setIsPropertyModalOpen(true);
  };

  // Save or Update Property
  const handleSavePropertyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propName.trim() || !propLocation.trim()) {
      alert('Please provide Property Name and Location.');
      return;
    }

    const propId = editingPropertyId || `prop-${propName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const existing = properties.find((p) => p.id === propId);

    const updatedProperty: SanctuaryProperty = {
      id: propId,
      name: propName.trim(),
      tagline: propTagline.trim() || 'Verified hospitality sanctuary & escape',
      location: propLocation.trim(),
      district: propDistrict,
      province: propProvince,
      category: propCategory,
      priceLkr: Number(propDayOutPrice) || 3990,
      pricePerStayLkr: Number(propNightStayPrice) || 3000,
      timeSlot: propDayOutSlot,
      nightStaySlot: propNightStaySlot,
      phone: propPhone,
      whatsapp: propWhatsapp,
      imageUrl: propImageUrl,
      rating: existing?.rating || 4.9,
      reviewCount: existing?.reviewCount || 1,
      passType: 'dual',
      passTypeLabel: 'Day Out Pass & Night Stay',
      verificationBadge: existing?.verificationBadge || 'SLTDA Verified Listing',
      slotsLeft: 6,
      inclusions: propInclusions,
      features: existing?.features || [
        'Beach Road Location',
        'A/C & Non A/C Rooms Available',
        'Attached Bathrooms',
        'Free Secure Parking'
      ],
      description: propDescription || `Welcome to ${propName}. Offers both Couple Day Out passes and Night Stay packages.`,
      subUnits: existing?.subUnits || undefined
    };

    onSaveProperty(updatedProperty);
    setIsPropertyModalOpen(false);
    showToast(editingPropertyId ? `Property "${propName}" successfully updated!` : `New property "${propName}" added!`);
  };

  // Add Inclusion Tag
  const handleAddInclusion = () => {
    if (propNewInclusionInput.trim() && !propInclusions.includes(propNewInclusionInput.trim())) {
      setPropInclusions((prev) => [...prev, propNewInclusionInput.trim()]);
      setPropNewInclusionInput('');
    }
  };

  const handleRemoveInclusion = (inc: string) => {
    setPropInclusions((prev) => prev.filter((i) => i !== inc));
  };

  // Sub-Units (Rooms) Addition
  const handleAddRoomSubUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingSubUnitsProp || !newRoomName.trim()) return;

    const roomId = `${managingSubUnitsProp.id}-rm-${Date.now().toString().slice(-4)}`;
    const newUnit: CabanaUnit = {
      id: roomId,
      code: newRoomCode.trim() || 'RM-01',
      name: newRoomName.trim(),
      type: newRoomAc ? 'vip' : 'oceanfront',
      typeLabel: newRoomAc ? 'A/C Room' : 'Non-A/C Room',
      tagline: `${newRoomName} with attached bathroom`,
      capacity: newRoomCapacity,
      maxAdults: 2,
      maxKids: 1,
      priceDeltaLkr: Math.max(0, newRoomDayOutPrice - managingSubUnitsProp.priceLkr),
      coverImage: managingSubUnitsProp.imageUrl,
      images: [managingSubUnitsProp.imageUrl],
      features: [
        newRoomAc ? 'Air Conditioned' : 'Ceiling Fan Cooling',
        'Attached Private Bathroom with Shower',
        'Complimentary Lunch & Welcome Drink',
        'Free Parking'
      ],
      viewType: 'Garden & Coastal Breeze',
      privacyLevel: 'High',
      status: 'AVAILABLE',
      slotsRemaining: 4,
      description: `${newRoomName} available for Day Out (${managingSubUnitsProp.timeSlot}) and Night Stay (${managingSubUnitsProp.nightStaySlot || '2PM - 12PM'}).`,
      packageDetails: {
        tierName: `${newRoomName} Package`,
        diningPlan: 'Complimentary Lunch + Welcome Drink',
        welcomeRefreshment: 'Fresh Welcome Drink on arrival',
        swimmingAccess: 'Lounge and beach access',
        towelPolicy: 'Room towels provided',
        corkagePolicy: 'BYOB Permitted (Corkage Free)',
        changingRoom: 'Private attached bedroom suite',
        schedule: managingSubUnitsProp.timeSlot,
        exclusivePerks: ['Private bedroom for relaxation', 'Attached bathroom', 'Free parking'],
        packageTiers: [
          {
            id: `${roomId}-dayout`,
            name: 'Couple Day Out Pass',
            priceDeltaLkr: 0,
            timing: managingSubUnitsProp.timeSlot,
            diningPlan: 'Complimentary Lunch included',
            highlights: ['Comfortable Bedroom', 'Welcome Drink', 'Lunch']
          },
          {
            id: `${roomId}-night`,
            name: 'Night Stay Room Only',
            priceDeltaLkr: Math.max(0, newRoomNightPrice - newRoomDayOutPrice),
            timing: managingSubUnitsProp.nightStaySlot || '02:00 PM – 12:00 PM',
            diningPlan: 'Room Only (Meals on order)',
            highlights: ['Overnight Bedroom', 'Checkout 12 PM']
          }
        ]
      }
    };

    newUnit.specifications = getCabanaSpecifications(newUnit);

    const existingSubUnits = managingSubUnitsProp.subUnits || [];
    const updatedProp: SanctuaryProperty = {
      ...managingSubUnitsProp,
      subUnits: [...existingSubUnits, newUnit]
    };

    onSaveProperty(updatedProp);
    setManagingSubUnitsProp(updatedProp);
    setNewRoomName('');
    setNewRoomCode(`RM-0${(existingSubUnits.length + 2)}`);
    showToast(`Room "${newRoomName}" added to ${managingSubUnitsProp.name}!`);
  };

  const handleDeleteRoomSubUnit = (unitId: string) => {
    if (!managingSubUnitsProp) return;
    const updatedProp: SanctuaryProperty = {
      ...managingSubUnitsProp,
      subUnits: (managingSubUnitsProp.subUnits || []).filter((u) => u.id !== unitId)
    };
    onSaveProperty(updatedProp);
    setManagingSubUnitsProp(updatedProp);
    showToast('Room removed.');
  };

  const filteredProperties = properties.filter((p) => {
    if (selectedDistrict !== 'all' && p.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalGrossLkr = bookings
    .filter((b) => b.status === 'CONFIRMED' || b.status === 'CHECKED_IN')
    .reduce((acc, b) => acc + (b.totalLkr || 0), 0);

  return (
    <div className="bg-[#fbfcfc] text-[#121d1e] min-h-screen pb-24">
      {/* Top Banner Navigation */}
      <div className="bg-[#00281e] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold tracking-wider uppercase">DAYOUTS.LK ADMIN &amp; OWNER DASHBOARD</span>
              <span className="px-2 py-0.5 rounded bg-white/15 text-[10px] font-mono">/admin-dashboard</span>
            </div>
            <h1 className="font-headline text-xl sm:text-2xl font-black tracking-tight">
              Central Property Data &amp; Reservations Control Panel
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-black/40 rounded-xl p-0.5 border border-white/15 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAdminRole('property_owner')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  adminRole === 'property_owner'
                    ? 'bg-emerald-500 text-[#002118]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Owner Mode
              </button>
              <button
                type="button"
                onClick={() => setAdminRole('master_admin')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  adminRole === 'master_admin'
                    ? 'bg-emerald-500 text-[#002118]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Super Admin
              </button>
            </div>

            {/* Currency */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15 text-xs font-mono">
              <button
                onClick={() => onCurrencyChange('LKR')}
                className={`px-2.5 py-1 rounded-lg ${currency === 'LKR' ? 'bg-white text-[#003528] font-bold' : 'text-white/70'}`}
              >
                LKR
              </button>
              <button
                onClick={() => onCurrencyChange('USD')}
                className={`px-2.5 py-1 rounded-lg ${currency === 'USD' ? 'bg-white text-[#003528] font-bold' : 'text-white/70'}`}
              >
                USD
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={onOpenAiCreator}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-[#002118] text-xs font-black shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>✨ AI Add Listing</span>
            </button>

            <button
              onClick={handleOpenCreateProperty}
              className="px-3.5 py-2 rounded-xl bg-white text-[#003528] hover:bg-slate-100 text-xs font-bold shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>➕ Add Property</span>
            </button>

            <button
              onClick={() => onNavigate('explore-stays')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              title="Return to Public Customer Marketplace"
            >
              <span className="material-symbols-outlined text-base">storefront</span>
              <span className="hidden sm:inline">Public Site</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-white/10">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'listings'
                ? 'border-emerald-400 text-emerald-300 font-extrabold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">apartment</span>
            <span>Properties &amp; Room Packages ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-emerald-400 text-emerald-300 font-extrabold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">book_online</span>
            <span>Reservations &amp; Check-ins ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-emerald-400 text-emerald-300 font-extrabold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Slot Inventory &amp; Blackouts</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'payouts'
                ? 'border-emerald-400 text-emerald-300 font-extrabold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            <span>Revenue &amp; Bank Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
              activeTab === 'governance'
                ? 'border-emerald-400 text-emerald-300 font-extrabold'
                : 'border-transparent text-white/70 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-base">verified</span>
            <span>SLTDA Compliance &amp; Governance</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Listed Properties
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {properties.length} Active
            </div>
            <span className="text-xs text-[#006a66] font-medium mt-1 block">
              Across Sri Lanka Tourism Districts
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Active Bookings
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {bookings.length} Guests
            </div>
            <span className="text-xs text-amber-600 font-medium mt-1 block">
              {bookings.filter((b) => b.status === 'AWAITING_OWNER_APPROVAL').length} Awaiting Approval
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Gross Revenue
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {formatPrice(totalGrossLkr || 145000)}
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-1 block">
              Central Bank Escrow Protected
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8e5] shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#55635e]">
              Active Day Pass Cap
            </span>
            <div className="font-headline text-3xl font-extrabold text-[#003528] mt-1 tabular-nums">
              {dayPassCap} Slots/day
            </div>
            <span className="text-xs text-[#55635e] font-medium mt-1 block">
              {blockedDays.length} Blackout dates scheduled
            </span>
          </div>
        </div>

        {/* TAB 1: PROPERTIES & LISTINGS MANAGER */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            {/* Header Controls: Search, Filter, Add Buttons */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#e2e8e5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Search by hotel name, town, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#ccd5d1] text-xs outline-none focus:border-[#003528]"
                  />
                </div>

                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-[#ccd5d1] text-xs font-semibold text-[#003528] bg-white cursor-pointer"
                >
                  <option value="all">All Districts ({properties.length})</option>
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>{d.name} ({d.sinhala})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onOpenAiCreator}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>AI Import from WhatsApp/Facebook</span>
                </button>

                <button
                  onClick={handleOpenCreateProperty}
                  className="px-4 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  <span>Add Property Manually</span>
                </button>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-3xl border border-[#e2e8e5] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f4f7f6] border-b border-[#e2e8e5] text-[#003528]">
                      <th className="p-4 font-bold uppercase text-[11px]">Property Title &amp; Location</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Category</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Couple Day Out Rate</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Night Stay Rate</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Sub-Units / Rooms</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Contacts</th>
                      <th className="p-4 font-bold uppercase text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f2]">
                    {filteredProperties.map((prop) => {
                      const roomCount = prop.subUnits?.length || 0;

                      return (
                        <tr key={prop.id} className="hover:bg-[#fbfcfc] transition">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prop.imageUrl}
                                alt={prop.name}
                                className="w-14 h-12 rounded-xl object-cover shrink-0 border border-[#e2e8e5]"
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-sm text-[#003528] truncate max-w-[200px]">
                                  {prop.name}
                                </h4>
                                <p className="text-[#55635e] text-[11px] truncate max-w-[200px]">
                                  {prop.location} · {prop.district}
                                </p>
                                <span className="inline-block mt-0.5 px-2 py-0.2 rounded bg-emerald-50 text-[#006a66] text-[10px] font-bold">
                                  {prop.verificationBadge}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            <span className="capitalize px-2.5 py-1 rounded-lg bg-[#f4f7f6] text-[#003528] font-bold text-[11px]">
                              {prop.category || 'Hotel'}
                            </span>
                          </td>

                          <td className="p-4 font-mono font-bold text-[#003528]">
                            <div>{formatPrice(prop.priceLkr)}</div>
                            <span className="text-[10px] text-[#55635e] font-normal">{prop.timeSlot}</span>
                          </td>

                          <td className="p-4 font-mono font-bold text-[#003528]">
                            <div>{formatPrice(prop.pricePerStayLkr || 3000)}</div>
                            <span className="text-[10px] text-[#55635e] font-normal">{prop.nightStaySlot || '2PM - 12PM'}</span>
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => setManagingSubUnitsProp(prop)}
                              className="px-2.5 py-1.5 rounded-xl border border-[#b2e4dc] bg-[#eefaf8] hover:bg-[#d8ece9] text-[#006a66] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">meeting_room</span>
                              <span>{roomCount} Rooms/Cabanas</span>
                            </button>
                          </td>

                          <td className="p-4 text-[11px]">
                            {prop.phone && <div>📞 {prop.phone}</div>}
                            {prop.whatsapp && <div className="text-emerald-700 font-bold">📲 {prop.whatsapp}</div>}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  onSelectProperty(prop);
                                  onNavigate('property-detail');
                                }}
                                className="p-2 rounded-lg border border-[#ccd5d1] text-[#003528] hover:bg-[#f4f7f6] transition cursor-pointer"
                                title="View Live Listing on Marketplace"
                              >
                                <span className="material-symbols-outlined text-base">visibility</span>
                              </button>

                              <button
                                onClick={() => handleOpenEditProperty(prop)}
                                className="p-2 rounded-lg border border-[#ccd5d1] text-[#003528] hover:bg-[#f4f7f6] transition cursor-pointer"
                                title="Edit Property Details"
                              >
                                <span className="material-symbols-outlined text-base">edit</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${prop.name}"?`)) {
                                    onDeleteProperty(prop.id);
                                    showToast(`Property "${prop.name}" deleted.`);
                                  }
                                }}
                                className="p-2 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Delete Property Listing"
                              >
                                <span className="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS & GATE PASS CHECK-IN */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#e2e8e5] overflow-hidden shadow-xs">
              <div className="p-5 border-b border-[#f0f4f2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-headline text-lg font-bold text-[#003528]">
                    Live Guest Reservations &amp; QR Gate Verification
                  </h3>
                  <p className="text-xs text-[#55635e]">
                    Approve or decline customer bookings and verify digital QR gate passes on arrival.
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {bookings.length} Total Bookings
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f4f7f6] border-b border-[#e2e8e5] text-[#003528]">
                      <th className="p-4 font-bold uppercase text-[11px]">Pass ID / Lead Guest</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Property &amp; Spot</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Date &amp; Slot</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Party Size</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Total Rate</th>
                      <th className="p-4 font-bold uppercase text-[11px]">Status</th>
                      <th className="p-4 font-bold uppercase text-[11px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f4f2]">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#fbfcfc] transition">
                        <td className="p-4">
                          <span className="font-mono font-bold text-[#006a66] block">#{b.id}</span>
                          <span className="font-bold text-[#003528] block">
                            {b.guestInfo.firstName} {b.guestInfo.lastName}
                          </span>
                          <span className="text-[11px] text-[#55635e] font-mono">
                            +94 {b.guestInfo.phone}
                          </span>
                        </td>

                        <td className="p-4">
                          <strong className="text-[#003528] block">{b.propertyName}</strong>
                          <span className="text-[11px] text-[#55635e] block truncate max-w-[150px]">
                            {b.selectedCabana?.name || b.guestInfo.cabanaLocation || 'General Pass'}
                          </span>
                        </td>

                        <td className="p-4 font-mono">
                          <div>{b.selectedDate}</div>
                          <span className="text-[10px] text-[#55635e]">{b.selectedSlot}</span>
                        </td>

                        <td className="p-4 font-medium text-[#003528]">
                          {b.adults} Adults {b.children > 0 ? `+ ${b.children} Kids` : ''}
                        </td>

                        <td className="p-4 font-mono font-bold text-[#003528]">
                          {formatPrice(b.totalLkr)}
                          <span className="text-[10px] text-[#55635e] block font-normal capitalize">
                            {b.guestInfo.paymentChoice === 'pay_at_property' ? 'Pay at Hotel' : 'Online Paid'}
                          </span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase inline-block ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : b.status === 'CHECKED_IN'
                                ? 'bg-teal-100 text-teal-800'
                                : b.status === 'AWAITING_OWNER_APPROVAL'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onViewVoucher(b)}
                              className="px-2.5 py-1 rounded-lg border border-[#ccd5d1] text-[#003528] hover:bg-[#f4f7f6] text-xs font-bold transition cursor-pointer"
                              title="View SLTDA Digital Gate Pass"
                            >
                              Pass QR
                            </button>

                            {b.status === 'AWAITING_OWNER_APPROVAL' && (
                              <>
                                <button
                                  onClick={() => onApproveBooking(b.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => onRejectBooking(b.id)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CALENDAR & BLACKOUT MANAGER */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e5] shadow-xs space-y-6">
            <div>
              <h3 className="font-headline text-xl font-bold text-[#003528]">
                Daily Pass Capacity &amp; Blackout Dates Manager
              </h3>
              <p className="text-xs text-[#55635e] mt-1">
                Limit maximum daily day-pass arrivals to prevent overcrowding and maintain 5-star hospitality.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <strong className="text-sm font-bold text-[#003528] block">Daily Day Pass Capacity Cap</strong>
                <span className="text-xs text-[#55635e]">Total dayout guests allowed per day across all pools &amp; cabanas</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={dayPassCap}
                  onChange={(e) => setDayPassCap(Number(e.target.value))}
                  className="w-24 p-2 rounded-xl border border-[#ccd5d1] font-mono font-bold text-[#003528] text-center"
                />
                <button
                  type="button"
                  onClick={() => showToast(`Daily day pass capacity updated to ${dayPassCap} slots.`)}
                  className="px-4 py-2 rounded-xl bg-[#003528] text-white font-bold text-xs"
                >
                  Save Cap
                </button>
              </div>
            </div>

            {/* Interactive Blackout Calendar */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#55635e] block mb-3">
                Click a Date to Block / Unblock for Private Buyouts &amp; Maintenance:
              </span>
              <div className="grid grid-cols-7 gap-2 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="font-bold text-[#55635e] py-1">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
                  const isBlocked = blockedDays.includes(dayNum);
                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        setBlockedDays((prev) =>
                          prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
                        );
                        showToast(`Day ${dayNum} availability updated.`);
                      }}
                      className={`p-3 rounded-xl border transition font-mono font-bold cursor-pointer ${
                        isBlocked
                          ? 'bg-rose-100 border-rose-300 text-rose-800'
                          : 'bg-white border-[#e2e8e5] hover:border-[#003528] text-[#003528]'
                      }`}
                    >
                      {dayNum}
                      <span className="block text-[9px] font-normal uppercase">
                        {isBlocked ? 'Blocked' : 'Available'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVENUE & BANK PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e5] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-headline text-xl font-bold text-[#003528]">
                  Revenue Settlement &amp; Bank CEFT Payouts
                </h3>
                <p className="text-xs text-[#55635e] mt-1">
                  All guest payments are held in verified SLTDA escrow until check-in. Net payout transferred directly via CEFT.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPayoutModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-[#006a66] hover:bg-[#00524f] text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                <span>Request Instant Bank Payout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5]">
                <span className="text-[11px] font-bold text-[#55635e] uppercase">Total Settled Balance</span>
                <div className="font-headline text-2xl font-black text-[#003528] mt-1">
                  {formatPrice(totalGrossLkr || 145000)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5]">
                <span className="text-[11px] font-bold text-[#55635e] uppercase">Platform Commission (0%)</span>
                <div className="font-headline text-2xl font-black text-emerald-700 mt-1">
                  {formatPrice(0)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#eefaf8] border border-[#b2e4dc]">
                <span className="text-[11px] font-bold text-[#006a66] uppercase">Net Available for Withdrawal</span>
                <div className="font-headline text-2xl font-black text-[#006a66] mt-1">
                  {formatPrice(totalGrossLkr || 145000)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SLTDA GOVERNANCE & AUDIT LOGS */}
        {activeTab === 'governance' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e2e8e5] shadow-xs space-y-6">
            <div>
              <h3 className="font-headline text-xl font-bold text-[#003528]">
                SLTDA Statutory Registry &amp; Hygiene Standards
              </h3>
              <p className="text-xs text-[#55635e] mt-1">
                Ensures all listed properties hold valid Sri Lanka Tourism Development Authority licenses and clean pool water records.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#eaf4f3] border border-[#d2e4e1] flex items-center gap-3">
              <span className="material-symbols-outlined text-emerald-700 text-2xl">verified</span>
              <div>
                <strong className="text-xs text-[#003528] block">Statutory Escrow Guarantee: Active</strong>
                <p className="text-[11px] text-[#55635e]">
                  Every booking generates a cryptographically signed QR pass ensuring 100% money-back escrow protection for travelers.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: MANUAL PROPERTY CREATION & EDIT FORM */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#e2e8e5]">
            <div className="bg-[#003528] text-white p-5 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="font-headline text-lg font-bold">
                  {editingPropertyId ? 'Edit Property Details' : 'Add New Property Listing Manually'}
                </h3>
                <p className="text-xs text-white/80">
                  Fill in property details, Day Out &amp; Night Stay pricing, and contact numbers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPropertyModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePropertyForm} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#003528] block mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pavana Beach Hotel - Negombo"
                    value={propName}
                    onChange={(e) => setPropName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-bold text-sm text-[#003528]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">Category</label>
                  <select
                    value={propCategory}
                    onChange={(e: any) => setPropCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none"
                  >
                    <option value="hotel">Hotel / Beach Resort</option>
                    <option value="cabana">Cabana / Pool Pavilion</option>
                    <option value="villa">Private Luxury Villa</option>
                    <option value="glamping">Glamping & Nature Sanctuary</option>
                    <option value="cottages">Cottages / Chalets</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">District</label>
                  <select
                    value={propDistrict}
                    onChange={(e) => setPropDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none"
                  >
                    {SRI_LANKAN_DISTRICTS.map((d) => (
                      <option key={d.name} value={d.name}>{d.name} ({d.sinhala})</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#003528] block mb-1">Address &amp; Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Beach Road, Negombo"
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">Phone Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. 0771583494"
                    value={propPhone}
                    onChange={(e) => setPropPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +94771583494"
                    value={propWhatsapp}
                    onChange={(e) => setPropWhatsapp(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono text-emerald-800"
                  />
                </div>

                {/* Pricing & Time Slots */}
                <div>
                  <label className="font-bold text-[#003528] block mb-1">Couple Day Out Base Price (LKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={propDayOutPrice}
                    onChange={(e) => setPropDayOutPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">Day Out Time Slot</label>
                  <input
                    type="text"
                    value={propDayOutSlot}
                    onChange={(e) => setPropDayOutSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">Night Stay Base Price (LKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={propNightStayPrice}
                    onChange={(e) => setPropNightStayPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#003528] block mb-1">Night Stay Time Slot</label>
                  <input
                    type="text"
                    value={propNightStaySlot}
                    onChange={(e) => setPropNightStaySlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#003528] block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={propImageUrl}
                    onChange={(e) => setPropImageUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none font-mono text-[11px]"
                  />
                </div>

                {/* Inclusions Tags */}
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#003528] block mb-1">Inclusions &amp; Facilities</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {propInclusions.map((inc) => (
                      <span key={inc} className="px-2.5 py-1 rounded-lg bg-[#eaf4f3] text-[#003528] font-semibold text-[11px] flex items-center gap-1">
                        <span>{inc}</span>
                        <button type="button" onClick={() => handleRemoveInclusion(inc)} className="text-slate-400 hover:text-rose-600">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add an inclusion (e.g. Attached Bathroom, Free Parking)..."
                      value={propNewInclusionInput}
                      onChange={(e) => setPropNewInclusionInput(e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-[#ccd5d1] text-xs"
                    />
                    <button type="button" onClick={handleAddInclusion} className="px-3 py-2 rounded-xl bg-[#006a66] text-white font-bold text-xs">
                      Add
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#003528] block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={propDescription}
                    onChange={(e) => setPropDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#ccd5d1] outline-none"
                    placeholder="Short marketing description of the property..."
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e2e8e5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#ccd5d1] text-xs font-bold text-[#55635e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white font-bold text-xs shadow-sm"
                >
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUB-UNITS & ROOM TYPES MANAGER */}
      {managingSubUnitsProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-[#e2e8e5]">
            <div className="bg-[#003528] text-white p-5 shrink-0 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-emerald-300 font-bold block">
                  ROOM &amp; SUB-CABANA MANAGER
                </span>
                <h3 className="font-headline text-lg font-bold">
                  {managingSubUnitsProp.name} ({managingSubUnitsProp.subUnits?.length || 0} Units)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setManagingSubUnitsProp(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
              {/* Existing Rooms List */}
              <div>
                <h4 className="font-bold text-[#003528] mb-2 uppercase text-[11px] tracking-wider">
                  Configured Room Units &amp; Package Rates:
                </h4>
                <div className="space-y-2.5">
                  {(managingSubUnitsProp.subUnits || []).map((u) => (
                    <div key={u.id} className="p-3.5 rounded-2xl border border-[#e2e8e5] bg-[#fafbfb] flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#003528] text-white font-mono font-bold text-[9px]">
                            {u.code}
                          </span>
                          <strong className="text-sm text-[#003528]">{u.name}</strong>
                          <span className="px-2 py-0.2 rounded bg-emerald-50 text-[#006a66] text-[10px] font-bold">
                            {u.typeLabel}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#55635e]">
                          {u.capacity} • {u.packageDetails?.diningPlan || 'Meals included'}
                        </div>
                        <div className="text-[11px] font-mono text-[#003528] mt-1">
                          Base Day Out: <strong>{formatPrice(managingSubUnitsProp.priceLkr + u.priceDeltaLkr)}</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteRoomSubUnit(u.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition"
                        title="Remove Room Unit"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  ))}

                  {(!managingSubUnitsProp.subUnits || managingSubUnitsProp.subUnits.length === 0) && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                      No custom room units added yet. Add units below like Standard Non-A/C, Standard A/C, Apartment.
                    </div>
                  )}
                </div>
              </div>

              {/* Add New Room Form */}
              <form onSubmit={handleAddRoomSubUnit} className="p-4 rounded-2xl bg-[#f0faf7] border border-[#b2e4dc] space-y-3">
                <span className="font-bold text-[#004d3b] text-xs uppercase tracking-wider block">
                  ➕ Add New Room / Cabana Unit to this Property
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#003528] block mb-1">Room Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RM-01 or CAB-01"
                      value={newRoomCode}
                      onChange={(e) => setNewRoomCode(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ccd5d1] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003528] block mb-1">Room / Package Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Standard Room with A/C"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ccd5d1] bg-white font-bold text-[#003528]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003528] block mb-1">Day Out Price (LKR)</label>
                    <input
                      type="number"
                      required
                      value={newRoomDayOutPrice}
                      onChange={(e) => setNewRoomDayOutPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#ccd5d1] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003528] block mb-1">Night Stay Price (LKR)</label>
                    <input
                      type="number"
                      required
                      value={newRoomNightPrice}
                      onChange={(e) => setNewRoomNightPrice(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-[#ccd5d1] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#003528] block mb-1">Capacity</label>
                    <input
                      type="text"
                      value={newRoomCapacity}
                      onChange={(e) => setNewRoomCapacity(e.target.value)}
                      className="w-full p-2 rounded-lg border border-[#ccd5d1] bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="acCheck"
                      checked={newRoomAc}
                      onChange={(e) => setNewRoomAc(e.target.checked)}
                      className="rounded accent-[#003528]"
                    />
                    <label htmlFor="acCheck" className="font-bold text-[#003528] cursor-pointer">
                      Air Conditioned Room (A/C)
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#003528] text-white font-bold text-xs"
                  >
                    Add Room Unit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e2e8e5] space-y-4 text-xs">
            <h3 className="font-headline text-lg font-bold text-[#003528]">
              Request CEFT Bank Payout
            </h3>
            <p className="text-[#55635e]">
              Enter beneficiary bank details for instant electronic transfer.
            </p>
            <div className="space-y-3">
              <div>
                <label className="font-bold text-[#003528] block mb-1">Bank Name</label>
                <select className="w-full p-2 rounded-xl border border-[#ccd5d1]">
                  <option>Commercial Bank of Ceylon</option>
                  <option>Sampath Bank</option>
                  <option>Hatton National Bank</option>
                  <option>Bank of Ceylon</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-[#003528] block mb-1">Account Number</label>
                <input type="text" placeholder="e.g. 8001928401" className="w-full p-2 rounded-xl border border-[#ccd5d1] font-mono" />
              </div>
              <div>
                <label className="font-bold text-[#003528] block mb-1">Beneficiary Name</label>
                <input type="text" placeholder="e.g. Pavana Beach Hotel PVT LTD" className="w-full p-2 rounded-xl border border-[#ccd5d1]" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-3">
              <button onClick={() => setPayoutModalOpen(false)} className="flex-1 py-2 rounded-xl border border-[#ccd5d1] font-bold text-[#55635e]">
                Cancel
              </button>
              <button
                onClick={() => {
                  setPayoutModalOpen(false);
                  showToast('Payout request for LKR 145,000 submitted. Funds will reflect within 2 hours.');
                }}
                className="flex-1 py-2 rounded-xl bg-[#006a66] text-white font-bold"
              >
                Submit CEFT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#003528] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-5 text-xs font-semibold">
          <span className="material-symbols-outlined text-teal-300 text-lg">check_circle</span>
          <span>{toastMsg}</span>
        </aside>
      )}
    </div>
  );
};
