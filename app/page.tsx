"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// ===================== SLIDE DATA =====================
const slides = [
  { id: "hero", type: "hero" },
  { id: "vision", type: "vision" },
  { id: "architecture", type: "architecture" },
  { id: "ai-module", type: "ai" },
  { id: "system-text", type: "systemtext" },
  {
    id: "nagy-sandor",
    type: "person",
    name: "Nagy Sándor",
    index: 1,
    benefits: [
      "Pályázati anyagok, szerződések, dokumentumok, okiratok összeállítása során nagyobb mértékű átláthatóság",
      "Adatbázisok feldolgozásának gyorsítása, adatbázisokból ábrák készítése",
      "Idegen nyelvű okiratok fordítása",
      "Pénzügyi elemzések és mutatók vizsgálata",
      "Oktatási segédanyagok készítése",
      "Szakmai tevékenység, KPI-ok elemzése",
      "Jogszabályok változásának nyomon követése",
      "Közbeszerzési eljárás során árindoklások elkészítése",
    ],
  },
  {
    id: "vonhaz-david",
    type: "person",
    name: "Vonház Dávid",
    index: 2,
    benefits: [
      "Pályázati anyagok összeállítása során nagyobb mértékű átláthatóság",
      "Adatbázisok feldolgozásának gyorsítása, ábrák készítése",
      "Idegen nyelvű okiratok fordítása",
      "Belső ellenőri tevékenység során beérkező adatok gyorsabb és precízebb feldolgozása",
      "Esetleges hiányosságok felfedése",
      "Javaslattételhez való nagymértékű segítség",
      "Jogszabályok változásának nyomon követése",
    ],
  },
  {
    id: "kelemen-imre",
    type: "person",
    name: "Kelemen Imre",
    index: 3,
    benefits: [
      "Az egyes objektumok külön-külön ellenőrizhető statisztikái, jelenlétek, beosztások átláthatóbb kezelése",
      "Munkaidőkeret hatékonyabb kihasználása",
      "A beérkező dokumentumok digitalizációjának elősegítése",
      "Jogszabályok változásának nyomon követése",
      "Nagyobb mennyiségű adat gyorsabb feldolgozása",
      "Eltérések és hibák kiszűrése",
    ],
  },
  {
    id: "nagy-kristof",
    type: "person",
    name: "Nagy Kristóf",
    index: 4,
    benefits: [
      "Az egyes rendezvények ütemezése, szükséges felszerelések kimutatása és állapotuk felügyelete",
      "Óraszám optimalizálás és tervezés",
      "Jogszabályok változásának nyomon követése",
      "Járulékos költségek számítása (logisztika, védőital, bejelentések, kifizetések stb.)",
    ],
  },
  {
    id: "tarnoczi-zsofia",
    type: "person",
    name: "Tarnóczi Zsófia",
    index: 5,
    benefits: [
      "HR iratok digitalizálása",
      "Munkavállalók nyomon követése, kezelése",
      "Automatizált felvételi eljárás",
      "Jogszabályok változásának nyomon követése, azok értelmezése",
      "Álláshirdetések megfogalmazása, munkaköri leírások megfogalmazása",
      "Munkaidő-nyilvántartások kiértékelése",
    ],
  },
  {
    id: "palfalvine",
    type: "person",
    name: "Pálfalviné Karaszek Nóra",
    index: 6,
    benefits: [
      "Szerződésnyilvántartás vezetése",
      "Lőfegyver-nyilvántartás vezetése",
      "Iktatási dokumentumok vezetése",
      "Születésnapok, névnapok, évfordulók számon tartása és értesítések küldése",
      "Eszköznyilvántartások vezetése (telefon, laptop, SIM-kártya)",
    ],
  },
  {
    id: "karai-ibolya",
    type: "person",
    name: "Kárai Ibolya",
    index: 7,
    benefits: [
      "Gépjárművekkel kapcsolatos folyamatok, szervizek, szerződések nyilvántartása",
      "Beszerzésekkel kapcsolatos megrendelések, raktárgazdálkodás",
      "Alvállalkozók rendszereinek rendezése",
      "Készlet nyilvántartás, selejtezés, leltározás",
      "Biztosítások, ingatlanok, közmű, hatóságokkal való kapcsolattartás",
    ],
  },
  {
    id: "orosz-laszlo",
    type: "person",
    name: "Orosz László / Gazdasági osztály",
    index: 8,
    benefits: [
      "Saját alkalmazottakkal végzett vagyonvédelmi tevékenység elemzése",
      "Alvállalkozóval végzett vagyonvédelmi tevékenység elemzése",
      "Havi eredmény elemzése, kimutatások készítése",
      "Főkönyvi karton elemzése",
      "KSH statisztikák készítésében való segítség",
    ],
  },
  {
    id: "bali-emese",
    type: "person",
    name: "Bali Emese",
    index: 9,
    benefits: [
      "Pályázati anyagok összeállítása során nagyobb mértékű átláthatóság",
      "Készülékek kompatibilitásának ellenőrzése",
      "Szerelők leterheltségének kimutatása",
    ],
  },
  {
    id: "banhidi-jozsef",
    type: "person",
    name: "Bánhidi József",
    index: 10,
    benefits: [
      "Szabványok összehasonlíthatóságában, megfelelésében való segítség",
      "Adatkezelés és adatfeldolgozás",
      "ESG technikai eszközök összehasonlítása, kiválasztása",
      "Információbiztonsági lehetőségek",
    ],
  },
  { id: "company", type: "company" },
  { id: "closing", type: "closing" },
];

