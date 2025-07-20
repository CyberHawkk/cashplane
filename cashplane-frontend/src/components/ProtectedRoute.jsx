// src/components/ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children, requiredStep }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setAllowed(false);

      const docRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(docRef);
      const data = userSnap.data();

      const stepChecks = {
        verify: data?.isVerified,
        payment: data?.hasPaid,
        referral: data?.referralValidated,
        dashboard: data?.referralValidated,
      };

      setAllowed(stepChecks[requiredStep]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requiredStep]);

  if (loading) return <p>Loading...</p>;
  if (!allowed) return <Navigate to="/" />;

  return children;
}
