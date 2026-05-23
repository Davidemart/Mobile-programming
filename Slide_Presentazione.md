# Slide 1: Titolo
**Meal Planner & Smart Pantry App**
*Progetto di Mobile Programming*
*Sviluppato in React Native*

---

# Slide 2: L'Idea dell'App
**Organizzare, Pianificare, Risparmiare**
*   **Cosa fa?** Un'unica app per gestire le ricette, tracciare cosa c'è in casa (dispensa), pianificare i pasti e fare la spesa in modo intelligente.
*   **Problema risolto:** Sprechi alimentari e disorganizzazione (il classico "cosa mangiamo stasera?").
*   **Target:** Studenti fuori sede, famiglie, appassionati di fitness.

---

# Slide 3: Funzionalità Principali
**Un ecosistema connesso**
1.  **Dashboard:** Riepilogo e statistiche (prodotti in scadenza).
2.  **Ricette:** CRUD e consultazione rapida.
3.  **Dispensa:** Inventario con quantità e date di scadenza.
4.  **Meal Plan:** Calendario settimanale dei pasti.
5.  **Lista Spesa:** Lista interattiva.

---

# Slide 4: Feature Avanzate
**L'intelligenza dietro l'app**
*   **Smart Shopping List:** L'app calcola cosa comprare leggendo il Meal Plan e *sottraendo* quello che hai già in Dispensa. Addio doppioni!
*   **Recipe Suggester:** Un bottone "Cosa cucino oggi?" filtra magicamente solo le ricette che puoi preparare immediatamente senza uscire di casa, basandosi sulla giacenza attuale.

---

# Slide 5: Scelte Progettuali & UX
**Design Moderno e Intuitivo**
*   **Bottom Tabs Navigation:** Navigazione rapida tra i 5 moduli principali.
*   **Tema centralizzato:** Palette colori fresh (Verde e Arancione) per richiamare il mondo del cibo, con focus sulla leggibilità.
*   **Feedback Visivo:** Badge dinamici (es. "Scaduto", "Scade tra 2 gg"), Icone contestuali (Ionicons).

---

# Slide 6: Tecnologie Utilizzate
*   **Framework:** React Native + Expo (cross-platform, fast reload).
*   **Navigazione:** React Navigation (Bottom Tabs + Native Stack).
*   **State Management:** Zustand (leggero e potente, senza boilerplate).
*   **Persistenza Dati:** AsyncStorage (salvataggio locale dei JSON, zero backend).

---

# Slide 7: Difficoltà Incontrate & Soluzioni
*   **Gestione dipendenze e collisioni versioni React Native:** Risolto usando `legacy-peer-deps` in attesa dell'allineamento dei pacchetti terzi con l'ultimissima release di RN.
*   **Calcolo intelligente della spesa:** L'algoritmo di merge delle quantità (es. ricetta 1 chiede 2 uova, ricetta 2 chiede 3 uova = 5 uova totali - 2 uova in dispensa = compra 3 uova) ha richiesto una normalizzazione delle stringhe (lowercase) e delle unità di misura.

---

# Slide 8: Demo Time
*(Prepararsi a mostrare l'app funzionante sul simulatore o dispositivo reale)*
Flusso suggerito:
1. Aggiungere una ricetta.
2. Mettere alcuni ingredienti in dispensa.
3. Assegnare la ricetta al Meal Plan di domani.
4. Premere "Genera da Meal Plan" nella Lista della Spesa.
5. Mostrare i filtri.

---
# Slide 9: Q&A
**Grazie per l'attenzione!**
*Domande?*
