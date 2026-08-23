import React, { createContext, useContext, useState, useCallback } from 'react';
import { requestDigiLockerConsent, verifyDigiLockerOtp } from '../utils/digilockerApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, verified, dob, docType }
  const [verificationStep, setVerificationStep] = useState('idle'); // idle | consent | otp | verified | failed
  const [pendingTxnId, setPendingTxnId] = useState(null);
  const [error, setError] = useState(null);

  const startVerification = useCallback(async (aadhaarLinkedId) => {
    setError(null);
    setVerificationStep('consent');
    try {
      const { txnId } = await requestDigiLockerConsent(aadhaarLinkedId);
      setPendingTxnId(txnId);
      setVerificationStep('otp');
    } catch (err) {
      setError(err.message);
      setVerificationStep('failed');
    }
  }, []);

  const confirmOtp = useCallback(async (otp) => {
    setError(null);
    try {
      const result = await verifyDigiLockerOtp(pendingTxnId, otp);
      if (result.ageOver21 && result.success) {
        setUser({ name: result.name, verified: true, dob: result.dob, docType: result.docType });
        setVerificationStep('verified');
        return true;
      }
      setError(result.success ? 'You must be 21 or older to shop here.' : 'Verification failed. Check the OTP and try again.');
      setVerificationStep('failed');
      return false;
    } catch (err) {
      setError(err.message);
      setVerificationStep('failed');
      return false;
    }
  }, [pendingTxnId]);

  const logout = useCallback(() => {
    setUser(null);
    setVerificationStep('idle');
    setPendingTxnId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, verificationStep, error, startVerification, confirmOtp, logout, setVerificationStep }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
