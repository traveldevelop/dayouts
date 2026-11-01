import React, { useState } from 'react';
import { Currency, PageType } from '../types';
import { USD_EXCHANGE_RATE } from '../data/mockData';

interface TourPackagesPageProps {
  currency: Currency;
  onNavigate: (page: PageType) => void;
}

interface TourPackageItem {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  durationFilter: '1day' | '2day' | '3day';
  theme: 'heritage' | 'nature' | 'safari' | 'coastal' | 'adventure';
  pickupCity: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  priceLkr: number;
  badge: string;
  inclusions: string[];
  itinerarySummary: string[];
  vehicleType: string;
}

const TOUR_PACKAGES: TourPackageItem[] = [
  {
    id: 'ella-mountain-train',
    title: 'Ella Highland Odyssey & Iconic Blue Train Journey',
    tagline: 'Nine Arch Bridge, Little Adam’s Peak & Reserved 1st Class Train',
    duration: '1 Full Day (Early Departure)',
    durationFilter: '1day',
    theme: 'nature',
    pickupCity: 'Colombo / Kandy / Ella',
    imageUrl: '/src/assets/images/sanctuary_ella_mist_mountain_1792932449774.jpg',
    rating: 4.96,
    reviewCount: 342,
    priceLkr: 18500,
    badge: 'Bestseller',
    vehicleType: 'Private AC Sedan / Van with Chauffeur',
    inclusions: [
      'Reserved Scenic Train Tickets',
      'Private AC Vehicle & Chauffeur Guide',
      'Tea Factory Tasting & Tour',
      'Ravana Waterfalls & Nine Arch Bridge',
      'Bottled Mineral Water & Ceylon Tea'
    ],
    itinerarySummary: [
      '06:00 AM — Hotel pickup & drive to Highland Ridge',
      '10:30 AM — Reserved Blue Train ride through misty tea tunnels',
      '01:00 PM — Authentic Ceylon lunch overlooking Ella Gap',
      '02:30 PM — Nine Arch Bridge walk & Little Adam’s Peak trek',
      '05:30 PM — Return transfer to hotel'
    ]
  },
  {
    id: 'sigiriya-dambulla-safari',
    title: 'Sigiriya Rock Fortress & Minneriya Elephant Gathering',
    tagline: 'UNESCO 5th-Century Palace, Cave Temples & 4x4 Wild Elephant Safari',
    duration: '1 Full Day',
    durationFilter: '1day',
    theme: 'heritage',
    pickupCity: 'Colombo / Negombo / Kandy',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi40qXJRFZwB3abf_wUSEGP6InmvJLG7uxoxx6BAzzZ8M7pflu0FJTjgfBBRW535bzukTarLStCx-zUiTqWp9Bk4bjvYjsIVq3n8USikhoAbDa_nEoyo1S-dzSId1E5qkV-4rlE2bs7_nHUia4aui6D_VSa6pOTB9rmJtObDVsWQTQReXPNL2xb74D4te7aJsRnx7GpOmQhWggTLJpsnTgg8cNmINnr0mASYDGJvvI19Ch635JToq0',
    rating: 4.98,
    reviewCount: 420,
    priceLkr: 22000,
    badge: 'Must Do UNESCO',
    vehicleType: 'Private AC Vehicle + 4x4 Safari Jeep',
    inclusions: [
      'Sigiriya Lion Rock Entry Ticket Included',
      'Exclusive 4x4 Open Safari Jeep in Minneriya',
      'Dambulla Golden Cave Temple Visit',
      'Traditional Village Catamaran Ride & Lunch',
      'Certified SLTDA English/Sinhala Chauffeur'
    ],
    itinerarySummary: [
      '06:30 AM — Hotel pickup with packed breakfast option',
      '09:30 AM — Climb ancient Sigiriya Rock Fortress with guide',
      '01:00 PM — Authentic Habarana clay-pot curry feast',
      '03:00 PM — 4x4 Jeep Safari witnessing wild elephant herds',
      '06:00 PM — Evening departure back to pickup base'
    ]
  },
  {
    id: 'galle-madu-river-coastal',
    title: 'Southern Coastal Explorer: Galle Fort & Madu River Boat Safari',
    tagline: '17th Century Dutch Ramparts, Mangrove Boat Safari & Sea Turtle Sanctuary',
    duration: '1 Day Excursion',
    durationFilter: '1day',
    theme: 'coastal',
    pickupCity: 'Colombo / Bentota / Kalutara',
    imageUrl: '/src/assets/images/sanctuary_galle_fort_colonial_1792932449839.jpg',
    rating: 4.91,
    reviewCount: 289,
    priceLkr: 14500,
    badge: 'Family Favorite',
    vehicleType: 'Private AC Car / Mini Van',
    inclusions: [
      'Covered Speedboat Safari along Madu River',
      'Cinnamon Island & Natural Fish Therapy',
      'Kosgoda Sea Turtle Hatchery Entry',
      'Guided Walking Tour of Galle Dutch Fort Ramparts',
      'Stilt Fishermen Photography Stop in Koggala'
    ],
    itinerarySummary: [
      '07:30 AM — Pickup from Colombo / Bentota along Expressway',
      '09:00 AM — Madu Ganga boat cruise through 64 mangrove islands',
      '11:30 AM — Sea turtle conservation visit in Kosgoda',
      '01:00 PM — Fresh seafood lunch inside Galle Fort',
      '03:00 PM — Historical Galle lighthouse and rampart walk'
    ]
  },
  {
    id: 'yala-wild-leopard-safari',
    title: 'Yala National Park VIP Leopard & Sloth Bear Safari',
    tagline: 'Exclusive Dawn/Dusk 4x4 Safari in Block 1 with Top Wildlife Tracker',
    duration: '1 Full Day Safari',
    durationFilter: '1day',
    theme: 'safari',
    pickupCity: 'Bentota / Galle / Mirissa / Yala',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCddDOk1PEzEryL44aq-FeAF1GwDH1Mdj447UT2KYeso9sIJJzRGP3CeUy48-et7qicLY352KRXGVvoPwcKyZriSwvqQ2ot3YKdMAdgvHnvcTwqG5m2bs33NkQjYfxculm5eOKsZKXQ1k0DVF46lcKA0thMgHf2cPtuCMLUVMohhy3nNxH2NPoNAxnau5GyUwELdva-52_QfyZQCBDWg3YWwRSgWd3d-uK19gepOZR24mMNTBD_kd5A',
    rating: 4.95,
    reviewCount: 198,
    priceLkr: 24000,
    badge: 'Big Game Safari',
    vehicleType: 'Modified High-Clearance 4x4 Safari Jeep',
    inclusions: [
      'Department of Wildlife Entry Permits & Taxes',
      'Private Custom 4x4 Safari Cruiser',
      'Professional Wildlife Spotter & Guide',
      'High-Power Binoculars Provided',
      'Picnic Lunch by Patanangala Ocean Beach'
    ],
    itinerarySummary: [
      '05:00 AM — Morning entry queue at Yala Palatupana Gate',
      '06:00 AM to 11:30 AM — Tracking leopards, elephants & spotted deer',
      '12:00 PM — Rest and beachside picnic lunch',
      '02:30 PM to 06:00 PM — Afternoon safari around Manik River waterholes',
      '06:30 PM — Hotel transfer with camera memory review'
    ]
  },
  {
    id: 'kitulgala-adventure-rafting',
    title: 'Kitulgala White Water Rapids & Waterfall Abseiling',
    tagline: 'Kelani Rainforest Thrills, Natural Rock Sliding & Jungle BBQ',
    duration: '1 Day Adventure',
    durationFilter: '1day',
    theme: 'adventure',
    pickupCity: 'Colombo / Kandy / Negombo',
    imageUrl: '/src/assets/images/sanctuary_river_glamping_retreat_1792932450705.jpg',
    rating: 4.93,
    reviewCount: 230,
    priceLkr: 12500,
    badge: 'Thrills & Fun',
    vehicleType: 'Private AC Transport',
    inclusions: [
      'Grade 3 White Water Rafting (6.5 km Rapids)',
      'Natural Waterfall Abseiling & Rock Sliding',
      'Certified Marshals, Lifejackets & Helmets',
      'Buffet Barbecue Lunch beside Kelani River',
      'Changing Rooms, Lockers & Freshwater Showers'
    ],
    itinerarySummary: [
      '07:00 AM — Pickup from Colombo / Kandy',
      '09:30 AM — Arrival at basecamp, safety gear & briefing',
      '10:30 AM — White water rafting through Butter Crunch & Killer Cave rapids',
      '01:00 PM — Open-air riverside BBQ buffet',
      '02:30 PM — Rainforest hike to natural rock pools and slides',
      '04:30 PM — Return drive'
    ]
  },
  {
    id: 'kandy-tea-botanical-heritage',
    title: 'Kandy Royal Heritage: Temple of Tooth & Botanical Paradise',
    tagline: 'Sacred Relic Shrine, Peradeniya Giant Palms & Ceylon Tea Tasting',
    duration: '1 Day Excursion',
    durationFilter: '1day',
    theme: 'heritage',
    pickupCity: 'Colombo / Negombo / Bentota',
    imageUrl: '/src/assets/images/hero_sri_lanka_luxury_escape_1792932448818.jpg',
    rating: 4.89,
    reviewCount: 315,
    priceLkr: 15000,
    badge: 'Cultural Classic',
    vehicleType: 'Private AC Sedan / Van',
    inclusions: [
      'Temple of the Sacred Tooth Relic Guided Visit',
      'Royal Botanical Gardens Peradeniya Tickets',
      'Giragama Working Tea Factory & Tea Tasting',
      'Kandyan Traditional Arts & Gem Museum Tour',
      'Lunch at Hanthana Valley Panorama Restaurant'
    ],
    itinerarySummary: [
      '06:45 AM — Scenic drive into the Central Province',
      '09:30 AM — Tea plantation visit & fresh brew tasting',
      '11:00 AM — Royal Botanical Gardens walking tour',
      '01:30 PM — Traditional Sri Lankan lunch buffet',
      '03:00 PM — Dalada Maligawa (Temple of the Tooth) puja ceremony'
    ]
  }
];

