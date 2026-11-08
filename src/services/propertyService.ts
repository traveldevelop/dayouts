import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SanctuaryProperty } from '../types';
import { PROPERTIES } from '../data/mockData';

const PROPERTIES_COLLECTION = 'properties';

export async function fetchPropertiesFromDb(): Promise<SanctuaryProperty[]> {
  try {
    const q = query(collection(db, PROPERTIES_COLLECTION), orderBy('rating', 'desc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Seed default verified properties into the database on first run
      await seedDefaultProperties();
      return PROPERTIES;
    }

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    })) as SanctuaryProperty[];
  } catch (error) {
    console.warn('Falling back to local cache while connecting to database:', error);
    return PROPERTIES;
  }
}

export async function seedDefaultProperties(): Promise<void> {
  try {
    for (const prop of PROPERTIES) {
      const docRef = doc(db, PROPERTIES_COLLECTION, prop.id);
      await setDoc(docRef, prop, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PROPERTIES_COLLECTION);
  }
}

export async function fetchPropertyById(id: string): Promise<SanctuaryProperty | null> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return PROPERTIES.find((p) => p.id === id) || null;
    }
    return { id: snap.id, ...snap.data() } as SanctuaryProperty;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${PROPERTIES_COLLECTION}/${id}`);
    return null;
  }
}

export async function savePropertyToDb(property: SanctuaryProperty): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, property.id);
    await setDoc(docRef, property, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PROPERTIES_COLLECTION}/${property.id}`);
  }
}

export async function deletePropertyFromDb(propertyId: string): Promise<void> {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PROPERTIES_COLLECTION}/${propertyId}`);
  }
}
