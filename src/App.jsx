import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const C = {
  oliveDark: "#4a4a2e", olive: "#6b6b44", olivePale: "#f0ede0", oliveXpale: "#f8f6ef",
  terra: "#c17b5a", terraDark: "#9a5c3e", terraPale: "#faf0ea",
  cream: "#faf8f4", soft: "#9a9a80", mid: "#5a5a42", dark: "#1e1e14", white: "#ffffff",
  success: "#4a7c5a", successPale: "#edf5f0", warn: "#a06030", warnPale: "#fdf3e8",
  danger: "#a03030", dangerPale: "#fdf0f0", border: "rgba(107,107,68,0.15)",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

const btn = (type) => {
  const base = { padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .15s", border: "none" };
  const types = {
    primary: { background: C.olive, color: C.white },
    secondary: { background: C.oliveXpale, color: C.oliveDark, border: `0.5px solid ${C.border}` },
    danger: { background: C.dangerPale, color: C.danger, border: `0.5px solid rgba(160,48,48,0.2)` },
    success: { background: C.successPale, color: C.success, border: `0.5px solid rgba(74,122,90,0.3)` },
    warn: { background: C.warnPale, color: C.warn, border: `0.5px solid rgba(160,96,48,0.2)` },
  };
  return { ...base, ...types[type] };
};

const tag = (type) => {
  const types = {
    ok: { background: C.successPale, color: C.success },
    cancel: { background: C.dangerPale, color: C.danger },
    warn: { background: C.warnPale, color: C.warn },
    olive: { background: C.olivePale, color: C.oliveDark },
  };
  return { ...types[type], fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, whiteSpace: "nowrap" };
};

const card = { background: C.white, borderRadius: 14, border: `0.5px solid ${C.border}`, overflow: "hidden", marginBottom: 14 };

function Modal({ title, sub, onClose, children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,30,20,0.5)", zIndex: 300, display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: mobile ? "20px 20px 0 0" : 18, padding: mobile ? "0 20px 36px" : 28, width: mobile ? "100%" : 480, maxWidth: "100vw", maxHeight: "88vh", overflowY: "auto", position: "relative" }}>
        {mobile && <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 20px" }} />}
        <button onClick={onClose} style={{ position: "absolute", top: mobile ? 16 : 18, right: 18, background: "transparent", border: `0.5px solid ${C.border}`, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, color: C.soft }}>x</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.oliveDark, marginBottom: 4 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: C.soft, fontWeight: 300, marginBottom: 20 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: C.soft, marginBottom: 5 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "9px 12px", border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: C.dark, background: C.cream, outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

function Sidebar({ active, setActive, counts }) {
  const items = [
    { key: "avui", label: "Avui", section: "Principal" },
    { key: "alumnes", label: "Alumnes", section: "Gestio" },
    { key: "espera", label: "Llista d'espera", count: counts.espera },
    { key: "recuperacions", label: "Recuperacions", count: counts.recuperacions },
    { key: "canvis", label: "Canvis d'horari", count: counts.canvis },
  ];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", zIndex: 100 }}>
      <div style={{ padding: "28px 24px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.white }}>focus</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: "italic", color: "#d9a080", marginTop: 2 }}>et cuida.</div>
      </div>
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {items.map(item => (
          <div key={item.key}>
            {item.section && <div style={{ padding: "6px 16px 4px", fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 10 }}>{item.section}</div>}
            <div onClick={() => setActive(item.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", fontSize: 13, color: active === item.key ? C.white : "rgba(255,255,255,0.55)", cursor: "pointer", background: active === item.key ? "rgba(255,255,255,0.07)" : "transparent", borderLeft: active === item.key ? "2px solid #c17b5a" : "2px solid transparent", transition: "all .15s" }}>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count > 0 && <span style={{ background: C.terra, color: "white", fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 20 }}>{item.count}</span>}
            </div>
          </div>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.terraDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.white, flexShrink: 0 }}>R</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.white }}>Rosario</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Administradora</div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, setActive, counts }) {
  const items = [
    { key: "avui", label: "Avui", icon: "🏠" },
    { key: "alumnes", label: "Alumnes", icon: "👥" },
    { key: "espera", label: "Espera", icon: "⏳", count: counts.espera },
    { key: "recuperacions", label: "Gestio", icon: "↺", count: counts.recuperacions + counts.canvis },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `0.5px solid ${C.border}`, height: 60, zIndex: 100, display: "flex" }}>
      {items.map(item => (
        <button key={item.key} onClick={() => setActive(item.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: active === item.key ? C.oliveDark : C.soft }}>{item.label}</span>
          {item.count > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", background: C.terra, color: "white", fontSize: 9, fontWeight: 500, padding: "1px 5px", borderRadius: 20 }}>{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

function MobileTopbar({ onRefresh }) {
  return (
    <div style={{ background: C.oliveDark, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.white }}>focus <span style={{ fontStyle: "italic", fontWeight: 400, color: "#d9a080", fontSize: 14 }}>et cuida.</span></div>
      <button onClick={onRefresh} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: C.white, fontSize: 18 }}>↻</button>
    </div>
  );
}

function VistaAvui({ alumnes, espera, recuperacions, canvis, mobile }) {
  const today = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ marginBottom: mobile ? 16 : 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 20 : 22, fontWeight: 700, color: C.oliveDark }}>Bon dia, Rosario.</div>
        <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 4, textTransform: "capitalize" }}>{today}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 10 : 12, marginBottom: mobile ? 16 : 24 }}>
        {[
          { label: "Alumnes actives", value: alumnes.length, accent: true },
          { label: "Llista d'espera", value: espera.filter(e => e.estat === "esperant").length, color: C.terra },
          { label: "Recuperacions", value: recuperacions.filter(r => r.estat === "pendent").length, color: C.warn },
          { label: "Canvis horari", value: canvis.filter(c => c.estat === "pendent").length, color: C.olive },
        ].map(s => (
          <div key={s.label} style={{ background: s.accent ? C.oliveDark : C.white, borderRadius: 12, padding: mobile ? "14px" : "18px 20px", border: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: 9, letterSpacing: "2px", textTransform: "uppercase", color: s.accent ? "rgba(255,255,255,0.4)" : C.soft, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 28 : 32, fontWeight: 700, color: s.accent ? C.white : (s.color || C.oliveDark), lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ padding: "14px 18px", borderBottom: `0.5px solid ${C.border}`, fontSize: 14, fontWeight: 500, color: C.oliveDark }}>Alumnes recents</div>
        {alumnes.slice(0, 5).map((a, i, arr) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "11px 16px" : "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.oliveDark, flexShrink: 0 }}>{a.nom[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 11, color: C.soft }}>{a.telefon}</div>
            </div>
            <span style={tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
          </div>
        ))}
        {alumnes.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>Sense alumnes encara. Afegeix la primera!</div>}
      </div>
    </div>
  );
}

function VistaAlumnes({ alumnes, onRefresh, mobile }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = alumnes.filter(a => `${a.nom} ${a.cognom} ${a.telefon}`.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telefon son obligatoris");
    setLoading(true);
    const { error } = await supabase.from("alumnes").insert([{ ...form, activa: true }]);
    setLoading(false);
    if (error) return alert("Error: " + error.message);
    setShowModal(false);
    setForm({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
    onRefresh();
  }

  async function toggleActiva(a) {
    await supabase.from("alumnes").update({ activa: !a.activa }).eq("id", a.id);
    onRefresh();
  }

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: mobile ? 16 : 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark }}>Alumnes</div>
          <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 2 }}>{alumnes.length} registrades</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Nova</button>
      </div>
      <div style={card}>
        <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${C.border}`, background: C.oliveXpale }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nom o telefon..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: C.dark, boxSizing: "border-box" }} />
        </div>
        {filtered.map((a, i) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "12px 16px" : "13px 20px", borderBottom: i < filtered.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.oliveDark, flexShrink: 0 }}>{a.nom[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{a.telefon}</div>
              {a.notes && <div style={{ fontSize: 11, color: C.mid, fontStyle: "italic", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.notes}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
              <span style={tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
              <button style={{ ...btn(a.activa ? "danger" : "success"), padding: "4px 10px", fontSize: 10 }} onClick={() => toggleActiva(a)}>{a.activa ? "Baixa" : "Reactivar"}</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>{search ? "Cap resultat" : "Sense alumnes encara"}</div>}
      </div>
      {showModal && (
        <Modal title="Nova alumna" sub="Dona d'alta una nova alumna al centre" onClose={() => setShowModal(false)}>
          <Field label="Nom *" value={form.nom} onChange={v => setForm({ ...form, nom: v })} placeholder="Anna" />
          <Field label="Cognoms *" value={form.cognom} onChange={v => setForm({ ...form, cognom: v })} placeholder="Costa Puig" />
          <Field label="Telefon WhatsApp *" value={form.telefon} onChange={v => setForm({ ...form, telefon: v })} placeholder="+376 600 111" />
          <Field label="Email (opcional)" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="anna@gmail.com" />
          <Field label="Notes internes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Embaras, lesio esquena..." />
          <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>{loading ? "Creant..." : "Crear alumna"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VistaEspera({ espera, onRefresh, mobile }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", preferencia_horaria: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const actives = espera.filter(e => e.estat === "esperant" || e.estat === "avisada");

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telefon son obligatoris");
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

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: mobile ? 16 : 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark }}>Llista d'espera</div>
          <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 2 }}>{actives.length} persones esperant</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Afegir</button>
      </div>
      <div style={card}>
        {actives.map((e, i) => (
          <div key={e.id} style={{ padding: mobile ? "12px 16px" : "14px 20px", borderBottom: i < actives.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < 3 ? C.oliveDark : C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: i < 3 ? C.white : C.oliveDark, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{e.nom} {e.cognom}</div>
                <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{e.telefon}{e.preferencia_horaria ? " · " + e.preferencia_horaria : ""}</div>
                {e.notes && <div style={{ fontSize: 11, color: C.mid, fontStyle: "italic", marginTop: 2 }}>{e.notes}</div>}
              </div>
              <span style={tag(e.estat === "avisada" ? "warn" : "olive")}>{e.estat === "avisada" ? "Avisada" : "Esperant"}</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, marginLeft: 38 }}>
              {e.estat === "esperant" && <button style={{ ...btn("warn"), fontSize: 11, padding: "5px 12px" }} onClick={() => handleEstat(e.id, "avisada")}>Avisar</button>}
              <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => handleEstat(e.id, "descartada")}>Treure</button>
            </div>
          </div>
        ))}
        {actives.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>La llista d'espera esta buida</div>}
      </div>
      {showModal && (
        <Modal title="Afegir a la llista" sub="Persona que espera placa al centre" onClose={() => setShowModal(false)}>
          <Field label="Nom *" value={form.nom} onChange={v => setForm({ ...form, nom: v })} placeholder="Clara" />
          <Field label="Cognoms *" value={form.cognom} onChange={v => setForm({ ...form, cognom: v })} placeholder="Vidal" />
          <Field label="Telefon *" value={form.telefon} onChange={v => setForm({ ...form, telefon: v })} placeholder="+376 600 222" />
          <Field label="Preferencia horaria" value={form.preferencia_horaria} onChange={v => setForm({ ...form, preferencia_horaria: v })} placeholder="Matins, tardes..." />
          <Field label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Servei que demana..." />
          <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>{loading ? "Afegint..." : "Afegir"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VistaRecuperacions({ recuperacions, canvis, onRefresh, mobile }) {
  const [tab, setTab] = useState("recuperacions");
  const pendR = recuperacions.filter(r => r.estat === "pendent");
  const pendC = canvis.filter(c => c.estat === "pendent");

  async function aprovar(tabla, id) {
    await supabase.from(tabla).update({ estat: "aprovada" }).eq("id", id);
    onRefresh();
  }
  async function rebutjar(tabla, id) {
    await supabase.from(tabla).update({ estat: "rebutjada" }).eq("id", id);
    onRefresh();
  }

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark, marginBottom: 4 }}>Recuperacions i Canvis</div>
      <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginBottom: 16 }}>Sol.licituds pendents de les alumnes</div>
      <div style={{ display: "flex", gap: 0, background: C.white, borderRadius: 12, border: `0.5px solid ${C.border}`, padding: 4, marginBottom: 16, overflowX: "auto" }}>
        {[{ key: "recuperacions", label: "Recuperacions (" + pendR.length + ")" }, { key: "canvis", label: "Canvis (" + pendC.length + ")" }, { key: "historial", label: "Historial" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "7px 10px", borderRadius: 9, fontSize: mobile ? 11 : 13, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif", background: tab === t.key ? C.oliveDark : "transparent", color: tab === t.key ? C.white : C.soft, whiteSpace: "nowrap", transition: "all .15s" }}>{t.label}</button>
        ))}
      </div>
      {tab === "recuperacions" && (
        <div style={card}>
          {pendR.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>No hi ha recuperacions pendents</div>}
          {pendR.map((r, i) => (
            <div key={r.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: i < pendR.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>Sol.licitud de recuperacio</div>
                <span style={tag("warn")}>Pendent</span>
              </div>
              {r.data_proposta_alumna && <div style={{ fontSize: 12, color: C.soft, marginBottom: 10 }}>Proposta: {r.data_proposta_alumna}</div>}
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btn("success"), fontSize: 11, padding: "5px 12px" }} onClick={() => aprovar("recuperacions", r.id)}>Aprovar</button>
                <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => rebutjar("recuperacions", r.id)}>Rebutjar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "canvis" && (
        <div style={card}>
          {pendC.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>No hi ha canvis pendents</div>}
          {pendC.map((c, i) => (
            <div key={c.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: i < pendC.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>Canvi d'horari</div>
                <span style={tag("warn")}>Pendent</span>
              </div>
              {c.nota_alumna && <div style={{ fontSize: 12, color: C.mid, marginBottom: 10, fontStyle: "italic" }}>{c.nota_alumna}</div>}
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{ ...btn("success"), fontSize: 11, padding: "5px 12px" }} onClick={() => aprovar("canvis_horari", c.id)}>Aprovar</button>
                <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => rebutjar("canvis_horari", c.id)}>Rebutjar</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "historial" && (
        <div style={card}>
          {[...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].length === 0
            ? <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>L'historial es buit</div>
            : [...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].map((item, i, arr) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "11px 16px" : "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{"data_proposta_alumna" in item ? "Recuperacio" : "Canvi d'horari"}</div>
                  <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{new Date(item.created_at).toLocaleDateString("ca-ES")}</div>
                </div>
                <span style={tag(item.estat === "aprovada" ? "ok" : "cancel")}>{item.estat.charAt(0).toUpperCase() + item.estat.slice(1)}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("avui");
  const [alumnes, setAlumnes] = useState([]);
  const [espera, setEspera] = useState([]);
  const [recuperacions, setRecuperacions] = useState([]);
  const [canvis, setCanvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const mobile = useIsMobile();

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
    espera: espera.filter(e => e.estat === "esperant").length,
    recuperacions: recuperacions.filter(r => r.estat === "pendent").length,
    canvis: canvis.filter(c => c.estat === "pendent").length,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.oliveXpale, minHeight: "100vh", color: C.dark }}>
        {mobile ? (
          <>
            <MobileTopbar onRefresh={fetchAll} />
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.soft, fontStyle: "italic" }}>Carregant...</div>
              </div>
            ) : (
              <>
                {active === "avui" && <VistaAvui alumnes={alumnes} espera={espera} recuperacions={recuperacions} canvis={canvis} mobile />}
                {active === "alumnes" && <VistaAlumnes alumnes={alumnes} onRefresh={fetchAll} mobile />}
                {active === "espera" && <VistaEspera espera={espera} onRefresh={fetchAll} mobile />}
                {(active === "recuperacions" || active === "canvis") && <VistaRecuperacions recuperacions={recuperacions} canvis={canvis} onRefresh={fetchAll} mobile />}
              </>
            )}
            <BottomNav active={active} setActive={setActive} counts={counts} />
          </>
        ) : (
          <>
            <Sidebar active={active} setActive={setActive} counts={counts} />
            <main style={{ marginLeft: 220, minHeight: "100vh" }}>
              <div style={{ background: C.white, borderBottom: `0.5px solid ${C.border}`, padding: "0 32px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.oliveDark }}>focus benestar</div>
                  <div style={{ fontSize: 12, color: C.soft, fontWeight: 300 }}>Panel d'administracio · Rosario</div>
                </div>
                <button style={btn("primary")} onClick={fetchAll}>Actualitzar</button>
              </div>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.soft, fontStyle: "italic" }}>Carregant...</div>
                </div>
              ) : (
                <>
                  {active === "avui" && <VistaAvui alumnes={alumnes} espera={espera} recuperacions={recuperacions} canvis={canvis} mobile={false} />}
                  {active === "alumnes" && <VistaAlumnes alumnes={alumnes} onRefresh={fetchAll} mobile={false} />}
                  {active === "espera" && <VistaEspera espera={espera} onRefresh={fetchAll} mobile={false} />}
                  {(active === "recuperacions" || active === "canvis") && <VistaRecuperacions recuperacions={recuperacions} canvis={canvis} onRefresh={fetchAll} mobile={false} />}
                </>
              )}
            </main>
          </>
        )}
      </div>
    </>
  );
}
