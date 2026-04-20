"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setShake(true);
      setPassword("");
      setTimeout(() => setShake(false), 600);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="login-root">
      {/* Animated grid background */}
      <div className="grid-bg" aria-hidden />

      {/* Glow orbs */}
      <div className="orb orb-blue" aria-hidden />
      <div className="orb orb-green" aria-hidden />

      <div className={`login-card ${shake ? "shake" : ""}`}>
        {/* Top accent bar */}
        <div className="accent-bar" aria-hidden />

        {/* Logos */}
        <div className="logos">
          <Image
            src="/logo-sistran.png"
            alt="Sistran"
            width={90}
            height={28}
            className="logo"
            style={{ filter: "brightness(0) invert(1)" }}
            unoptimized
          />
          <span className="logo-sep">×</span>
          <Image
            src="/logo-lumina-branca.png"
            alt="Lumina AI"
            width={80}
            height={24}
            className="logo"
            unoptimized
          />
        </div>

        {/* Heading */}
        <div className="heading-group">
          <p className="eyebrow">ACESSO RESTRITO</p>
          <h1 className="heading">DBS</h1>
          <p className="subheading">Transformação Tecnológica · Assurant Brasil</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          <div className={`input-wrap ${error ? "input-error" : ""}`}>
            <svg className="lock-icon" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Senha de acesso"
              className="password-input"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="error-msg">Senha incorreta. Tente novamente.</p>
          )}

          <button type="submit" disabled={loading || !password} className="submit-btn">
            {loading ? (
              <span className="spinner" aria-hidden />
            ) : (
              <>
                <span>Acessar</span>
                <svg viewBox="0 0 20 20" fill="none" className="arrow-icon">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="card-footer">
          Documentação técnica · Uso interno
        </p>
      </div>

      <style jsx>{`
        .login-root {
          min-height: 100vh;
          background: #050d18;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: var(--font-geist-sans, system-ui, sans-serif);
        }

        /* Grid background */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,120,212,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,120,212,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* Glow orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          pointer-events: none;
        }
        .orb-blue {
          width: 500px;
          height: 500px;
          background: #0078d4;
          top: -100px;
          left: -100px;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb-green {
          width: 400px;
          height: 400px;
          background: #107c10;
          bottom: -80px;
          right: -80px;
          animation: drift 15s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift {
          from { transform: translate(0, 0); }
          to { transform: translate(40px, 30px); }
        }

        /* Card */
        .login-card {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(0,120,212,0.1),
            0 24px 64px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06);
          animation: card-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Shake animation */
        .shake {
          animation: shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }

        .accent-bar {
          position: absolute;
          top: 0;
          left: 2rem;
          right: 2rem;
          height: 2px;
          border-radius: 0 0 4px 4px;
          background: linear-gradient(90deg, #0078d4, #107c10);
        }

        /* Logos */
        .logos {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2rem;
        }
        .logo { opacity: 0.9; }
        .logo-sep {
          color: rgba(255,255,255,0.25);
          font-size: 1rem;
        }

        /* Heading */
        .heading-group {
          margin-bottom: 2rem;
        }
        .eyebrow {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #0078d4;
          margin-bottom: 0.4rem;
        }
        .heading {
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0 0 0.4rem;
        }
        .subheading {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        /* Form */
        .form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-wrap:focus-within {
          border-color: rgba(0,120,212,0.6);
          box-shadow: 0 0 0 3px rgba(0,120,212,0.12);
        }
        .input-error {
          border-color: rgba(220,38,38,0.5) !important;
          box-shadow: 0 0 0 3px rgba(220,38,38,0.1) !important;
        }

        .lock-icon {
          width: 16px;
          height: 16px;
          color: rgba(255,255,255,0.3);
          flex-shrink: 0;
        }

        .password-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 0.9rem;
          padding: 0.85rem 0;
          font-family: inherit;
        }
        .password-input::placeholder {
          color: rgba(255,255,255,0.25);
        }
        .password-input:disabled {
          opacity: 0.5;
        }

        .error-msg {
          font-size: 0.75rem;
          color: #f87171;
          text-align: center;
          animation: fade-in 0.2s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Button */
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #0078d4, #0062b0);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          padding: 0.85rem;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 16px rgba(0,120,212,0.3);
          margin-top: 0.25rem;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,120,212,0.4);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .arrow-icon {
          width: 16px;
          height: 16px;
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer */
        .card-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
