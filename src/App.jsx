import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const COLORS = {
  oliveDark: "#4a4a2e",
  olive: "#6b6b44",
  olivePale: "#f0ede0",
  oliveXpale: "#f8f6ef",
  terra: "#c17b5a",
  terraDark: "#9a5c3e",
  terraPale: "#faf0ea",
  cream: "#faf8f4",
  soft: "#9a9a80",
  mid: "#5a5a42",
  dark: "#1e1e14",
  white: "#ffffff",
  success: "#4a7c5a",
  successPale: "#edf5f0",
  warn: "#a06030",
  warnPale: "#fdf3e8",
  danger: "#a03030",
  dangerPale: "#fdf0f0",
  border: "rgba(107,107,68,0.15)",
};

const S = {
  app: {
    fontFamily: "'DM Sans', sans-serif",
    background: COLORS.oliveXpale,
    minHeight: "100vh",
    color: COLORS.dark,
  },
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: 220,
    height: "100vh",
    background: COLORS.oliveDark,
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    overflow: "hidden",
  },
  sbLogo: {
    padding: "28px 24px 24px",
    borderBottom: "0.5px solid rgba(255,255,255,0.08)",
  },
  sbLogoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.white,
    lineHeight: 1,
  },
  sbLogoTag: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 13,
    fontStyle: "italic",
    color: "#d9a080",
    marginTop: 2,
  },
  sbNav: { flex: 1, padding: "16px 0", overflowY: "auto" },
  sbSection: {
    padding: "6px 16px 4px",
    fontSize: 9,
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.25)",
    marginTop: 10,
  },
  sbItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 20px",
    fontSize: 13,
    color: active ? COLORS.white : "rgba(255,255,255,0.55)",
    cursor: "pointer",
    background: active ? "rgba(255,255,255,0.07)" : "transparent",
    borderLeft: active ? `2px solid ${COLORS.terra}` : "2px solid transparent",
    textDecoration: "none",
    transition: "all .15s",
  }),
  sbBottom: {
    padding: "16px 20px",
    borderTop: "0.5px solid rgba(255,255,255,0.08)",
  },
  sbUser: { display: "flex", alignItems: "center", gap: 10 },
  sbAvatar: {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: COLORS.terraDark,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.white,
    flexShrink: 0,
  },
  main: { marginLeft: 220, minHeight: "100vh" },
  topbar: {
    background: COLORS.white,
    borderBottom: `0.5px solid ${COLORS.border}`,
    padding: "0 32px",
    height: 58,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  topbarTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: COLORS.oliveDark,
  },
  topbarDate: { fontSize: 12, color: COLORS.soft, fontWeight: 300 },
  content: { padding: "28px 32px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 12,
    marginBottom: 24,
  },
  statCard: (accent) => ({
    background: accent ? COLORS.oliveDark : COLORS.white,
    borderRadius: 12,
    padding: "18px 20px",
    border: `0.5px solid ${COLORS.border}`,
  }),
  statLabel: (accent) => ({
    fontSize: 10,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: accent ? "rgba(255,255,255,0.4)" : COLORS.soft,
    marginBottom: 8,
  }),
  statValue: (accent, color) => ({
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 700,
    color: accent ? COLORS.white : color || COLORS.oliveDark,
    lineHeight: 1,
  }),
  statSub: (accent) => ({
    fontSize: 11,
    color: accent ? "rgba(255,255,255,0.35)" : COLORS.soft,
    marginTop: 5,
    fontWeight: 300,
  }),
  card: {
    background: COLORS.white,
    borderRadius: 14,
    border: `0.5px solid ${COLORS.border}`,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: `0.5px solid ${COLORS.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { fontSize: 14, fontWeight: 500, color: COLORS.oliveDark },
  btn: (type) => {
    const styles = {
      primary: { background: COLORS.olive, color: COLORS.white, border: "none" },
      secondary: { background: COLORS.oliveXpale, color: COLORS.oliveDark, border: `0.5px solid ${COLORS.border}` },
      danger: { background: COLORS.dangerPale, color: COLORS.danger, border: `0.5px solid rgba(160,48,48,0.2)` },
      success: { background: COLORS.successPale, color: COLORS.success, border: `0.5px solid rgba(74,122,90,0.3)` },
      warn: { background: COLORS.warnPale, color: COLORS.warn, border: `0.5px solid rgba(160,96,48,0.2)` },
    };
    return {
      ...styles[type],
      padding: "7px 14px",
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      transition: "all .15s",
    };
  },
  tag: (type) => {
    const styles = {
      ok: { background: COLORS.successPale, color: COLORS.success },
      cancel: { background: COLORS.dangerPale, color: COLORS.danger },
      warn: { background: COLORS.warnPale, color: COLORS.warn },
      olive: { background: COLORS.olivePale, color: COLORS.oliveDark },
    };
    return {
      ...styles[type],
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 20,
      fontWeight: 500,
      whiteSpace: "nowrap",
    };
  },
};

// ─── COMPONENTS ───────────────────────────────────────────

function Sidebar({ active, setActive, counts }) {
  const items = [
    { key: "avui", label: "Avui", section: "Principal" },
    { key: "alumnes", label: "Alumnes", section: null },
    { key: "espera", label: "Llista d'espera", section: null, count: counts.espera },
    { key: "recuperacions", label: "Recuperacions", section: "Gestió", count: counts.recuperacions },
    { key: "canvis", label: "Canvis d'horari", section: null, count: counts.canvis },
  ];

  return (
    <div style={S.sidebar}>
      <div style={S.sbLogo}>
        <div style={S.sbLogoText}>focus</div>
        <div style={S.sbLogoTag}>et cuida.</div>
      </div>
      <nav style={S.sbNav}>
        {items.map((item) => (
          <div key={item.key}>
            {item.section && <div style={S.sbSection}>{item.section}</div>}
            <div style={S.sbItem(active === item.key)} onClick={() => setActive(item.key)}>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count > 0 && (
                <span style={{ background: COLORS.terra, color: "white", fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 20 }}>
                  {item.count}
                </span>
              )}
            </div>
          </div>
        ))}
      </nav>
      <div style={S.sbBottom}>
        <div style={S.sbUser}>
          <div style={S.sbAvatar}>R</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.white }}>Rosario</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Administradora</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA AVUI ───────────────────────────────────────────

function VistaAvui({ alumnes, espera, recuperacions, canvis }) {
  const today = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={S.content}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.oliveDark }}>
          Bon dia, Rosario.
        </div>
        <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginTop: 4, textTransform: "capitalize" }}>{today}</div>
      </div>

      <div style={S.statsRow}>
        <div style={S.statCard(true)}>
          <div style={S.statLabel(true)}>Alumnes actives</div>
          <div style={S.statValue(true)}>{alumnes.length}</div>
          <div style={S.statSub(true)}>al centre</div>
        </div>
        <div style={S.statCard(false)}>
          <div style={S.statLabel(false)}>Llista d'espera</div>
          <div style={S.statValue(false, COLORS.terra)}>{espera.length}</div>
          <div style={S.statSub(false)}>persones esperant</div>
        </div>
        <div style={S.statCard(false)}>
          <div style={S.statLabel(false)}>Recuperacions</div>
          <div style={S.statValue(false, COLORS.warn)}>{recuperacions.filter(r => r.estat === "pendent").length}</div>
          <div style={S.statSub(false)}>pendents d'aprovar</div>
        </div>
        <div style={S.statCard(false)}>
          <div style={S.statLabel(false)}>Canvis d'horari</div>
          <div style={S.statValue(false, COLORS.olive)}>{canvis.filter(c => c.estat === "pendent").length}</div>
          <div style={S.statSub(false)}>pendents de revisió</div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.cardHeader}>
          <div style={S.cardTitle}>Alumnes recents</div>
        </div>
        {alumnes.slice(0, 5).map((a) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", borderBottom: `0.5px solid ${COLORS.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: COLORS.oliveDark, flexShrink: 0 }}>
              {a.nom[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.dark }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 11, color: COLORS.soft, fontWeight: 300 }}>{a.telefon}</div>
            </div>
            <span style={S.tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
          </div>
        ))}
        {alumnes.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
            Encara no hi ha alumnes. Afegeix la primera!
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VISTA ALUMNES ─────────────────────────────────────────

function VistaAlumnes({ alumnes, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = alumnes.filter(a =>
    `${a.nom} ${a.cognom} ${a.telefon}`.toLowerCase().includes(search.toLowerCase())
  );

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telèfon són obligatoris");
    setLoading(true);
    const { error } = await supabase.from("alumnes").insert([{ ...form, activa: true }]);
    setLoading(false);
    if (error) return alert("Error: " + error.message);
    setShowModal(false);
    setForm({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
    onRefresh();
  }

  async function toggleActiva(alumna) {
    await supabase.from("alumnes").update({ activa: !alumna.activa }).eq("id", alumna.id);
    onRefresh();
  }

  return (
    <div style={S.content}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.oliveDark }}>Alumnes</div>
          <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginTop: 2 }}>{alumnes.length} alumnes registrades</div>
        </div>
        <button style={S.btn("primary")} onClick={() => setShowModal(true)}>+ Nova alumna</button>
      </div>

      <div style={S.card}>
        <div style={{ padding: "12px 20px", borderBottom: `0.5px solid ${COLORS.border}`, background: COLORS.oliveXpale }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per nom, telèfon..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${COLORS.border}`, background: COLORS.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: COLORS.dark }}
          />
        </div>
        {filtered.map((a, i) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < filtered.length - 1 ? `0.5px solid ${COLORS.border}` : "none", transition: "background .15s" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: COLORS.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: COLORS.oliveDark, flexShrink: 0 }}>
              {a.nom[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginTop: 2 }}>{a.telefon}{a.email ? ` · ${a.email}` : ""}</div>
              {a.notes && <div style={{ fontSize: 11, color: COLORS.mid, fontStyle: "italic", marginTop: 2 }}>{a.notes}</div>}
            </div>
            <span style={S.tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
            <button style={S.btn(a.activa ? "danger" : "success")} onClick={() => toggleActiva(a)}>
              {a.activa ? "Donar de baixa" : "Reactivar"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
            {search ? "Cap resultat per aquesta cerca" : "Encara no hi ha alumnes"}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(30,30,20,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: COLORS.white, borderRadius: 18, padding: 28, width: 460, maxWidth: "90vw", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 18, right: 18, background: "transparent", border: `0.5px solid ${COLORS.border}`, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, color: COLORS.soft }}>✕</button>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.oliveDark, marginBottom: 4 }}>Nova alumna</div>
            <div style={{ fontSize: 13, color: COLORS.soft, fontWeight: 300, marginBottom: 20 }}>Dona d'alta una nova alumna al centre</div>
            {[
              { key: "nom", label: "Nom *", placeholder: "Anna" },
              { key: "cognom", label: "Cognoms *", placeholder: "Costa Puig" },
              { key: "telefon", label: "Telèfon WhatsApp *", placeholder: "+376 600 111" },
              { key: "email", label: "Email (opcional)", placeholder: "anna@gmail.com" },
              { key: "notes", label: "Notes internes", placeholder: "Embaràs, lesió esquena..." },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.soft, marginBottom: 5 }}>{field.label}</div>
                <input
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: `0.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: COLORS.dark, background: COLORS.cream, outline: "none" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${COLORS.border}` }}>
              <button style={{ ...S.btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel·lar</button>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>
                {loading ? "Creant..." : "Crear alumna"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA ESPERA ──────────────────────────────────────────

function VistaEspera({ espera, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", preferencia_horaria: "", notes: "" });
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telèfon són obligatoris");
    setLoading(true);
    const { error } = await supabase.from("llista_espera").insert([{ ...form, estat: "esperant", ordre: espera.length + 1 }]);
    setLoading(false);
    if (error) return alert("Error: " + error.message);
    setShowModal(false);
    setForm({ nom: "", cognom: "", telefon: "", preferencia_horaria: "", notes: "" });
    onRefresh();
  }

  async function handleEstat(id, estat) {
    await supabase.from("llista_espera").update({ estat }).eq("id", id);
    onRefresh();
  }

  const actives = espera.filter(e => e.estat === "esperant" || e.estat === "avisada");

  return (
    <div style={S.content}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.oliveDark }}>Llista d'espera</div>
          <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginTop: 2 }}>{actives.length} persones esperant plaça</div>
        </div>
        <button style={S.btn("primary")} onClick={() => setShowModal(true)}>+ Afegir a la llista</button>
      </div>

      <div style={S.card}>
        {actives.map((e, i) => (
          <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 20px", borderBottom: i < actives.length - 1 ? `0.5px solid ${COLORS.border}` : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: i < 3 ? COLORS.oliveDark : COLORS.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: i < 3 ? COLORS.white : COLORS.oliveDark, flexShrink: 0, marginTop: 2 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark, marginBottom: 2 }}>{e.nom} {e.cognom}</div>
              <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginBottom: 4 }}>{e.telefon}{e.preferencia_horaria ? ` · ${e.preferencia_horaria}` : ""}</div>
              {e.notes && <div style={{ fontSize: 11, color: COLORS.mid, fontStyle: "italic" }}>{e.notes}</div>}
            </div>
            <span style={S.tag(e.estat === "avisada" ? "warn" : "olive")}>{e.estat === "avisada" ? "Avisada" : "Esperant"}</span>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {e.estat === "esperant" && (
                <button style={S.btn("warn")} onClick={() => handleEstat(e.id, "avisada")}>Avisar</button>
              )}
              <button style={S.btn("danger")} onClick={() => handleEstat(e.id, "descartada")}>Treure</button>
            </div>
          </div>
        ))}
        {actives.length === 0 && (
          <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
            La llista d'espera està buida
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(30,30,20,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: COLORS.white, borderRadius: 18, padding: 28, width: 460, maxWidth: "90vw", position: "relative" }}>
            <button onClick={() => setShowModal(false)} style={{ position: "absolute", top: 18, right: 18, background: "transparent", border: `0.5px solid ${COLORS.border}`, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, color: COLORS.soft }}>✕</button>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.oliveDark, marginBottom: 4 }}>Afegir a la llista</div>
            <div style={{ fontSize: 13, color: COLORS.soft, fontWeight: 300, marginBottom: 20 }}>Persona que espera plaça al centre</div>
            {[
              { key: "nom", label: "Nom *", placeholder: "Clara" },
              { key: "cognom", label: "Cognoms *", placeholder: "Vidal" },
              { key: "telefon", label: "Telèfon *", placeholder: "+376 600 222" },
              { key: "preferencia_horaria", label: "Preferència horària", placeholder: "Matins, tardes, qualsevol..." },
              { key: "notes", label: "Notes", placeholder: "Servei que demana, observacions..." },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: COLORS.soft, marginBottom: 5 }}>{field.label}</div>
                <input
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{ width: "100%", padding: "9px 12px", border: `0.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: COLORS.dark, background: COLORS.cream, outline: "none" }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${COLORS.border}` }}>
              <button style={{ ...S.btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel·lar</button>
              <button style={{ ...S.btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>
                {loading ? "Afegint..." : "Afegir a la llista"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VISTA RECUPERACIONS ───────────────────────────────────

function VistaRecuperacions({ recuperacions, canvis, onRefresh }) {
  const [tab, setTab] = useState("recuperacions");

  const pendentsRecup = recuperacions.filter(r => r.estat === "pendent");
  const pendentsCanvis = canvis.filter(c => c.estat === "pendent");

  async function aprovarRecup(id) {
    await supabase.from("recuperacions").update({ estat: "aprovada" }).eq("id", id);
    onRefresh();
  }

  async function rebutjarRecup(id) {
    await supabase.from("recuperacions").update({ estat: "rebutjada" }).eq("id", id);
    onRefresh();
  }

  async function aprovarCanvi(id) {
    await supabase.from("canvis_horari").update({ estat: "aprovada" }).eq("id", id);
    onRefresh();
  }

  async function rebutjarCanvi(id) {
    await supabase.from("canvis_horari").update({ estat: "rebutjada" }).eq("id", id);
    onRefresh();
  }

  return (
    <div style={S.content}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: COLORS.oliveDark, marginBottom: 4 }}>Recuperacions i Canvis</div>
      <div style={{ fontSize: 12, color: COLORS.soft, fontWeight: 300, marginBottom: 24 }}>Sol·licituds pendents de les alumnes</div>

      <div style={{ display: "flex", gap: 0, background: COLORS.white, borderRadius: 14, border: `0.5px solid ${COLORS.border}`, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {[
          { key: "recuperacions", label: `Recuperacions (${pendentsRecup.length})` },
          { key: "canvis", label: `Canvis d'horari (${pendentsCanvis.length})` },
          { key: "historial", label: "Historial" },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif", background: tab === t.key ? COLORS.oliveDark : "transparent", color: tab === t.key ? COLORS.white : COLORS.soft, transition: "all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "recuperacions" && (
        <div style={S.card}>
          {pendentsRecup.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
              No hi ha recuperacions pendents
            </div>
          )}
          {pendentsRecup.map((r, i) => (
            <div key={r.id} style={{ padding: "16px 20px", borderBottom: i < pendentsRecup.length - 1 ? `0.5px solid ${COLORS.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark }}>Sol·licitud de recuperació</div>
                <span style={S.tag("warn")}>Pendent</span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.soft, marginBottom: 12 }}>
                {r.data_proposta_alumna && `Proposta: ${r.data_proposta_alumna}`}
                {r.data_caducitat && ` · Caduca: ${r.data_caducitat}`}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={S.btn("success")} onClick={() => aprovarRecup(r.id)}>Aprovar</button>
                <button style={S.btn("danger")} onClick={() => rebutjarRecup(r.id)}>Rebutjar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "canvis" && (
        <div style={S.card}>
          {pendentsCanvis.length === 0 && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
              No hi ha canvis d'horari pendents
            </div>
          )}
          {pendentsCanvis.map((c, i) => (
            <div key={c.id} style={{ padding: "16px 20px", borderBottom: i < pendentsCanvis.length - 1 ? `0.5px solid ${COLORS.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.dark }}>Sol·licitud de canvi d'horari</div>
                <span style={S.tag("warn")}>Pendent</span>
              </div>
              {c.nota_alumna && <div style={{ fontSize: 12, color: COLORS.mid, marginBottom: 12, fontStyle: "italic" }}>{c.nota_alumna}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button style={S.btn("success")} onClick={() => aprovarCanvi(c.id)}>Aprovar</button>
                <button style={S.btn("danger")} onClick={() => rebutjarCanvi(c.id)}>Rebutjar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "historial" && (
        <div style={S.card}>
          {[...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center", color: COLORS.soft, fontSize: 13, fontStyle: "italic" }}>
              L'historial és buit
            </div>
          ) : (
            [...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].map((item, i, arr) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${COLORS.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.dark }}>
                    {"data_proposta_alumna" in item ? "Recuperació" : "Canvi d'horari"}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.soft, fontWeight: 300, marginTop: 1 }}>
                    {new Date(item.created_at).toLocaleDateString("ca-ES")}
                  </div>
                </div>
                <span style={S.tag(item.estat === "aprovada" ? "ok" : "cancel")}>
                  {item.estat.charAt(0).toUpperCase() + item.estat.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ─────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState("avui");
  const [alumnes, setAlumnes] = useState([]);
  const [espera, setEspera] = useState([]);
  const [recuperacions, setRecuperacions] = useState([]);
  const [canvis, setCanvis] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    const [a, e, r, c] = await Promise.all([
      supabase.from("alumnes").select("*").order("created_at", { ascending: false }),
      supabase.from("llista_espera").select("*").order("ordre", { ascending: true }),
      supabase.from("recuperacions").select("*").order("created_at", { ascending: false }),
      supabase.from("canvis_horari").select("*").order("created_at", { ascending: false }),
    ]);
    if (a.data) setAlumnes(a.data);
    if (e.data) setEspera(e.data);
    if (r.data) setRecuperacions(r.data);
    if (c.data) setCanvis(c.data);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  const counts = {
    espera: espera.filter(e => e.estat === "esperant" || e.estat === "avisada").length,
    recuperacions: recuperacions.filter(r => r.estat === "pendent").length,
    canvis: canvis.filter(c => c.estat === "pendent").length,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={S.app}>
        <Sidebar active={active} setActive={setActive} counts={counts} />
        <main style={S.main}>
          <div style={S.topbar}>
            <div>
              <div style={S.topbarTitle}>focus benestar</div>
              <div style={S.topbarDate}>Panel d'administració · Rosario</div>
            </div>
            <button style={S.btn("primary")} onClick={fetchAll}>↻ Actualitzar</button>
          </div>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: COLORS.soft, fontStyle: "italic" }}>Carregant...</div>
            </div>
          ) : (
            <>
              {active === "avui" && <VistaAvui alumnes={alumnes} espera={espera} recuperacions={recuperacions} canvis={canvis} />}
              {active === "alumnes" && <VistaAlumnes alumnes={alumnes} onRefresh={fetchAll} />}
              {active === "espera" && <VistaEspera espera={espera} onRefresh={fetchAll} />}
              {(active === "recuperacions" || active === "canvis") && <VistaRecuperacions recuperacions={recuperacions} canvis={canvis} onRefresh={fetchAll} />}
            </>
          )}
        </main>
      </div>
    </>
  );
}