// ===================== MAIN =====================
export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      if (transitioning) return;
      const target = Math.max(0, Math.min(total - 1, index));
      if (target === current) return;
      setTransitioning(true);
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
      setTimeout(() => {
        setCurrent(target);
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
        setTimeout(() => setTransitioning(false), 350);
      }, 250);
    },
    [transitioning, current, total]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) { e.preventDefault(); next(); }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); prev(); }
      if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const progress = ((current + 1) / total) * 100;

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#080e1f" }}>
      {/* Progress */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "2px", zIndex: 200,
        width: `${progress}%`, background: "linear-gradient(90deg, #c9a227, #f0c940)",
        transition: "width 0.5s ease", boxShadow: "0 0 12px rgba(201,162,39,0.82)"
      }} />

      {/* Fade overlay */}
      <div ref={overlayRef} style={{
        position: "fixed", inset: 0, background: "#080e1f", zIndex: 50,
        pointerEvents: "none", opacity: 0, transition: "opacity 0.25s ease"
      }} />

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            pointerEvents: i === current ? "all" : "none",
            transition: "opacity 0s",
          }}
        >
          {slide.type === "hero" && <HeroSlide />}
          {slide.type === "vision" && <VisionSlide />}
          {slide.type === "architecture" && <ArchitectureSlide />}
          {slide.type === "ai" && <AIModuleSlide />}
          {slide.type === "systemtext" && <SystemTextSlide />}
          {slide.type === "person" && <PersonSlide slide={slide as PersonData} slideNum={i + 1} total={total} />}
          {slide.type === "company" && <CompanySlide />}
          {slide.type === "closing" && <ClosingSlide />}
        </div>
      ))}

      {/* Nav */}
      <div style={{
        position: "fixed", bottom: "1rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "0.75rem",
        background: "rgba(8,14,31,0.85)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(201,162,39,0.32)", borderRadius: "100px",
        padding: "0.4rem 1rem", zIndex: 100,
        maxWidth: "90vw"
      }}>
        <NavBtn onClick={prev} disabled={current === 0}>←</NavBtn>
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 18 : 4, height: 4,
                borderRadius: 3,
                background: i === current ? "#c9a227" : "rgba(255,255,255,0.33)",
                cursor: "pointer", transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
        <NavBtn onClick={next} disabled={current === total - 1}>→</NavBtn>
        <span style={{ color: "rgba(255,255,255,0.63)", fontSize: "0.8rem", minWidth: 40, textAlign: "center" }}>
          {current + 1}/{total}
        </span>
      </div>

      {/* Keyboard hint - elrejtve, zavaró volt a prezentáción */}
      <div style={{
        position: "fixed", bottom: "5.5rem", left: "50%", transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.06)", fontSize: "0.6rem", letterSpacing: "0.1em",
        gap: "6px", alignItems: "center", zIndex: 99,
        pointerEvents: "none", opacity: 0, display: "none"
      }}>
        <Kbd>←</Kbd><Kbd>→</Kbd><span>navigálás</span>
        <span style={{ marginLeft: 4 }} /><Kbd>F</Kbd><span>teljes képernyő</span>
      </div>
    </div>
  );
}

// ===================== HELPERS =====================
function NavBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.28)",
        background: disabled ? "transparent" : "rgba(255,255,255,0.22)",
        color: disabled ? "rgba(255,255,255,0.33)" : "rgba(255,255,255,0.6)",
        cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.22rem", transition: "all 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      padding: "1px 6px", background: "rgba(255,255,255,0.23)",
      border: "1px solid rgba(255,255,255,0.28)", borderRadius: 3, fontSize: "0.84rem"
    }}>{children}</span>
  );
}

