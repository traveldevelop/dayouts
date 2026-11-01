import React, { useState, useEffect } from 'react';
import { SanctuaryProperty, BookingState, Currency, Language, PageType, CabanaUnit, CabanaPackageTier } from './types';
import { PROPERTIES, INITIAL_BOOKINGS, USD_EXCHANGE_RATE } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingConcierge } from './components/FloatingConcierge';
import { VoucherModal } from './components/VoucherModal';
import { ExplorePage } from './pages/ExplorePage';
import { DayOutsPage } from './pages/DayOutsPage';
import { OffersPage } from './pages/OffersPage';
import { VillasStaysPage } from './pages/VillasStaysPage';
import { CorporatePage } from './pages/CorporatePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OwnerPortalPage } from './pages/OwnerPortalPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { testConnection } from './lib/firebase';
import {
  fetchBookingsFromDb,
  saveBookingToDb,
  updateBookingStatusInDb,
  subscribeToBookings
} from './services/bookingService';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('explore-stays');
  const [selectedProperty, setSelectedProperty] = useState<SanctuaryProperty>(PROPERTIES[0]);
  const [currency, setCurrency] = useState<Currency>('LKR');
  const [language, setLanguage] = useState<Language>('EN');
  const [wishlist, setWishlist] = useState<string[]>(['the-palms-bentota']);
  const [bookings, setBookings] = useState<BookingState[]>(INITIAL_BOOKINGS);
  const [activeVoucherBooking, setActiveVoucherBooking] = useState<BookingState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and synchronize with real-time Firestore database
  useEffect(() => {
    testConnection();

    // Initial fetch from Firestore
    fetchBookingsFromDb().then((dbBookings) => {
      if (dbBookings && dbBookings.length > 0) {
        setBookings(dbBookings);
      }
    });

    // Subscribe to live changes
    const unsubscribe = subscribeToBookings((liveBookings) => {
      setBookings(liveBookings);
    });

    return () => unsubscribe();
  }, []);

  // Parameter bundle passed from PropertyDetailPage to CheckoutPage
  const [checkoutParams, setCheckoutParams] = useState<{
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
  }>({
    property: PROPERTIES[0],
    date: '2025-04-20',
    slot: '09:30 AM – 05:30 PM',
    packageName: 'All-Inclusive Tropical Day Out Pass',
    adults: 2,
    children: 0,
    addOns: { jetski: false, transfer: false, byob: true },
    totalLkr: 15000,
    totalUsd: 49.15
  });

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleWishlist = (propertyId: string) => {
    setWishlist((prev) => {
      const isSaved = prev.includes(propertyId);
      const updated = isSaved ? prev.filter((id) => id !== propertyId) : [...prev, propertyId];
      showToast(isSaved ? 'Removed from saved wishlist' : 'Saved to your private sanctuary wishlist');
      return updated;
    });
  };

  const handleSelectProperty = (property: SanctuaryProperty) => {
    setSelectedProperty(property);
    setCurrentPage('property-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBookingFromExplore = (property: SanctuaryProperty) => {
    setSelectedProperty(property);
    setCheckoutParams({
      property,
      date: '2025-04-20',
      slot: property.timeSlot,
      packageName: property.passTypeLabel,
      adults: 2,
      children: 0,
      addOns: { jetski: false, transfer: false, byob: true },
      totalLkr: property.priceLkr * 2,
      totalUsd: Number(((property.priceLkr * 2) / USD_EXCHANGE_RATE).toFixed(2))
    });
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = (params: {
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
  }) => {
    setSelectedProperty(params.property);
    setCheckoutParams(params);
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (newBooking: BookingState) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveVoucherBooking(newBooking);
    showToast(`Booking #${newBooking.id} confirmed! Digital pass generated.`);
    // Persist to real Firestore database
    saveBookingToDb(newBooking).catch((err) => console.error('Failed to save to Firestore:', err));
  };

  const handleApproveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CONFIRMED' as const } : b))
    );
    showToast(`Booking #${id} successfully approved and confirmed for guest.`);
    // Persist status change to Firestore
    updateBookingStatusInDb(id, 'CONFIRMED').catch((err) => console.error('Failed to update in Firestore:', err));
  };

  const handleRejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'REJECTED' as const } : b))
    );
    showToast(`Booking #${id} declined. Escrow refund released to customer.`);
    // Persist status change to Firestore
    updateBookingStatusInDb(id, 'REJECTED').catch((err) => console.error('Failed to update in Firestore:', err));
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isPortalMode = currentPage === 'owner-portal' || currentPage === 'admin-console';

  return (
    <div className="min-h-screen bg-[#effcfd] text-[#121d1e] flex flex-col font-body selection:bg-[#006a66]/20 selection:text-[#003528]">
      {/* Top Banner Quick-Nav if in Owner or Admin Console */}
      {isPortalMode && (
        <aside aria-label="Portal Navigation Bar" className="bg-[#003528] text-white px-4 py-2 text-xs flex items-center justify-between z-50 fixed top-0 left-0 right-0 h-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold uppercase tracking-wider text-[11px] text-teal-200">
              {currentPage === 'owner-portal' ? 'Owner Portal • Ceylon Palms Luxury Retreat' : 'Super Admin & SLTDA Regulatory Governance'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('explore-stays')}
              className="text-white hover:text-teal-200 font-medium flex items-center gap-1 transition"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Public Marketplace
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => handleNavigate(currentPage === 'owner-portal' ? 'admin-console' : 'owner-portal')}
              className="text-white hover:text-teal-200 font-medium transition"
            >
              Switch to {currentPage === 'owner-portal' ? 'Admin Console' : 'Owner Portal'}
            </button>
          </div>
        </aside>
      )}

      {/* Main Header (shown on public and guest pages) */}
      {!isPortalMode && (
        <Header
          currentPage={currentPage}
          onNavigate={handleNavigate}
          currency={currency}
          onCurrencyChange={setCurrency}
          language={language}
          onLanguageChange={setLanguage}
          bookingCount={bookings.length}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 ${!isPortalMode ? 'pt-20' : 'pt-10'}`}>
        {currentPage === 'explore-stays' ? (
          <ExplorePage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            currentPage={currentPage}
          />
        ) : currentPage === 'day-out-packages' ? (
          <DayOutsPage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPage === 'deals-and-offers' ? (
          <OffersPage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPage === 'villas-stays' ? (
          <VillasStaysPage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPage === 'tour-packages' ? (
          <DayOutsPage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPage === 'corporate-events' ? (
          <CorporatePage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
          />
        ) : currentPage === 'property-detail' ? (
          <PropertyDetailPage
            property={selectedProperty}
            currency={currency}
            onCurrencyChange={setCurrency}
            onNavigate={handleNavigate}
            onProceedToCheckout={handleProceedToCheckout}
            isSaved={wishlist.includes(selectedProperty.id)}
            onToggleWishlist={handleToggleWishlist}
          />
        ) : currentPage === 'checkout' ? (
          <CheckoutPage
            property={checkoutParams.property || selectedProperty}
            initialParams={checkoutParams}
            currency={currency}
            onNavigate={handleNavigate}
            onBookingConfirmed={handleBookingConfirmed}
          />
        ) : currentPage === 'owner-portal' ? (
          <OwnerPortalPage
            currency={currency}
            onCurrencyChange={setCurrency}
            onNavigate={handleNavigate}
            bookings={bookings}
            onApproveBooking={handleApproveBooking}
            onRejectBooking={handleRejectBooking}
          />
        ) : currentPage === 'admin-console' ? (
          <AdminConsolePage
            currency={currency}
            onNavigate={handleNavigate}
          />
        ) : currentPage === 'my-bookings' ? (
          <MyBookingsPage
            bookings={bookings}
            currency={currency}
            onViewVoucher={(booking) => setActiveVoucherBooking(booking)}
            onExplore={() => handleNavigate('explore-stays')}
            onNavigateHome={() => handleNavigate('explore-stays')}
          />
        ) : (
          <ExplorePage
            currency={currency}
            onSelectProperty={handleSelectProperty}
            onStartBooking={handleStartBookingFromExplore}
            onNavigate={handleNavigate}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
          />
        )}
      </main>

      {/* Footer on public pages */}
      {!isPortalMode && <Footer onNavigate={handleNavigate} />}

      {/* Floating Concierge Assistant on public pages */}
      {!isPortalMode && <FloatingConcierge />}

      {/* Verified SLTDA QR Voucher Modal */}
      <VoucherModal
        booking={activeVoucherBooking}
        currency={currency}
        onClose={() => setActiveVoucherBooking(null)}
      />

      {/* Global Toast Alert */}
      {toastMessage && (
        <aside
          aria-label="System notification"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#003528] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/30 animate-in fade-in slide-in-from-bottom-5"
        >
          <span className="material-symbols-outlined text-teal-300 text-xl">verified</span>
          <span className="font-label-md text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/70 hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </aside>
      )}
    </div>
  );
}
