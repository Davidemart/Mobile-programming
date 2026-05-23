# Relazione Tecnica - Meal Planner & Smart Pantry App

## 1. Descrizione dell'app
**Obiettivo dell'applicazione:** L'app "Meal Planner & Smart Pantry" ha l'obiettivo di semplificare l'organizzazione alimentare quotidiana degli utenti, integrando la gestione delle ricette, il tracciamento degli ingredienti in dispensa, la pianificazione dei pasti settimanali e la compilazione intelligente della lista della spesa.
**Tipologia di utenti:** Studenti universitari, famiglie, e chiunque desideri ottimizzare il tempo speso per cucinare, ridurre gli sprechi alimentari e organizzare meglio la propria dieta.
**Problema risolto:** L'app risolve il problema della disorganizzazione alimentare, che spesso porta a sprecare cibo (ingredienti scaduti o dimenticati) e a perdere tempo prezioso nel decidere cosa cucinare ogni giorno o nello scrivere ripetutamente liste della spesa.
**Scenari d'uso principali:**
1. L'utente torna a casa e non sa cosa cucinare: apre l'app, inserisce cosa ha in dispensa e usa la funzione "Cosa posso cucinare oggi?".
2. L'utente pianifica la settimana la domenica sera: aggiunge i pasti al "Meal Plan", poi clicca su "Genera da Meal Plan" per creare automaticamente la lista della spesa per il lunedì, senza comprare cose che già possiede in casa.

## 2. Requisiti
**Funzionalità implementate:**
*   **Gestione Ricette:** CRUD completo (Creazione, Lettura, Modifica, Cancellazione) delle ricette con relativi dettagli (nome, foto, difficoltà, ingredienti richiesti).
*   **Gestione Dispensa:** Inventario domestico aggiornabile con nome, categoria, quantità, unità di misura e data di scadenza.
*   **Pianificazione Pasti:** Associazione di ricette a giorni e tipi di pasto (Colazione, Pranzo, Cena, Spuntino).
*   **Lista della Spesa:** Lista interattiva con possibilità di aggiungere elementi manualmente o generarli in automatico.
*   **Dashboard e Statistiche:** Panoramica con contatori, pasti di oggi e alert per prodotti in scadenza imminente.

**Feature Avanzate Scelte:**
1.  **Generazione automatica della lista della spesa:** Calcola la differenza tra gli ingredienti richiesti dai pasti pianificati e le quantità attualmente disponibili in dispensa.
2.  **Suggerimento ricette "Cosa cucino oggi?":** Filtra le ricette mostrando solo quelle in cui tutti gli ingredienti necessari sono già presenti in dispensa in quantità sufficienti.

**Eventuali limitazioni note:**
*   Le unità di misura non sono perfettamente convertite automaticamente (es. se in ricetta serve "1 kg" e in dispensa ci sono "1000 g", l'algoritmo di matching esatto per unità potrebbe non riconoscerli come equivalenti senza una libreria esterna di conversione volumi/pesi complessa, ma l'app gestisce correttamente le quantità se l'unità è coerente).

## 3. Progettazione dell'app
L'app è strutturata in 5 tab principali tramite Bottom Navigation:
1.  **Dashboard:** Hub centrale con insight.
2.  **Ricette:** Lista esplorabile con stack navigator per il dettaglio e l'inserimento.
3.  **Dispensa:** Lista per visualizzare le giacenze attuali.
4.  **Meal Plan:** Visualizzazione a scorrimento verticale dei prossimi 7 giorni.
5.  **Spesa:** Checklist generabile dinamicamente.

## 4. Scelte Tecnologiche
*   **Framework:** **React Native** con toolchain **Expo**. Expo permette un avvio rapido, un sistema di build semplificato e un reload immediato su device e simulatori. È stato scelto per rispettare il vincolo ("non in Flutter") e garantire una UI cross-platform di alta qualità con componenti custom native.
*   **Gestione Stato:** **Zustand**. Si è optato per Zustand al posto di Redux per via della sua leggerezza, flessibilità e mancanza di boilerplate inutile. Permette di avere store modulari (Recipe, Pantry, MealPlan, ShoppingList).
*   **Persistenza:** `AsyncStorage` abbinato al middleware `persist` di Zustand. I dati vengono salvati in locale in formato JSON ogni volta che lo stato cambia, evitando la necessità di un backend per il prototipo.
*   **Navigazione:** React Navigation v7 (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`).

## 5. Implementazione
*   **Organizzazione del codice:** Separazione chiara in `components`, `screens`, `navigation`, `store`, `types` e `utils`.
*   **UI/UX:** È stato definito un file `theme.ts` centralizzato per colori, spaziature e font, al fine di garantire coerenza visiva e un'estetica premium (Flat design, drop shadows, colori coerenti).
*   **Complessità significativa:** La generazione della lista della spesa ha richiesto l'aggregazione di più store: iterazione sui pasti pianificati, recupero dei dettagli ricetta, somma delle quantità degli ingredienti necessari accorpati per chiave (`nome_unita`), e successiva sottrazione delle quantità in base alla ricerca esatta nella dispensa locale, per generare la "diff" da acquistare.
