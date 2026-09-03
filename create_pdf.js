import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const htmlContent = `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>PannonGuard Komplex - Biztonsági Dokumentáció</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy: #0B1A2A;
      --navy-light: #162a42;
      --gold: #C9A962;
      --gold-light: #e6cd93;
      --cream: #F7F5F1;
      --white-70: rgba(247, 245, 241, 0.7);
      --white-50: rgba(247, 245, 241, 0.5);
      --glass-bg: rgba(255, 255, 255, 0.03);
      --glass-border: rgba(201, 169, 98, 0.2);
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Montserrat', sans-serif;
      background-color: var(--navy);
      color: var(--cream);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* A4 Page Setup */
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      background: linear-gradient(145deg, #0B1A2A 0%, #112338 50%, #0B1A2A 100%);
      display: flex;
      flex-direction: column;
    }
    
    /* Background Grid & Glows */
    .bg-grid {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(201, 169, 98, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(201, 169, 98, 0.05) 1px, transparent 1px);
      background-size: 20mm 20mm;
      z-index: 1;
      pointer-events: none;
    }
    .bg-glow-1 {
      position: absolute;
      top: -100px;
      right: -100px;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 60%);
      z-index: 1;
    }
    .bg-glow-2 {
      position: absolute;
      bottom: -200px;
      left: -200px;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(45, 77, 184, 0.15) 0%, transparent 60%);
      z-index: 1;
    }
    
    /* Layout */
    .content {
      position: relative;
      z-index: 10;
      flex: 1;
      padding: 22mm 20mm 15mm 20mm;
      display: flex;
      flex-direction: column;
    }
    
    /* Header & Footer */
    .header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 15mm;
      background: rgba(11, 26, 42, 0.85);
      border-bottom: 1px solid rgba(201, 169, 98, 0.3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20mm;
      z-index: 20;
    }
    .header .brand {
      font-weight: 700;
      font-size: 10pt;
      letter-spacing: 2px;
      color: var(--white-70);
    }
    .header .tag {
      background: var(--gold);
      color: var(--navy);
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 7pt;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 12mm;
      background: rgba(11, 26, 42, 0.9);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20mm;
      z-index: 20;
    }
    .footer span {
      font-size: 7pt;
      color: var(--white-50);
      letter-spacing: 0.5px;
    }
    
    /* Typography */
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 38pt;
      line-height: 1.1;
      font-weight: 700;
      margin-bottom: 10mm;
    }
    h1 span {
      background: linear-gradient(135deg, var(--gold-light), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 26pt;
      font-weight: 600;
      margin-bottom: 8mm;
      color: var(--cream);
    }
    h2 span {
      color: var(--gold);
    }
    
    .eyebrow {
      color: var(--gold);
      font-size: 9pt;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 3mm;
      font-weight: 600;
    }
    
    p {
      font-size: 10.5pt;
      line-height: 1.8;
      color: var(--white-70);
      margin-bottom: 6mm;
      text-align: justify;
    }
    
    /* Components */
    .glass-card {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 6mm 8mm;
      margin-bottom: 6mm;
    }
    .glass-card h3 {
      font-size: 14pt;
      color: var(--gold);
      margin-bottom: 3mm;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .glass-card p {
      margin-bottom: 0;
      font-size: 10pt;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6mm;
      margin-bottom: 6mm;
    }
    
    .divider {
      height: 1px;
      background: linear-gradient(90deg, var(--gold), transparent);
      width: 50mm;
      margin: 8mm 0;
      opacity: 0.5;
    }
    
    .badge-list {
      display: flex;
      flex-wrap: wrap;
      gap: 3mm;
      margin-bottom: 8mm;
    }
    .badge {
      border: 1px solid rgba(201, 169, 98, 0.4);
      background: rgba(201, 169, 98, 0.1);
      color: var(--gold-light);
      padding: 2mm 4mm;
      border-radius: 6px;
      font-size: 8pt;
      font-weight: 600;
      letter-spacing: 1px;
    }
    
    .db-box {
      border: 1px solid rgba(255,255,255,0.15);
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
      padding: 5mm;
      text-align: center;
      position: relative;
    }
    .db-box.mongo { border-top: 3px solid #4DB33D; }
    .db-box.maria { border-top: 3px solid #003545; }
    
    /* Signature / Seal */
    .seal-box {
      margin-top: auto;
      border-top: 1px dashed rgba(201, 169, 98, 0.4);
      padding-top: 6mm;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .signature {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 22pt;
      color: var(--gold);
      margin-bottom: 2mm;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1 ================= -->
  <div class="page">
    <div class="bg-grid"></div>
    <div class="bg-glow-1"></div>
    <div class="bg-glow-2"></div>
    
    <div class="header">
      <div class="brand">PANNONGUARD KOMPLEX</div>
      <div class="tag">CONFIDENTIAL</div>
    </div>
    
    <div class="content" style="justify-content: center;">
      <div class="eyebrow">Biztonsági & Üzemeltetési Dokumentáció</div>
      <h1>Intelligens<br><span>Vállalatirányítás</span></h1>
      
      <div class="divider"></div>
      
      <p style="font-size: 13pt; color: var(--cream); max-width: 150mm;">
        A PannonGuard Komplex rendszer a legmagasabb szintű vállalati adatbiztonsági és nemzetközi ISO szabványoknak megfelelően lett megtervezve. Ez a dokumentum összefoglalja az infrastruktúra védelmét, a titkosítási protokollokat és az üzemeltetési felelősségeket.
      </p>
      
      <div class="badge-list" style="margin-top: 10mm;">
        <div class="badge">◈ ISO 27001 COMPLIANT</div>
        <div class="badge">◈ ISO 9001 COMPLIANT</div>
        <div class="badge">◈ ZERO-TRUST ARCHITECTURE</div>
        <div class="badge">◈ AES-256 ENCRYPTION</div>
      </div>
      
      <div class="grid-2" style="margin-top: 15mm;">
        <div class="glass-card">
          <h3>ISO Megfelelőség</h3>
          <p>Minden rendszerfolyamat – a jogosultságkezeléstől az adatfeldolgozásig – szigorú, auditálható eljárásrend szerint zajlik, garantálva az ISO 27001 (Információbiztonság) és ISO 9001 (Minőségirányítás) szabványok maximális teljesítését.</p>
        </div>
        <div class="glass-card">
          <h3>Teljes Körű Védelem</h3>
          <p>Minden egyes modul egyedileg védett, szeparált környezetben fut. A szerepkör-alapú hozzáférés-vezérlés (RBAC) biztosítja, hogy a felhasználók kizárólag a munkájukhoz elengedhetetlen adatokhoz férjenek hozzá.</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <span>KIADÁS: 2026.09.02</span>
      <span>PANNON GUARD ZRT. · BELSŐ HASZNÁLATRA</span>
      <span>OLDAL 1 / 5</span>
    </div>
  </div>


  <!-- ================= PAGE 2 ================= -->
  <div class="page">
    <div class="bg-grid"></div>
    <div class="bg-glow-1" style="top: auto; bottom: -100px; right: -100px;"></div>
    
    <div class="header">
      <div class="brand">PANNONGUARD KOMPLEX</div>
      <div class="tag">INFRASTRUCTURE</div>
    </div>
    
    <div class="content">
      <div class="eyebrow">Adatarchitektúra & Kriptográfia</div>
      <h2>Hibrid Adatbázis & <span>Titkosítás</span></h2>
      
      <p style="font-size: 10pt; margin-bottom: 4mm;">A rendszer az adatkezelés optimalizálása és a maximális teljesítmény érdekében hibrid adatbázis-architektúrát alkalmaz. Ez a megoldás lehetővé teszi a strukturált és strukturálatlan adatok szeparált, de szorosan integrált kezelését.</p>
      
      <div class="grid-2">
        <div class="db-box mongo" style="padding: 4mm;">
          <div style="font-size: 20pt; margin-bottom: 1mm;">🍃</div>
          <h4 style="color: #4DB33D; margin-bottom: 1mm;">MongoDB (NoSQL)</h4>
          <p style="font-size: 8.5pt; text-align: center; margin-bottom: 0;">Flexibilis, dokumentum-alapú tárolás. Ideális a mesterséges intelligencia (MI) modulok futtatásához, logok, dinamikus űrlapok és nem strukturált adatok villámgyors feldolgozásához.</p>
        </div>
        <div class="db-box maria" style="padding: 4mm;">
          <div style="font-size: 20pt; margin-bottom: 1mm;">🐬</div>
          <h4 style="color: #003545; color: #6db6ff; margin-bottom: 1mm;">MariaDB (Relációs)</h4>
          <p style="font-size: 8.5pt; text-align: center; margin-bottom: 0;">ACID-kompatibilis, tranzakcionális adatbázis. A pénzügyi adatok, HR nyilvántartások, jogosultságok és szigorúan strukturált vállalati rekordok kompromisszummentes tárolója.</p>
        </div>
      </div>
      
      <div class="divider" style="margin: 4mm 0;"></div>
      
      <div class="glass-card" style="border-left: 3px solid var(--gold); padding: 5mm 7mm;">
        <h3 style="font-size: 13pt;">Szerver Lokáció: Diana Holding</h3>
        <p style="font-size: 9.5pt;">A PannonGuard Komplex <strong>nem használ külső, harmadik fél által üzemeltetett nyilvános felhőt</strong> (pl. AWS, Google Cloud). Minden adat fizikailag a <strong>Diana Holding – Pannon Guard Zrt. saját, dedikált hazai szerverén</strong> kerül tárolásra. Ez drasztikusan csökkenti az adatszivárgás kockázatát és teljes adat-szuverenitást biztosít.</p>
      </div>
      
      <div class="glass-card" style="margin-top: 4mm;">
        <h3 style="font-size: 13pt;">End-to-End Kriptográfia</h3>
        <p style="font-size: 9.5pt;">A rendszer az iparágban alkalmazott legmagasabb szintű védelmi standardokat használja:</p>
        <ul style="margin-left: 5mm; margin-top: 2mm; color: var(--white-70); font-size: 9pt; line-height: 1.5;">
          <li style="margin-bottom: 1.5mm;"><strong>Data at Rest (Nyugalmi állapot):</strong> Az adatbázisok fizikai szintjén minden adat AES-256 bites algoritmussal titkosított.</li>
          <li style="margin-bottom: 1.5mm;"><strong>Data in Transit (Adatátvitel):</strong> A szerver és a kliensek közötti kommunikáció kizárólag TLS 1.3 protokollon keresztül zajlik.</li>
          <li><strong>Zero-Trust:</strong> Nincs alapértelmezett bizalom. Minden hálózati kérés – még a belső hálózatról érkezők is – szigorú hitelesítésen esik át.</li>
        </ul>
      </div>
    </div>
    
    <div class="footer">
      <span>KIADÁS: 2026.09.02</span>
      <span>PANNON GUARD ZRT. · BELSŐ HASZNÁLATRA</span>
      <span>OLDAL 2 / 5</span>
    </div>
  </div>


  <!-- ================= PAGE 3 ================= -->
  <div class="page">
    <div class="bg-grid"></div>
    <div class="bg-glow-2" style="bottom: auto; top: -200px; right: -200px; left: auto;"></div>
    
    <div class="header">
      <div class="brand">PANNONGUARD KOMPLEX</div>
      <div class="tag">OPERATIONS</div>
    </div>
    
    <div class="content">
      <div class="eyebrow">Üzemeltetés & Jövőállóság</div>
      <h2>Karbantartás és <span>Folyamatosság</span></h2>
      
      <p>A PannonGuard Komplex egy kritikus infrastruktúra, melynek zavartalan működése elengedhetetlen a vállalat napi folyamataihoz. Az üzemeltetési és karbantartási protokollok úgy lettek kialakítva, hogy maximális rendelkezésre állást és független jövőállóságot garantáljanak.</p>
      
      <div class="glass-card" style="margin-top: 5mm; background: rgba(201, 169, 98, 0.05); border-color: rgba(201, 169, 98, 0.3);">
        <h3 style="color: var(--gold-light);">Dedikált Rendszergazda: Balog Sebastian Máté</h3>
        <p>A rendszer infrastruktúra-mérnöke és elsődleges karbantartója <strong>Balog Sebastian Máté</strong>, a Pannon Guard Zrt. munkatársa.</p>
        <p style="margin-top: 3mm;">Amíg a vállalat kötelékében áll, kizárólagos felelőssége kiterjed:</p>
        <ul style="margin-left: 5mm; margin-top: 2mm; color: var(--white-70); font-size: 10pt; line-height: 1.6;">
          <li>A Diana Holding szerveren futó alkalmazások és adatbázisok (MongoDB, MariaDB) napi szintű felügyeletére.</li>
          <li>A biztonsági protokollok, tűzfalak és titkosítási kulcsok kezelésére és frissítésére.</li>
          <li>Az esetleges incidensek elhárítására és a folyamatos teljesítmény-optimalizálásra (CI/CD pipelines).</li>
        </ul>
      </div>
      
      <div class="glass-card" style="margin-top: 6mm;">
        <h3>Zökkenőmentes Átadás és Függetlenség</h3>
        <p>A rendszer architektúrája a <em>"Clean Code"</em> és a szabványosított fejlesztési elvek alapján készült. <strong>Amennyiben Balog Sebastian Máté a jövőben eltávozik a Pannon Guard Zrt.-től, a rendszer nem válik működésképtelenné vagy elavulttá.</strong></p>
        <p style="margin-top: 3mm;">A kiterjedt, minden modulra kiterjedő technikai dokumentációnak, a kommentált forráskódnak és az iparági standard technológiáknak (Next.js, Node.js, MongoDB, MariaDB) köszönhetően a karbantartás, üzemeltetés és továbbfejlesztés bármikor, zökkenőmentesen átadható más belső informatikusnak vagy külső fejlesztő cégnek.</p>
      </div>
      
      <!-- Signature Area -->
      <div class="seal-box">
        <div>
          <div style="font-size: 8pt; color: var(--white-50); margin-bottom: 2mm; text-transform: uppercase; letter-spacing: 1px;">Készítette & Hitelesítette:</div>
          <div class="signature">Balog Sebastian Máté</div>
          <div style="font-size: 9pt; color: var(--white-70); font-weight: 600;">Pannon Guard Zrt. munkatárs</div>
        </div>
      </div>
      
    </div>
    
    <div class="footer">
      <span>KIADÁS: 2026.09.02</span>
      <span>PANNON GUARD ZRT. · BELSŐ HASZNÁLATRA</span>
      <span>OLDAL 3 / 5</span>
    </div>
  </div>


  <!-- ================= PAGE 4 (AI INTEGRATION) ================= -->
  <div class="page">
    <div class="bg-grid"></div>
    <div class="bg-glow-1"></div>
    
    <div class="header">
      <div class="brand">PANNONGUARD KOMPLEX</div>
      <div class="tag" style="background: #8b5cf6; color: white;">AI INTEGRATION</div>
    </div>
    
    <div class="content">
      <div class="eyebrow" style="color: #a78bfa;">Mesterséges Intelligencia & Adatfeldolgozás</div>
      <h2>Zárt Környezetű <span>MI Architektúra</span></h2>
      
      <p style="font-size: 10pt; margin-bottom: 4mm;">A PannonGuard Komplex az iparágvezető <strong>Anthropic Claude 3.5 Sonnet</strong> és egyéb dedikált modelljeit integrálja a komplex szövegértelmezési és adatelemzési feladatokhoz. Az integráció a legszigorúbb vállalati adatbiztonsági elvek mentén valósul meg.</p>
      
      <div class="glass-card" style="border-left: 3px solid #ef4444; padding: 5mm 7mm; background: rgba(239, 68, 68, 0.05);">
        <h3 style="font-size: 13pt; color: #fca5a5;">Strict No-Training & Zero Retention Policy</h3>
        <p style="font-size: 9.5pt;">Kritikus biztonsági garancia: A rendszerbe integrált mesterséges intelligencia <strong>NEM tanul a Pannon Guard Zrt. adataiból.</strong> Nem végez semmilyen önálló, nem engedélyezett műveletet, kizárólag az általunk átadott adatokat használja fel a saját, zárt rendszerünkön belül.</p>
        <p style="font-size: 9.5pt; margin-top: 2mm;">A szolgáltató (Anthropic) szerződésben garantálja a Zero Data Retention elvet:</p>
        <ul style="margin-left: 5mm; margin-top: 2mm; color: var(--white-70); font-size: 9pt; line-height: 1.5;">
          <li style="margin-bottom: 1.5mm;">A beküldött adatok <strong>nem kerülnek mentésre</strong> vagy tartós tárolásra a külső szervereken.</li>
          <li style="margin-bottom: 1.5mm;">Az információk kizárólag a kérés-válasz (request-response) ciklus erejéig, a memóriában léteznek, majd azonnal megsemmisülnek.</li>
          <li>Szigorúan tilos az adatok felhasználása a nyelvi modellek jövőbeli tanítására (No-Training).</li>
        </ul>
      </div>

      <div class="glass-card" style="margin-top: 4mm;">
        <h3 style="font-size: 12pt;">RAG (Retrieval-Augmented Generation) Rendszer</h3>
        <p style="font-size: 9.5pt;">Az intelligens keresés és dokumentumfeldolgozás egy saját hosztolású Vektoradatbázison alapul. A dedikált MI motorhoz csak a kontextushoz szigorúan szükséges, anonimizált adatrészletek jutnak el egy 256-bites TLS 1.3 titkosított alagúton keresztül.</p>
      </div>

      <div class="grid-2" style="margin-top: 4mm;">
        <div class="db-box" style="padding: 4mm; border-top: 3px solid #8b5cf6; background: rgba(139, 92, 246, 0.05);">
          <div style="font-size: 20pt; margin-bottom: 1mm;">🧠</div>
          <h4 style="color: #c4b5fd; margin-bottom: 1mm;">Claude 3.5 Sonnet</h4>
          <p style="font-size: 8.5pt; text-align: center; margin-bottom: 0;">Magas intelligenciát igénylő, komplex jogi és pénzügyi dokumentumok elemzése, kontextuális fordítás kiemelkedő pontossággal.</p>
        </div>
        <div class="db-box" style="padding: 4mm; border-top: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.05);">
          <div style="font-size: 20pt; margin-bottom: 1mm;">⚡</div>
          <h4 style="color: #93c5fd; margin-bottom: 1mm;">Villámgyors Feldolgozás</h4>
          <p style="font-size: 8.5pt; text-align: center; margin-bottom: 0;">Automatizált napi riportok, adatbázis-korrelációk és statisztikák előállítása milliszekundumok alatt.</p>
        </div>
      </div>
      
    </div>
    
    <div class="footer">
      <span>KIADÁS: 2026.09.02</span>
      <span>PANNON GUARD ZRT. · BELSŐ HASZNÁLATRA</span>
      <span>OLDAL 4 / 5</span>
    </div>
  </div>


  <!-- ================= PAGE 5 (CYBERSECURITY) ================= -->
  <div class="page">
    <div class="bg-grid"></div>
    <div class="bg-glow-2" style="bottom: auto; top: -200px; left: -200px;"></div>
    
    <div class="header">
      <div class="brand">PANNONGUARD KOMPLEX</div>
      <div class="tag" style="background: #10b981; color: #064e3b;">CYBERSECURITY</div>
    </div>
    
    <div class="content">
      <div class="eyebrow" style="color: #34d399;">Hálózatbiztonság & Topológia</div>
      <h2>Katonai Szintű <span>Kiberbiztonság</span></h2>
      
      <p style="font-size: 10pt; margin-bottom: 4mm;">A PannonGuard Komplex architektúrája a <em>"Defense-in-Depth"</em> (Többrétegű védelem) elvén alapul, amely a legújabb kiberbiztonsági fenyegetések ellen is robusztus védelmet nyújt a Diana Holding szerverközpontjában.</p>
      
      <div class="glass-card" style="margin-top: 4mm;">
        <h3 style="font-size: 12pt;">Web Application Firewall (WAF) & DDoS Védelem</h3>
        <p style="font-size: 9.5pt;">A hálózati forgalom egy Reverse Proxy és WAF rétegen halad át, amely valós időben szűri a rosszindulatú kéréseket (pl. SQL Injekció, XSS, brute-force támadások). Az automatizált Rate Limiting algoritmusok azonnal blokkolják a gyanús forgalmat, megelőzve a szolgáltatásmegtagadással járó (DDoS) túlterhelést.</p>
      </div>

      <div class="glass-card" style="margin-top: 4mm;">
        <h3 style="font-size: 12pt;">Fejlett Hitelesítés & Munkamenet-kezelés</h3>
        <p style="font-size: 9.5pt;">A felhasználói hozzáférés aszimmetrikus kriptográfiával védett, rövid lejáratú JWT (JSON Web Token) tokeneken alapul. A rendszer eszköz-ujjlenyomat (Device Fingerprinting) technológiát és geolokációs ellenőrzést is alkalmaz a munkamenetek eltérítésének (Session Hijacking) megakadályozására.</p>
      </div>

      <div class="glass-card" style="margin-top: 4mm; border-left: 3px solid #10b981; background: rgba(16, 185, 129, 0.05);">
        <h3 style="font-size: 12pt; color: #6ee7b7;">Disaster Recovery & Redundancia</h3>
        <p style="font-size: 9.5pt;">Adatvesztés ellen a rendszer <strong>automatizált Snapshotting</strong> technológiát alkalmaz. Az adatbázisok (MongoDB, MariaDB) meghatározott időközönként titkosított biztonsági mentést készítenek egy fizikailag szeparált, elzárt hálózati zónába (Cold Storage). Katasztrófa esetén a Point-in-Time Recovery segítségével percre pontosan visszaállítható az infrastruktúra állapota.</p>
      </div>
      

      
    </div>
    
    <div class="footer">
      <span>KIADÁS: 2026.09.02</span>
      <span>PANNON GUARD ZRT. · BELSŐ HASZNÁLATRA</span>
      <span>OLDAL 5 / 5</span>
    </div>
  </div>

</body>
</html>
`;

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for standard A4
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Make sure fonts are loaded
    await page.evaluateHandle('document.fonts.ready');
    
    const outputPath = path.join(process.cwd(), 'public', 'PannonGuard_Komplex_Biztonsagi_Dokumentacio.pdf');
    
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });
    
    console.log('PDF generated successfully at:', outputPath);
    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
})();