export const TourPackagesPage: React.FC<TourPackagesPageProps> = ({
  currency,
  onNavigate
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<TourPackageItem | null>(null);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [tourDate, setTourDate] = useState<string>('2025-04-25');
  const [pickupHotel, setPickupHotel] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [bookingSubmitted, setBookingSubmitted] = useState<boolean>(false);

  const filteredTours = TOUR_PACKAGES.filter((tour) => {
    if (selectedTheme !== 'all' && tour.theme !== selectedTheme) return false;
    if (selectedCity !== 'all' && !tour.pickupCity.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    return true;
  });

  const formatPrice = (lkrAmount: number) => {
    if (currency === 'USD') {
      return `$${(lkrAmount / USD_EXCHANGE_RATE).toFixed(2)}`;
    }
    return `LKR ${lkrAmount.toLocaleString()}`;
  };

  const handleBookTour = (tour: TourPackageItem) => {
    setSelectedPackageForBooking(tour);
    setBookingSubmitted(false);
  };

  const handleSubmitTourReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] pb-24">
      {/* Hero Header */}
      <section className="relative bg-[#003528] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(#26a69a_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase mb-4">
            <span className="material-symbols-outlined text-sm">travel_explore</span>
            Sri Lanka Day Excursions &amp; Experiential Tours
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-headline text-white leading-tight">
                Curated Sri Lanka Tour Packages &amp; Private Day Tours
              </h1>
              <p className="mt-3 text-base sm:text-lg text-[#c5ded5] leading-relaxed">
                Explore the island’s most iconic wonders with dedicated private AC vehicles, SLTDA-certified chauffeur guides, all site entry tickets, and doorstep hotel pickup.
              </p>
            </div>

            {/* Quick Trust Pillars */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 shrink-0">
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-white">100%</span>
                <span className="text-[11px] text-emerald-200 font-medium">Private AC Car</span>
              </div>
              <div className="text-center px-3 border-r border-white/20">
                <span className="block text-2xl font-black text-amber-300">All-In</span>
                <span className="text-[11px] text-emerald-200 font-medium">Site Entry Fees</span>
              </div>
              <div className="text-center px-3">
                <span className="block text-2xl font-black text-white">Doorstep</span>
                <span className="text-[11px] text-emerald-200 font-medium">Hotel Pickup</span>
              </div>
            </div>
          </div>

          {/* Theme Quick Selector */}
          <div className="mt-8 pt-6 border-t border-white/15 flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Tours', icon: 'explore' },
              { id: 'heritage', label: 'Cultural & Heritage', icon: 'account_balance' },
              { id: 'nature', label: 'Scenic Mountains & Trains', icon: 'train' },
              { id: 'safari', label: 'Wildlife Safaris', icon: 'cruelty_free' },
              { id: 'coastal', label: 'Coastal & Boat Cruises', icon: 'sailing' },
              { id: 'adventure', label: 'Adventures & Rafting', icon: 'kayaking' }
            ].map((theme) => {
              const active = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#003528] shadow-md scale-105 font-bold'
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

      {/* Filter and Departure Toolbar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8e5] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Departure City Select */}
            <div className="flex items-center gap-2 bg-[#f4f7f6] px-3.5 py-2 rounded-xl border border-[#e2e8e5]">
              <span className="material-symbols-outlined text-[#006a66] text-lg">hotel</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-medium text-[#2d3834] focus:outline-none cursor-pointer"
              >
                <option value="all">All Pickup Locations</option>
                <option value="Colombo">Colombo Hotels &amp; Suburbs</option>
                <option value="Negombo">Negombo Beach / Airport</option>
                <option value="Bentota">Bentota &amp; Beruwala</option>
                <option value="Kandy">Kandy Central</option>
                <option value="Galle">Galle &amp; Unawatuna</option>
                <option value="Ella">Ella Valley</option>
              </select>
            </div>

            {/* Inclusions Guarantee badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#006a66] text-xs font-bold border border-emerald-200">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              100% Guaranteed Private Departures Every Day
            </span>
          </div>

          <div className="text-xs font-bold text-[#6b7772]">
            Showing <span className="text-[#003528] font-extrabold">{filteredTours.length}</span> Tour Packages
          </div>
        </div>
      </section>

      {/* Tour Packages Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e2e8e5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={tour.imageUrl}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-[#003528]/90 backdrop-blur-sm text-emerald-300 font-bold text-[11px] tracking-wide uppercase border border-emerald-500/30">
                    {tour.badge}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[#003528] font-bold text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                    {tour.rating} ({tour.reviewCount})
                  </span>
                </div>

                {/* Duration & Vehicle info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 font-medium bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-sm text-amber-300">schedule</span>
                    {tour.duration}
                  </span>
                  <span className="bg-emerald-700/90 font-semibold px-2 py-1 rounded-lg text-[10px]">
                    {tour.pickupCity}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-headline text-lg font-bold text-[#003528] group-hover:text-[#006a66] transition-colors line-clamp-1">
                  {tour.title}
                </h3>
                <p className="text-xs text-[#55635e] line-clamp-2 mt-1 leading-relaxed">{tour.tagline}</p>

                {/* Vehicle Pill */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-[#006a66] bg-[#f4fbf9] p-2 rounded-xl border border-emerald-100">
                  <span className="material-symbols-outlined text-base">directions_car</span>
                  <span className="font-semibold truncate">{tour.vehicleType}</span>
                </div>

                {/* Inclusions */}
                <div className="mt-3.5 space-y-1.5">
                  {tour.inclusions.slice(0, 3).map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#404945]">
                      <span className="material-symbols-outlined text-emerald-600 text-sm shrink-0">check_circle</span>
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing & CTA */}
                <div className="mt-auto pt-4 border-t border-[#e2e8e5] flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#6b7772] uppercase tracking-wider font-semibold block">
                      All-Inclusive Rate
                    </span>
                    <span className="text-lg font-black text-[#003528] font-mono">
                      {formatPrice(tour.priceLkr)}
                    </span>
                    <span className="text-[10px] text-[#6b7772] block">/ person (min 2 pax)</span>
                  </div>

                  <button
                    onClick={() => handleBookTour(tour)}
                    className="px-4 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Book Tour</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tour Booking & Customization Modal */}
      {selectedPackageForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPackageForBooking(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {bookingSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-4xl">task_alt</span>
                </div>
                <h3 className="text-2xl font-bold font-headline text-[#003528]">Tour Reservation Initiated!</h3>
                <p className="text-sm text-[#55635e] mt-2 max-w-md mx-auto">
                  Thank you! Your private tour request for <strong>{selectedPackageForBooking.title}</strong> for {guestCount} travelers on {tourDate} has been confirmed.
                </p>
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#006a66]">
                  Our designated chauffeur coordinator will contact you via WhatsApp / Phone at <strong>{customerPhone}</strong> with vehicle driver details and hotel pickup time.
                </div>
                <button
                  onClick={() => setSelectedPackageForBooking(null)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#003528] text-white font-bold text-xs hover:bg-[#004d3b] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-[#006a66] text-xs font-bold uppercase tracking-wider border border-emerald-200">
                  Instant Private Tour Reservation
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#003528] mt-2">
                  {selectedPackageForBooking.title}
                </h3>
                <p className="text-xs text-[#55635e] mt-1">{selectedPackageForBooking.tagline}</p>

                {/* Itinerary steps */}
                <div className="mt-4 p-3.5 rounded-2xl bg-[#f4f7f6] border border-[#e2e8e5]">
                  <h4 className="text-xs font-bold text-[#003528] mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#006a66]">route</span>
                    Tour Itinerary Timeline
                  </h4>
                  <div className="space-y-1.5">
                    {selectedPackageForBooking.itinerarySummary.map((step, i) => (
                      <div key={i} className="text-[11px] text-[#404945] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006a66]"></span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking Form */}
                <form onSubmit={handleSubmitTourReservation} className="mt-5 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#404945] block mb-1">Select Tour Date</label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#ccd5d1] text-xs text-[#2d3834] focus:outline-none focus:ring-1 focus:ring-[#006a66]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#404945] block mb-1">Number of Travelers</label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#ccd5d1] text-xs text-[#2d3834] focus:outline-none focus:ring-1 focus:ring-[#006a66]"
                      >
                        <option value={1}>1 Solo Explorer</option>
                        <option value={2}>2 Adults (Couple)</option>
                        <option value={3}>3 Guests</option>
                        <option value={4}>4 Guests (Family Car)</option>
                        <option value={6}>6 Guests (Mini Van)</option>
                        <option value={10}>10+ Guests (Tour Van)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#404945] block mb-1">
                      Hotel Pickup Name &amp; City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Cinnamon Grand Colombo / Heritance Ahungalla"
                      value={pickupHotel}
                      onChange={(e) => setPickupHotel(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ccd5d1] text-xs text-[#2d3834] focus:outline-none focus:ring-1 focus:ring-[#006a66]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#404945] block mb-1">
                      Contact Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+94 77 XXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#ccd5d1] text-xs text-[#2d3834] focus:outline-none focus:ring-1 focus:ring-[#006a66]"
                    />
                  </div>

                  {/* Pricing Total */}
                  <div className="pt-3 border-t border-[#e2e8e5] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#6b7772] uppercase tracking-wider block">Estimated Total</span>
                      <span className="text-xl font-black text-[#003528] font-mono">
                        {formatPrice(selectedPackageForBooking.priceLkr * guestCount)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#003528] hover:bg-[#004d3b] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                    >
                      Confirm Tour Reservation
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
