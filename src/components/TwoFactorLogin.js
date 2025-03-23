import React, { useState } from 'react';
import { auth, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator } from '../firebase';
import { getMultiFactorResolver, signInWithEmailAndPassword } from 'firebase/auth';

function TwoFactorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [resolver, setResolver] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === 'auth/multi-factor-auth-required') {
        const mfaResolver = getMultiFactorResolver(auth, err);
        setResolver(mfaResolver);
        setupRecaptcha();
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        const verificationId = await phoneAuthProvider.verifyPhoneNumberWithMultiFactorInfo(
          mfaResolver.hints[0],
          window.recaptchaVerifier
        );
        setVerificationId(verificationId);
      } else {
        setError(err.message);
      }
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credential);
      await resolver.resolveSignIn(multiFactorAssertion);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Two-Factor Login</h2>
      {!verificationId ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
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

export default TwoFactorLogin;