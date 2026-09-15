import { 
  collection, 
  doc, 
  getDoc,
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  query,
  where
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Order, User, StoreSettings, ProductReview } from '../types';
import { isPrimaryAdmin } from '../config/admin';

const isAdmin = async (): Promise<boolean> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    return false;
  }

  return isPrimaryAdmin(firebaseUser.uid);
};

export const syncFirebase = {
  getUser: async (userId: string): Promise<User | null> => {
    try {
      const snapshot = await getDoc(doc(db, 'users', userId));
      if (!snapshot.exists()) return null;
      const user = snapshot.data() as User;
      if (user.deletedAt) return null;
      return user.role === 'admin' && !isPrimaryAdmin(userId)
        ? { ...user, role: 'customer' }
        : user;
    } catch (error) {
      console.warn(`No se pudo cargar el perfil de usuario users/${userId}; se usará el perfil local.`, error);
      return null;
    }
  },

  getUsers: async (): Promise<User[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      return snapshot.docs.map(snapshotDoc => {
        const user = snapshotDoc.data() as User;
        if (user.deletedAt) return null;
        return user.role === 'admin' && !isPrimaryAdmin(user.id)
          ? { ...user, role: 'customer' }
          : user;
      }).filter((user): user is User => user !== null);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'users');
      return [];
    }
  },

  // Real-time listener for Products
  subscribeProducts: (callback: (products: Product[]) => void) => {
    try {
      const colRef = collection(db, 'products');
      return onSnapshot(colRef, (snapshot) => {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Product);
        });
        callback(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'products');
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'products');
      return () => {};
    }
  },

  // Save / Update single product
  saveProduct: async (product: Product) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para actualizar productos.');
    }
    try {
      const ref = doc(db, 'products', product.id);
      await setDoc(ref, product, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'products');
    }
  },

  // Batch seed or update products
  seedProductsBatch: async (products: Product[]) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para actualizar productos.');
    }
    try {
      const batch = writeBatch(db);
      // Firestore limits batch to 500 operations
      const slice = products.slice(0, 450);
      slice.forEach((p) => {
        const ref = doc(db, 'products', p.id);
        batch.set(ref, p, { merge: true });
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'products (batch)');
    }
  },

  // Delete product
  deleteProduct: async (productId: string) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para eliminar productos.');
    }
    try {
      const ref = doc(db, 'products', productId);
      await deleteDoc(ref);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'products');
    }
  },

  // Orders
  subscribeOrders: (callback: (orders: Order[]) => void) => {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return () => {};
      }

      let unsubscribe = () => {};
      void (async () => {
        const admin = await isAdmin();
        const ordersQuery = admin
          ? collection(db, 'orders')
          : query(collection(db, 'orders'), where('userId', '==', firebaseUser.uid));
        unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
          const list: Order[] = [];
          snapshot.forEach((orderDoc) => {
            list.push(orderDoc.data() as Order);
          });
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          callback(list);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, 'orders');
        });
      })();
      return () => unsubscribe();
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'orders');
      return () => {};
    }
  },

  saveOrder: async (order: Order) => {
    const admin = await isAdmin();
    if (!auth.currentUser || (!admin && order.userId !== auth.currentUser.uid)) {
      return;
    }
    try {
      const ref = doc(db, 'orders', order.id);
      await setDoc(ref, order, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'orders');
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para actualizar pedidos.');
    }
    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'orders');
    }
  },

  deleteOrder: async (orderId: string) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para eliminar pedidos.');
    }
    try {
      const ref = doc(db, 'orders', orderId);
      await deleteDoc(ref);
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'orders');
    }
  },

  // Users
  subscribeUsers: (callback: (users: User[]) => void) => {
    try {
      const colRef = collection(db, 'users');
      return onSnapshot(colRef, (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((doc) => {
          const user = doc.data() as User;
          if (user.deletedAt) return;
          list.push(user.role === 'admin' && !isPrimaryAdmin(user.id)
            ? { ...user, role: 'customer' as const }
            : user);
        });
        callback(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, 'users');
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'users');
      return () => {};
    }
  },

  saveUser: async (user: User) => {
    const admin = await isAdmin();
    if (!auth.currentUser || (user.id !== auth.currentUser.uid && !admin)) {
      throw new Error('No tienes permisos para guardar este usuario.');
    }
    try {
      const ref = doc(db, 'users', user.id);
      const firestoreUser = Object.fromEntries(
        Object.entries(user).filter(([, value]) => value !== undefined)
      ) as User;
      await setDoc(ref, firestoreUser, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'users');
      throw e;
    }
  },

  deleteUser: async (userId: string) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para eliminar usuarios.');
    }
    if (userId === auth.currentUser?.uid) {
      throw new Error('No puedes eliminar el perfil del administrador actualmente conectado.');
    }
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      // Older deployed rules may reject delete. Persist a tombstone so the
      // profile is excluded from every Business synchronization immediately.
      const snapshot = await getDoc(doc(db, 'users', userId));
      if (!snapshot.exists()) return;
      await setDoc(doc(db, 'users', userId), {
        ...snapshot.data(),
        status: 'inactive',
        deletedAt: new Date().toISOString()
      }, { merge: true });
    }
  },

  // Store Settings
  subscribeSettings: (callback: (settings: StoreSettings) => void) => {
    try {
      const ref = doc(db, 'settings', 'global');
      return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          callback(snap.data() as StoreSettings);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, 'settings/global');
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'settings/global');
      return () => {};
    }
  },

  saveSettings: async (settings: StoreSettings) => {
    if (!(await isAdmin())) {
      throw new Error('La cuenta autenticada no tiene permisos de administrador para actualizar la configuración.');
    }
    try {
      const ref = doc(db, 'settings', 'global');
      await setDoc(ref, settings, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/global');
    }
  }
};