// ===================== PARTICLES (client-only to avoid hydration mismatch) =====================
function Particles({ count = 16 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number; x: number; size: number; duration: number; delay: number;
  }>>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 2.5 + 1,
        duration: Math.random() * 8 + 7,
        delay: Math.random() * 8,
      }))
    );
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#c9a227",
            opacity: 0,
            animation: `floatUp ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ===================== SHARED LAYOUT =====================
function SlideShell({ children, header }: { children: React.ReactNode; header?: string }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "linear-gradient(145deg, #080e1f 0%, #0f1a35 50%, #080e1f 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(201,162,39,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.16) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(45,77,184,0.2) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 90%, rgba(201,162,39,0.22) 0%, transparent 60%)"
      }} />

      {/* Header */}
      {header && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.1rem 2.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.22)",
          background: "rgba(8,14,31,0.5)", backdropFilter: "blur(10px)",
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/logo (1).png" alt="PannonGuard" width={26} height={26} style={{ objectFit: "contain", width: "auto", opacity: 0.85 }} />
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.08rem", fontWeight: 500, letterSpacing: "0.04em" }}>
              PannonGuard Komplex
            </span>
          </div>
          <span style={{ color: "rgba(201,162,39,0.67)", fontSize: "0.95rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            {header}
          </span>
        </div>
      )}

      <div style={{ position: "relative", zIndex: 5, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {children}
      </div>
    </div>
  );
}

// ===================== HERO SLIDE =====================
function HeroSlide() {
  return (
    <SlideShell>
      <Particles count={18} />

      {/* Rings */}
      {[280, 420, 580].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size, height: size,
          borderRadius: "50%",
          border: "1px solid rgba(201,162,39,0.20)",
          animation: `expandRing 6s ease-out ${i * 1.8}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Logo */}
        <div style={{ position: "relative", marginBottom: "2.5rem", animation: "fadeScaleIn 1s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <div style={{
            position: "absolute", inset: -40, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,162,39,0.42) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }} />
          <Image src="/logo (1).png" alt="PannonGuard" width={150} height={150} style={{ objectFit: "contain", width: "auto", position: "relative" }} priority />
        </div>

        {/* Text */}
        <div style={{ color: "rgba(255,255,255,0.53)", fontSize: "0.95rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "0.75rem", animation: "fadeUp 0.8s ease 0.4s both" }}>
          Igazgatói Tanács Bemutató · 2026
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(3.78rem, 8.1vw, 7.43rem)", fontWeight: 900,
          color: "#fff", lineHeight: 1.05, textAlign: "center",
          animation: "fadeUp 0.8s ease 0.55s both",
        }}>
          PannonGuard
          <br />
          <span style={{ background: "linear-gradient(135deg, #f0c940, #c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Komplex
          </span>
        </h1>

        {/* Divider */}
        <div style={{ width: 280, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.62), transparent)", margin: "1.75rem auto", animation: "fadeIn 1s ease 0.9s both" }} />

        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "1.15rem", letterSpacing: "0.12em", animation: "fadeUp 0.8s ease 1s both" }}>
          Intelligens Vállalatirányítási Rendszer
        </p>

        {/* Készítők */}
        <div style={{ 
          marginTop: "2rem", 
          animation: "fadeUp 0.8s ease 1.2s both",
          width: "100%",
          maxWidth: 900
        }}>
          <div style={{ 
            color: "rgba(201,162,39,0.88)", 
            textTransform: "uppercase", 
            letterSpacing: "0.25em", 
            marginBottom: "1.25rem", 
            fontSize: "0.78rem",
            textAlign: "center",
            fontWeight: 600
          }}>
            ◈ Készítette ◈
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: "1.25rem",
            alignItems: "start"
          }}>
            {/* 1. Személy */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,162,39,0.22)",
              borderRadius: 14,
              padding: "1.1rem 0.75rem",
              textAlign: "center",
              backdropFilter: "blur(8px)"
            }}>
              <div style={{ 
                fontSize: "1.5rem", 
                color: "rgba(201,162,39,0.9)", 
                marginBottom: "0.4rem"
              }}>✦</div>
              <div style={{ 
                fontWeight: 700, 
                color: "#fff", 
                fontSize: "0.92rem", 
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                marginBottom: "0.3rem"
              }}>
                Balog Sebastian Máté
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.55)", 
                fontSize: "0.72rem", 
                letterSpacing: "0.05em",
                lineHeight: 1.35
              }}>
                PannonGuard Zrt.<br />munkatárs
              </div>
            </div>

            {/* 2. Személy */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,162,39,0.22)",
              borderRadius: 14,
              padding: "1.1rem 0.75rem",
              textAlign: "center",
              backdropFilter: "blur(8px)"
            }}>
              <div style={{ 
                fontSize: "1.5rem", 
                color: "rgba(201,162,39,0.9)", 
                marginBottom: "0.4rem"
              }}>✦</div>
              <div style={{ 
                fontWeight: 700, 
                color: "#fff", 
                fontSize: "0.92rem", 
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                marginBottom: "0.3rem"
              }}>
                Vonház Dávid
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.55)", 
                fontSize: "0.72rem", 
                letterSpacing: "0.05em",
                lineHeight: 1.35
              }}>
                PannonGuard Zrt.<br />munkatárs
              </div>
            </div>

            {/* 3. Személy */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,162,39,0.22)",
              borderRadius: 14,
              padding: "1.1rem 0.75rem",
              textAlign: "center",
              backdropFilter: "blur(8px)"
            }}>
              <div style={{ 
                fontSize: "1.5rem", 
                color: "rgba(201,162,39,0.9)", 
                marginBottom: "0.4rem"
              }}>✦</div>
              <div style={{ 
                fontWeight: 700, 
                color: "#fff", 
                fontSize: "0.92rem", 
                letterSpacing: "0.01em",
                lineHeight: 1.2,
                marginBottom: "0.3rem"
              }}>
                Tripa Pap Renáta
              </div>
              <div style={{ 
                color: "rgba(255,255,255,0.55)", 
                fontSize: "0.72rem", 
                letterSpacing: "0.05em",
                lineHeight: 1.35
              }}>
                Szolgáltatási<br />Igazgató
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ===================== VISION SLIDE =====================
function VisionSlide() {
  const pillars = [
    { icon: "◈", label: "Átláthatóság", desc: "Minden folyamat és adat egységes, valós idejű áttekintése" },
    { icon: "⬡", label: "Automatizáció", desc: "Ismétlődő feladatok automatizálása, erőforrás felszabadítása" },
    { icon: "◎", label: "Digitalizáció", desc: "Papíralapú folyamatok teljes körű digitalizálása" },
    { icon: "◇", label: "Elemzés", desc: "Valós idejű dashboardok, kimutatások és pénzügyi riportok" },
    { icon: "⬙", label: "Fordítás", desc: "Idegen nyelvű anyagok azonnali, pontos fordítása" },
    { icon: "◉", label: "Compliance", desc: "Jogszabályváltozások automatikus követése, kockázatkezelés" },
  ];

  return (
    <SlideShell>
      <div style={{ textAlign: "center", maxWidth: 1400, width: "90%", paddingTop: "2rem" }}>
        <div style={{ color: "rgba(201,162,39,0.82)", fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1rem", animation: "fadeUp 0.6s ease 0.1s both" }}>
          Rendszer áttekintő
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.7rem, 6.08vw, 4.73rem)", fontWeight: 700,
          color: "#fff", lineHeight: 1.1, marginBottom: "0.75rem",
          animation: "fadeUp 0.6s ease 0.2s both",
        }}>
          Egy platform,{" "}
          <span style={{ background: "linear-gradient(135deg, #f0c940, #c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            minden részlegnek
          </span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.53)", fontSize: "1.28rem", lineHeight: 1.8, marginBottom: "3rem", animation: "fadeUp 0.6s ease 0.3s both" }}>
          A PannonGuard Komplex az AI erejét hasznosítva optimalizálja a mindennapi munkafolyamatokat
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {pillars.map((p, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.24)",
              borderRadius: 18, padding: "1.75rem 1.5rem",
              textAlign: "left", transition: "all 0.35s ease",
              animation: `fadeUp 0.6s ease ${0.1 + i * 0.08}s both`,
              cursor: "default",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,162,39,0.37)";
              (e.currentTarget as HTMLElement).style.background = "rgba(201,162,39,0.16)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.24)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.20)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
            >
              <div style={{ fontSize: "1.89rem", color: "rgba(201,162,39,0.82)", marginBottom: "0.75rem" }}>{p.icon}</div>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "1.28rem", marginBottom: "0.4rem" }}>{p.label}</div>
              <div style={{ color: "rgba(255,255,255,0.58)", fontSize: "1.11rem", lineHeight: 1.65 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

// ===================== PERSON SLIDE =====================
type PersonData = {
  id: string; type: string; name: string; index: number; benefits: string[];
};

function PersonSlide({ slide, slideNum, total }: { slide: PersonData; slideNum: number; total: number }) {
  return (
    <SlideShell header="Személyes előnyök">
      <div style={{
        display: "grid", gridTemplateColumns: "320px 1fr",
        gap: "4rem", maxWidth: 1400, width: "90%",
        alignItems: "start", paddingTop: "4.5rem",
      }}>
        {/* LEFT */}
        <div style={{ animation: "fadeUp 0.6s ease 0.1s both" }}>
          {/* Slide counter */}
          <div style={{ color: "rgba(201,162,39,0.52)", fontSize: "0.88rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {slideNum} — {total}
          </div>

          {/* Avatar circle */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            border: "1px solid rgba(201,162,39,0.37)",
            background: "linear-gradient(135deg, rgba(45,77,184,0.3), rgba(13,22,40,0.8))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.7rem", marginBottom: "1.5rem",
            boxShadow: "0 0 40px rgba(45,77,184,0.2), inset 0 0 20px rgba(201,162,39,0.17)",
          }}>
            <span style={{ opacity: 0.6, fontSize: "2.16rem" }}>✦</span>
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.16rem, 4.05vw, 3.24rem)", fontWeight: 700,
            color: "#fff", lineHeight: 1.1, marginBottom: "1.5rem",
          }}>
            {slide.name}
          </h2>

          {/* Gold line */}
          <div style={{ width: 48, height: 2, background: "linear-gradient(90deg, #c9a227, transparent)", borderRadius: 1, marginBottom: "1.5rem" }} />

          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "1.11rem", lineHeight: 1.8 }}>
            A <strong style={{ color: "rgba(255,255,255,0.73)", fontWeight: 500 }}>PannonGuard Komplex</strong> az alábbi területeken nyújt közvetlen segítséget:
          </p>
        </div>

        {/* RIGHT: Benefits */}
        <div style={{
          display: "flex", flexDirection: "column", gap: "0.65rem",
          maxHeight: "62vh", overflowY: "auto",
          paddingRight: 4, paddingTop: "4.5rem",
        }}>
          {slide.benefits.map((b, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "flex-start", gap: "1rem",
                padding: "0.9rem 1.1rem",
                background: "rgba(255,255,255,0.20)",
                border: "1px solid rgba(255,255,255,0.23)",
                borderLeft: "2px solid rgba(201,162,39,0.47)",
                borderRadius: "0 12px 12px 0",
                animation: `fadeRight 0.5s ease ${0.15 + i * 0.1}s both`,
                transition: "all 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(201,162,39,0.17)";
                (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(201,162,39,0.82)";
                (e.currentTarget as HTMLElement).style.transform = "translateX(3px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.20)";
                (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(201,162,39,0.47)";
                (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
              }}
            >
              <span style={{ color: "rgba(201,162,39,0.62)", fontSize: "0.95rem", marginTop: 3, flexShrink: 0, fontFamily: "monospace" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.17rem", lineHeight: 1.65 }}>
                {b}
              </span>
            </div>
          ))}

          {/* "és még sok minden más" trailing item */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: "1rem",
              padding: "0.75rem 1.1rem",
              background: "rgba(201,162,39,0.15)",
              border: "1px dashed rgba(201,162,39,0.30)",
              borderRadius: "0 12px 12px 0",
              borderLeft: "2px dashed rgba(201,162,39,0.37)",
              animation: `fadeRight 0.5s ease ${0.15 + slide.benefits.length * 0.1}s both`,
            }}
          >
            {/* Animated dots */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: "rgba(201,162,39,0.57)",
                  animation: `blink 1.6s ease ${j * 0.25}s infinite`,
                }} />
              ))}
            </div>
            <span style={{
              color: "rgba(201,162,39,0.62)", fontSize: "1.11rem",
              fontStyle: "italic", letterSpacing: "0.02em",
            }}>
              és még sok minden más…
            </span>
          </div>
        </div>

      </div>
    </SlideShell>
  );
}

