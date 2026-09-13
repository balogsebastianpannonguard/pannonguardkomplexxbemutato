<div align="center">
  <h1>Pannon Transfer</h1>
  <h3>Átfogó Rendszerterv és Üzemeltetési Stratégia</h3>
</div>

---

> **Vízió és Célkitűzés**  
> Prémium, modern és szigorúan izolált informatikai ökoszisztéma megalkotása a Pannon Transfer számára, amely a legmagasabb szintű vizuális letisztultságot ötvözi a robusztus, vállalati szintű teljesítménnyel és biztonsággal.

## 1. Vezetői és Üzleti Összefoglaló

A projekt célja egy olyan egyedi és zárt központi informatikai platform felépítése, amely 6-12 hónap alatt teljeskörűen kiszolgálja a Pannon Transfer minden üzleti ágát. A rendszer **szigorúan moduláris architektúrára** épül: a partnercégek (pl. EcoPro, CATL, Vitesco) és a belső divíziók (adminisztráció, sofőrök) dedikált, vizuálisan megkülönböztetett felületeket kapnak. Ezek a háttérben logikailag egy központi, biztonságos magba integrálódnak. 

A fejlesztés fókuszában az adatizoláció (a partnerek adatai sosem keveredhetnek) és a komplex pénzügyi/számviteli modul stabil alapokra helyezése áll.

## 2. Technológiai Architektúra

A platform a legkorszerűbb, szeparált mikroszolgáltatás-architektúrára épül, amely garantálja a maximális teljesítményt, a villámgyors működést és a skálázhatóságot.

- **Kliensoldal (Next.js 16.3, React, TypeScript)**  
  A felhasználói felület, amely a Tailwind CSS keretrendszer és a Framer Motion használatával biztosít prémium, reszponzív és látványosan elegáns megjelenést. A UI/UX tervezésnél a minimalizmus és az átláthatóság a fő szempont.
- **BFF Réteg (Next.js Turbopack Backend)**  
  A szerveroldali renderelésért (SSR) és az adattranszformációkért felelős híd. Kiemelt szerepe van a Partner Portálok (pl. EcoPro) biztonságos session kezelésében és a jogosultságok ellenőrzésében.
- **Core API (Java Spring Boot)**  
  A rendszer robusztus motorja. Ez felel a komplex üzleti logikáért, a pénzügyi tranzakciók hitelesítéséért és az adatintegritásért.

## 3. Hibrid Adatbázis Stratégia

A komplex adatigények és a partneri adatok szigorú szétválasztása megköveteli a célirányos adatbázis-technológiák alkalmazását:

- **PostgreSQL**: A strukturált adatok és a pénzügyi modul megingathatatlan gerince. A relációs modell garantálja a könyvelési egyenlegek és audit naplók abszolút pontosságát.
- **MongoDB**: A rugalmas adatok, foglalások, és partner-specifikus konfigurációk tárolására. Kiemelten fontos a `portal-scope` (pl. `portal: "ecopro"`) alapú szeparáció a lekérdezéseknél.
- **Redis (In-Memory Cache)**: A felhasználói munkamenetek (session) és a gyakori lekérdezések gyorsítótárazására, ami szinte azonnali oldalbetöltési időt eredményez.

## 4. DevOps, Konténerizáció és CI/CD

Az üzemeltetés és a telepítés teljesen automatizált, a legmagasabb iparági sztenderdeket követi.

- **Teljes Docker Izoláció**: A mikroszolgáltatások önálló konténerekben futnak. Ha egy adott partner portáljának forgalma megnő, a rendszer automatikusan és elszigetelten skálázza azt fel, anélkül, hogy a többi modult érintené.
- **Zero Downtime CI/CD**: A GitHub-alapú verziókezelésből induló automatizált folyamatok gondoskodnak a szigorú tesztelésről. Az új funkciók és frissítések élesítése leállás nélkül (Zero Downtime) történik.

## 5. Intelligens Pénzügyi Modul és Automatizáció

A pénzügyi adminisztráció tehermentesítése érdekében modern AI és feldolgozó eszközöket alkalmazunk:

- **OCR és Adatkinyerés (IDP)**: A beérkező számlák, szállítólevelek és dokumentumok automatikus beolvasása, intelligens értelmezése és előkönyvelése.
- **E-Nyugta és NAV Készenlét**: Az adatbázis architektúra felkészített a digitális nyugta szabványok és a közvetlen NAV adatkapcsolatok jövőbeli integrációjára.

## 6. Biztonság, Adatizoláció és Kiterjeszthetőség

A Pannon Transfer ökoszisztémájában a partnerek és adatok védelme nem ismer kompromisszumot.

- **Szigorú Jogosultságkezelés (RBAC)**: Partnerenként és szektoronként finomhangolható hozzáférések. Egy EcoPro felhasználó kriptográfiailag garantáltan csak a saját foglalásait és felületeit láthatja, teljesen elszigetelve más partnerek (pl. CATL) adataitól.
- **Dedikált Partner Portálok**: A fő operáció a központi admin rendszeren fut, míg a partnercégek saját, egyedi vizuális arculattal rendelkező, elegáns landing oldalakat és portálokat kapnak, dedikált belépési pontokkal (pl. `/ecopro`).
- **Többplatformos Készenlét**: Az API-alapú architektúra zökkenőmentes csatlakozást biztosít a dedikált mobilalkalmazások (pl. Pannon Transfer Sofőr App) számára.

---
*A dokumentum a Pannon Transfer Zrt. szellemi tulajdona. Az itt leírt architektúra a legmodernebb webes szabványokra és a cég egyedi igényeire lett szabva.*