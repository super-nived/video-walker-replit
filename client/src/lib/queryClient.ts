import { QueryClient, QueryKey } from "@tanstack/react-query";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import app from "./firebase"; // Assuming 'app' is exported from firebase.ts

const firestore = getFirestore(app);

const firebaseQueryFn = async ({ queryKey }: { queryKey: QueryKey }) => {
  const [collectionName, id] = queryKey;

  if (typeof collectionName !== 'string') {
    throw new Error("Collection name must be a string.");
  }

  const collectionRef = collection(firestore, collectionName);

  if (id === 'active' && collectionName === 'campaigns') {
    // Special handling for active campaign
    const q = query(collectionRef, where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const activeDoc = querySnapshot.docs[0];
      const data = activeDoc.data();
      if (data.countdownEnd && typeof data.countdownEnd.toDate === 'function') {
        data.countdownEnd = data.countdownEnd.toDate();
      }
      return { id: activeDoc.id, ...data };
    }
    return null; // No active campaign found
  } else if (id) {
    // Fetch a single document by ID
    const docRef = doc(firestore, collectionName, id as string);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.countdownEnd && typeof data.countdownEnd.toDate === 'function') {
        data.countdownEnd = data.countdownEnd.toDate();
      }
      return { id: docSnap.id, ...data };
    }
    return null;
  } else {
    // Fetch all documents in the collection
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.countdownEnd && typeof data.countdownEnd.toDate === 'function') {
        data.countdownEnd = data.countdownEnd.toDate();
      }
      return { id: doc.id, ...data };
    });
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: firebaseQueryFn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
