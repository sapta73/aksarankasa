import React, { useState } from "react";
import { supabase } from "../supabase/config";

function TeacherLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      onLoginSuccess();
    } catch (err) {
      setError("Email atau password salah. Silakan coba lagi.");
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">AKSARANKASA</h1>
      <h2
        style={{
          textAlign: "center",
          color: "var(--text-light)",
          marginTop: "-1.5rem",
          fontFamily: "var(--font-body)",
          fontWeight: "400",
        }}
      >
        Portal Guru
      </h2>
      <form onSubmit={handleLogin} style={{ width: "100%" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Masukkan email guru"
          />
        </div>
        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Masukkan password"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Memproses..." : "Login"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
export default TeacherLogin;
