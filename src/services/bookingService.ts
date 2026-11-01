import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { BookingState } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';

const BOOKINGS_COLLECTION = 'bookings';

export async function fetchBookingsFromDb(): Promise<BookingState[]> {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Seed initial sample bookings into Firestore
      for (const b of INITIAL_BOOKINGS) {
        await setDoc(doc(db, BOOKINGS_COLLECTION, b.id), b, { merge: true });
      }
      return INITIAL_BOOKINGS;
    }

    return snapshot.docs.map((docSnap) => ({
      ...docSnap.data()
    })) as BookingState[];
  } catch (error) {
    console.warn('Falling back to local state while connecting to Firestore:', error);
    return INITIAL_BOOKINGS;
  }
}

export async function saveBookingToDb(booking: BookingState): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${booking.id}`;
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, booking.id);
    await setDoc(docRef, {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateBookingStatusInDb(
  bookingId: string,
  newStatus: BookingState['status']
): Promise<void> {
  const path = `${BOOKINGS_COLLECTION}/${bookingId}`;
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export function subscribeToBookings(onUpdate: (bookings: BookingState[]) => void): () => void {
  try {
    const q = query(collection(db, BOOKINGS_COLLECTION), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as BookingState);
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Real-time bookings snapshot error:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.warn('Unable to subscribe to real-time bookings:', error);
    return () => {};
  }
}
