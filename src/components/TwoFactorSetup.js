import React, { useState } from 'react';
import { auth, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator } from '../firebase';

function TwoFactorSetup() {
  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setupRecaptcha();
    const user = auth.currentUser;
    try {
      const session = await user.multiFactor.getSession();
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        { phoneNumber: phone, session },
        window.recaptchaVerifier
      );
      setVerificationId(verificationId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
      await auth.currentUser.multiFactor.enroll(multiFactorAssertion, 'Phone');
      alert('2FA enrolled successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Set Up Two-Factor Authentication</h2>
      {!verificationId ? (
        <form onSubmit={handleSendCode}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+12345678900"
            required
          />
          <button type="submit">Send Code</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter SMS Code"
            required
          />
          <button type="submit">Verify Code</button>
        </form>
      )}
      <div id="recaptcha-container"></div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default TwoFactorSetup;