// ===================== COMPANY SLIDE =====================
function CompanySlide() {
  const items = [
    { label: "Nagyobb átláthatóság", desc: "Minden osztály, minden folyamat egy helyen" },
    { label: "Digitalizáció elősegítése", desc: "Papíralapú munkafolyamatok felszámolása" },
    { label: "Idegen nyelvű fordítás", desc: "Azonnali, pontos dokumentumfordítás" },
    { label: "Kimutatások készítése", desc: "Automatizált riportok és vizualizációk" },
  ];

  const depts = [
    "Nagy Sándor", "Vonház Dávid", "Kelemen Imre", "Nagy Kristóf", "Tarnóczi Zsófia",
    "Pálfalviné Karaszek Nóra", "Kárai Ibolya", "Orosz László", "Bali Emese", "Bánhidi József",
  ];

  return (
    <SlideShell header="Vállalati szintű hatás">
      <div style={{ maxWidth: 1400, width: "90%", paddingTop: "5rem", textAlign: "center" }}>
        <div style={{ color: "rgba(201,162,39,0.72)", fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.75rem", animation: "fadeUp 0.6s ease 0.1s both" }}>
          Az egész cégre vetítve
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.43rem, 5.4vw, 4.05rem)", fontWeight: 700,
          color: "#fff", marginBottom: "0.6rem",
          animation: "fadeUp 0.6s ease 0.2s both",
        }}>
          Vállalati szintű{" "}
          <span style={{ background: "linear-gradient(135deg, #f0c940, #c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            transzformáció
          </span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.48)", fontSize: "1.19rem", marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.3s both" }}>
          Minden munkatárs, minden részleg – egyetlen intelligens rendszerben
        </p>

        {/* 4 pillars */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.35s both" }}>
          {items.map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.20)", border: "1px solid rgba(201,162,39,0.24)",
              borderRadius: 14, padding: "1.25rem 1rem", textAlign: "left",
            }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "1.15rem", marginBottom: "0.3rem" }}>{item.label}</div>
              <div style={{ color: "rgba(255,255,255,0.53)", fontSize: "1.04rem", lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* People grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.65rem", animation: "fadeUp 0.6s ease 0.45s both" }}>
          {depts.map((name, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.23)",
              borderRadius: 10, padding: "0.75rem 0.6rem",
              color: "rgba(255,255,255,0.73)", fontSize: "1.01rem", fontWeight: 500,
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <span style={{ color: "rgba(201,162,39,0.52)", fontSize: "0.81rem" }}>✦</span>
              {name}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

// ===================== CLOSING SLIDE =====================
function ClosingSlide() {
  return (
    <SlideShell>
      <Particles count={16} />

      {[300, 460, 620].map((size, i) => (
        <div key={i} style={{
          position: "absolute",
          width: size, height: size,
          borderRadius: "50%",
          border: "1px solid rgba(201,162,39,0.18)",
          animation: `expandRing 7s ease-out ${i * 2}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ position: "relative", marginBottom: "1.5rem", animation: "fadeScaleIn 0.9s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <div style={{
            position: "absolute", inset: -30, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(201,162,39,0.37) 0%, transparent 70%)",
            animation: "pulse 3s ease-in-out infinite",
          }} />
          <Image src="/logo (1).png" alt="PannonGuard" width={130} height={130} style={{ objectFit: "contain", width: "auto", position: "relative" }} />
        </div>

        <div style={{ color: "rgba(201,162,39,0.67)", fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase", animation: "fadeUp 0.7s ease 0.2s both" }}>
          Köszönjük a figyelmet
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.97rem, 6.75vw, 5.4rem)", fontWeight: 900,
          color: "#fff", lineHeight: 1.05,
          animation: "fadeUp 0.7s ease 0.35s both",
        }}>
          A jövő már{" "}
          <span style={{ background: "linear-gradient(135deg, #f0c940, #c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            elkezdődött
          </span>
        </h2>

        <p style={{ color: "rgba(255,255,255,0.53)", fontSize: "clamp(1.19rem, 2.03vw, 1.35rem)", maxWidth: 520, lineHeight: 1.85, animation: "fadeUp 0.7s ease 0.5s both" }}>
          A <strong style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>PannonGuard Komplex</strong> nem csupán egy szoftver —<br />
          hanem a vállalat következő fejlődési lépcsőfoka.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "3rem", marginTop: "2rem", animation: "fadeUp 0.7s ease 0.65s both" }}>
          {[["10+", "Részleg"], ["∞", "Lehetőség"], ["1", "Rendszer"]].map(([num, label], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "clamp(2.7rem, 5.4vw, 4.05rem)", fontWeight: 900,
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, #f0c940, #c9a227)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{num}</div>
              <div style={{ color: "rgba(255,255,255,0.48)", fontSize: "0.97rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ width: 160, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.47), transparent)", marginTop: "2rem", animation: "fadeIn 1s ease 0.9s both" }} />
        <div style={{ color: "rgba(255,255,255,0.33)", fontSize: "0.95rem", letterSpacing: "0.2em", textTransform: "uppercase", animation: "fadeUp 0.7s ease 1s both" }}>
          PannonGuard · 2026
        </div>
      </div>
    </SlideShell>
  );
}

// ===================== ARCHITECTURE SLIDE =====================
function ArchitectureSlide() {
  const departments = [
    "Szervezetirányítás", "Belső ellenőrzés", "Objektumfelügyelet",
    "Rendezvények", "HR", "Ügyvitel", "Logisztika",
    "Gazdasági osztály", "Technikai osztály", "IT Biztonság",
  ];

  return (
    <SlideShell header="Rendszerarchitektúra">
      <div style={{ width: "90%", maxWidth: 1400, paddingTop: "4.5rem" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "rgba(201,162,39,0.72)", fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Rendszerarchitektúra
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.43rem, 4.73vw, 3.78rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
            Moduláris felépítés &{" "}
            <span style={{ background: "linear-gradient(135deg,#f0c940,#c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              központi irányítás
            </span>
          </h2>
        </div>

        {/* Diagram */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

          {/* TOP: Central CRM */}
          <div style={{ animation: "fadeUp 0.6s ease 0.2s both", width: "100%" }}>
            <div style={{
              margin: "0 auto",
              width: "fit-content",
              background: "linear-gradient(135deg, rgba(45,77,184,0.35), rgba(13,22,40,0.9))",
              border: "1px solid rgba(45,77,184,0.6)",
              borderRadius: 16, padding: "1.1rem 2.5rem",
              textAlign: "center",
              boxShadow: "0 0 40px rgba(45,77,184,0.25), inset 0 0 20px rgba(45,77,184,0.08)",
              position: "relative",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center" }}>
                <span style={{ fontSize: "1.76rem", opacity: 0.8 }}>◈</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.35rem", letterSpacing: "0.03em" }}>
                  PannonGuard CRM
                </span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.35rem" }}>—</span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500, fontSize: "1.22rem" }}>
                  Központi Adminisztráció & Jogosultságkezelés
                </span>
              </div>
              {/* ISO badge */}
              <div style={{
                position: "absolute", top: -14, right: 20,
                background: "linear-gradient(135deg, #c9a227, #f0c940)",
                borderRadius: 6, padding: "3px 10px",
                fontSize: "0.84rem", fontWeight: 700, color: "#080e1f", letterSpacing: "0.1em",
              }}>
                ISO COMPLIANT
              </div>
            </div>
          </div>

          {/* Arrow down → MID row */}
          <Arrow />

          {/* MIDDLE ROW: 3 pillars */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", width: "100%", animation: "fadeUp 0.6s ease 0.4s both" }}>
            {[
              { icon: "◉", label: "Jogosultságkezelés", desc: "Személyre szabott admin jogkörök osztályonként és munkatársanként" },
              { icon: "◎", label: "Moduláris hozzáférés", desc: "Minden osztálynak és munkatársnak saját, dedikált modul" },
              { icon: "◇", label: "ISO megfelelőség", desc: "Teljes körű ISO szabványnak való megfelelés az összes folyamatban" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.21)",
                border: "1px solid rgba(255,255,255,0.26)",
                borderRadius: 14, padding: "1.1rem 1.25rem",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "1.62rem", color: "rgba(201,162,39,0.72)", marginBottom: "0.5rem" }}>{item.icon}</div>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "1.15rem", marginBottom: "0.3rem" }}>{item.label}</div>
                <div style={{ color: "rgba(255,255,255,0.56)", fontSize: "1.03rem", lineHeight: 1.55 }}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Arrow down → Dept modules */}
          <Arrow />

          {/* BOTTOM: Department modules */}
          <div style={{ width: "100%", animation: "fadeUp 0.6s ease 0.6s both" }}>
            {/* Label */}
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.43)", fontSize: "0.92rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              Osztályok & személyre szabott modulok
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.55rem" }}>
              {departments.map((dept, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.20)",
                  border: "1px solid rgba(255,255,255,0.23)",
                  borderTop: "2px solid rgba(201,162,39,0.42)",
                  borderRadius: "0 0 10px 10px",
                  padding: "0.7rem 0.6rem",
                  textAlign: "center",
                  display: "flex", flexDirection: "column", gap: "0.35rem",
                  animation: `fadeUp 0.5s ease ${0.65 + i * 0.05}s both`,
                }}>
                  <span style={{ color: "rgba(201,162,39,0.62)", fontSize: "0.84rem" }}>✦</span>
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.99rem", fontWeight: 500, lineHeight: 1.3 }}>{dept}</span>
                  <div style={{ display: "flex", gap: "3px", justifyContent: "center", flexWrap: "wrap" }}>
                    <MiniPill>Modul</MiniPill>
                    <MiniPill accent>MI</MiniPill>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SlideShell>
  );
}

function Arrow() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, margin: "6px 0" }}>
      <div style={{ width: 1, height: 18, background: "rgba(201,162,39,0.47)" }} />
      <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "7px solid rgba(201,162,39,0.62)" }} />
    </div>
  );
}

function MiniPill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span style={{
      fontSize: "0.78rem", padding: "1px 6px", borderRadius: 4,
      background: accent ? "rgba(201,162,39,0.27)" : "rgba(255,255,255,0.22)",
      border: accent ? "1px solid rgba(201,162,39,0.42)" : "1px solid rgba(255,255,255,0.24)",
      color: accent ? "rgba(201,162,39,0.9)" : "rgba(255,255,255,0.53)",
      fontWeight: 600, letterSpacing: "0.04em",
    }}>
      {children}
    </span>
  );
}

// ===================== AI MODULE SLIDE =====================
function AIModuleSlide() {
  const capabilities = [
    { icon: "◈", title: "Napi feladatok kezelése", desc: "Az osztályra jellemző rutinfeladatok automatizálása és strukturált nyilvántartása" },
    { icon: "⬡", title: "Összefüggések feltárása", desc: "Adatkorrelációk és mintázatok automatikus azonosítása nagy adathalmazokban" },
    { icon: "◎", title: "Erőforrás-igényes feladatok", desc: "Nagy mennyiségű dokumentum feldolgozása, elemzése, összefoglalása percek alatt" },
    { icon: "◇", title: "Fordítás & lokalizáció", desc: "Idegen nyelvű anyagok valós idejű, kontextus-tudatos fordítása" },
    { icon: "◉", title: "Jogszabálykövetés", desc: "Jogszabályváltozások automatikus figyelése és releváns értesítések küldése" },
    { icon: "⬙", title: "Döntéstámogatás", desc: "Adatalapú javaslatok, előrejelzések és kockázatelemzések generálása" },
  ];

  return (
    <SlideShell header="MI Asszisztens">
      <div style={{ width: "90%", maxWidth: 1400, paddingTop: "4.5rem" }}>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "rgba(201,162,39,0.72)", fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Beépített MI asszisztens
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.43rem, 4.73vw, 3.78rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
            Minden modul tartalmaz egy{" "}
            <span style={{ background: "linear-gradient(135deg,#f0c940,#c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              MI asszisztenst
            </span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.53)", fontSize: "1.19rem", marginTop: "0.6rem", lineHeight: 1.7 }}>
            Nem csupán egy chatbot — hanem egy kontextus-tudatos munkatárs, aki ismeri az osztály folyamatait
          </p>
        </div>

        {/* Central module box + capabilities */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2.5rem", alignItems: "start" }}>

          {/* Left: Module visual */}
          <div style={{ animation: "fadeUp 0.6s ease 0.2s both" }}>
            {/* Outer module */}
            <div style={{
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.26)",
              borderRadius: 18, padding: "1.5rem",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, rgba(201,162,39,0.72), transparent)" }} />

              <div style={{ color: "rgba(255,255,255,0.53)", fontSize: "0.88rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Osztály Modul
              </div>

              {/* Daily tasks box */}
              <div style={{
                background: "rgba(255,255,255,0.22)", border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "0.75rem",
              }}>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", fontWeight: 500, marginBottom: "0.3rem" }}>Napi munkafolyamatok</div>
                <div style={{ color: "rgba(255,255,255,0.43)", fontSize: "0.97rem", lineHeight: 1.5 }}>Dokumentumok · Nyilvántartás · Riportok · Naptár</div>
              </div>

              {/* Divider + arrow down */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, margin: "4px 0" }}>
                <div style={{ width: 1, height: 12, background: "rgba(201,162,39,0.52)" }} />
                <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "6px solid rgba(201,162,39,0.62)" }} />
              </div>

              {/* AI box */}
              <div style={{
                background: "linear-gradient(135deg, rgba(201,162,39,0.24), rgba(201,162,39,0.15))",
                border: "1px solid rgba(201,162,39,0.42)",
                borderRadius: 10, padding: "0.9rem 1rem",
                boxShadow: "0 0 20px rgba(201,162,39,0.22)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <span style={{ color: "#c9a227", fontSize: "1.22rem" }}>◈</span>
                  <span style={{ color: "rgba(201,162,39,0.95)", fontWeight: 700, fontSize: "1.11rem", letterSpacing: "0.05em" }}>MI Asszisztens</span>
                </div>
                <div style={{ color: "rgba(201,162,39,0.67)", fontSize: "0.97rem", lineHeight: 1.55 }}>
                  Kontextus-tudatos · Tanul az osztály adataiból · Mindig elérhető
                </div>
              </div>

              {/* Arrow going right */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginTop: "0.75rem" }}>
                <div style={{ height: 1, width: 40, background: "rgba(201,162,39,0.42)" }} />
                <div style={{ color: "rgba(201,162,39,0.62)", fontSize: "0.95rem" }}>→ képességek</div>
              </div>
            </div>

            {/* ISO & CRM note */}
            <div style={{
              marginTop: "0.85rem", background: "rgba(45,77,184,0.12)",
              border: "1px solid rgba(45,77,184,0.25)", borderRadius: 10,
              padding: "0.7rem 1rem",
            }}>
              <div style={{ color: "rgba(150,180,255,0.8)", fontSize: "1.01rem", fontWeight: 600, marginBottom: "0.2rem" }}>◎ PannonGuard CRM</div>
              <div style={{ color: "rgba(150,180,255,0.65)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Minden modul csatlakozik a központi CRM-hez. Az MI is hozzáfér az osztály engedélyezett adataihoz.
              </div>
            </div>
          </div>

          {/* Right: Capability grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {capabilities.map((cap, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.20)",
                border: "1px solid rgba(255,255,255,0.24)",
                borderLeft: "2px solid rgba(201,162,39,0.42)",
                borderRadius: "0 12px 12px 0",
                padding: "0.9rem 1rem",
                animation: `fadeRight 0.5s ease ${0.2 + i * 0.1}s both`,
                transition: "all 0.25s ease",
                cursor: "default",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(201,162,39,0.17)";
                (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(201,162,39,0.77)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.20)";
                (e.currentTarget as HTMLElement).style.borderLeftColor = "rgba(201,162,39,0.42)";
              }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <span style={{ color: "rgba(201,162,39,0.72)", fontSize: "1.22rem" }}>{cap.icon}</span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: "1.11rem" }}>{cap.title}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.56)", fontSize: "1.03rem", lineHeight: 1.6, margin: 0 }}>{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

// ===================== SYSTEM TEXT SLIDE =====================
function SystemTextSlide() {
  const points = [
    {
      num: "01",
      title: "Moduláris rendszerfelépítés",
      body: "A rendszer több modulból épül fel, biztosítva a személyre szabott hozzáférést az egyes osztályok és munkatársak számára.",
    },
    {
      num: "02",
      title: "Központi adminisztráció & jogosultságkezelés",
      body: "Az adminisztrációs feladatok és a jogosultságkezelés egy központi PannonGuard CRM rendszeren keresztül történnek, a megfelelő adminisztratív jogkörök biztosításával.",
    },
    {
      num: "03",
      title: "ISO megfelelőség",
      body: "A megoldás teljes mértékben megfelel az ISO előírásoknak — a tervezéstől az üzemeltetésig minden folyamat szabványkövetett.",
    },
    {
      num: "04",
      title: "Beépített MI asszisztens minden modulban",
      body: "A napi feladatok ellátása mellett minden modul tartalmaz egy mesterséges intelligencia alapú asszisztenst, amely támogatja a munkatársakat a nagyobb erőforrás-igényű feladatok elvégzésében, valamint az adatok közötti összefüggések és korrelációk feltárásában.",
    },
  ];

  return (
    <SlideShell header="Rendszer összefoglaló">
      <div style={{ width: "90%", maxWidth: 1400, paddingTop: "4.5rem" }}>

        {/* Title */}
        <div style={{ marginBottom: "2.5rem", animation: "fadeUp 0.6s ease 0.1s both" }}>
          <div style={{ color: "rgba(201,162,39,0.72)", fontSize: "0.95rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Összefoglaló
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.43rem, 4.73vw, 3.78rem)", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
            A{" "}
            <span style={{ background: "linear-gradient(135deg,#f0c940,#c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              PannonGuard Komplex
            </span>
            {" "}négy alappillére
          </h2>
        </div>

        {/* Points */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {points.map((pt, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "64px 1fr",
              gap: "1.5rem", alignItems: "start",
              animation: `fadeUp 0.6s ease ${0.15 + i * 0.12}s both`,
            }}>
              {/* Number */}
              <div style={{
                width: 64, height: 64, borderRadius: 14,
                background: "rgba(201,162,39,0.20)",
                border: "1px solid rgba(201,162,39,0.32)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.49rem", fontWeight: 700, background: "linear-gradient(135deg,#f0c940,#c9a227)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {pt.num}
                </span>
              </div>

              {/* Content */}
              <div style={{
                background: "rgba(255,255,255,0.20)",
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 14, padding: "1rem 1.25rem",
                borderLeft: "2px solid rgba(201,162,39,0.42)",
                borderTopLeftRadius: 0, borderBottomLeftRadius: 0,
              }}>
                <div style={{ color: "#fff", fontWeight: 600, fontSize: "1.24rem", marginBottom: "0.35rem" }}>{pt.title}</div>
                <div style={{ color: "rgba(255,255,255,0.63)", fontSize: "1.12rem", lineHeight: 1.7 }}>{pt.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

