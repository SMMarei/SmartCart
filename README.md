# FWE-WS-24-25-772434

# Projektbeschreibung

Die Einkaufslisten-App unterstützt die Nutzer bei der Erstellung und Verwaltung verschiedener Einkaufslisten und
ermöglicht es, den Fortschritt der Einkäufe zu verfolgen. Die App besteht aus einem Backend (Aufgabe 1) und
weiteren Funktionen, die später hinzugefügt werden (Aufgabe 2). Das Ziel ist eine intuitive und nützliche Lösung
für die Organisation und Optimierung von Einkäufen.

## Aufgabe 1 Backend: Einkaufslisten-App

In der ersten Hausaufgabe liegt der Fokus auf dem Backend der App, das mit Node.js und TypeScript entwickelt werden
soll.
Als Webserver wird Express genutzt. Die Daten sind in einer PostgreSQL Datenbank gespeichert.

## Features & Funktionalitäten

### Grundfunktionen:

#### Einkaufslisten:

- **Neue Einkaufslisten erstellen**: Nutzer können neue Einkaufslisten mit einem Namen und einer Beschreibung
  hinzufügen.
- **Einkaufslisten anzeigen**: Nutzer können aller hinzugefügten Einkaufslisten angezeigt bekommen.
- **Einkaufslisten bearbeiten**: Nutzer können schon die Namen oder/und Beschreibung der existierenden Einkaufslisten
  bearbeiten.
- **Einkaufslisten löschen**: Nutzer können Einkaufslisten entfernen.
- **Einkaufslisten suchen**: Nutzer können nach Einkaufslisten basierend auf ihrem Namen oder ihrer Beschreibung suchen
  ODER
- Einkaufsliste anhand des Artikels suchen bzw. finden.
- **Zur Einkaufsliste Artikel hinzufügen**: Nutzer können zu einer Einkaufsliste Artikel hinzufügen.
- **Von der Einkaufsliste Artikel entfernen**: Nutzer können von einer Einkaufsliste Artikel entfernen.
- **Einkaufslisten sortieren**: Nutzer bekommen Einkaufslisten nach dem letzten UpdatedDatum sortieret angezeigt.

#### Artikel:

- **Artikel erstellen**: Nutzer können neue Einkäufe mit einem Namen, einer Beschreibung und einem Foto (optional)
  hinzufügen.
- **Artikel anzeigen**: Nutzer können eine Liste aller hinzugefügten Einkäufe anzeigen.
- **Artikel bearbeiten**: Nutzer können Name oder/und Beschreibung zu bestehenden Einkäufen bearbeiten.
- **Artikel löschen**: Nutzer können Einkäufe entfernen.
- **Artikel zu einer Einkaufsliste hinzufügen**: Nutzer können bestehende Einkäufe zu einer Einkaufsliste hinzufügen.
- **Artikel von einer Einkaufsliste entfernen**: Nutzer können Einkäufe von einer Einkaufsliste entfernen.
- **Artikel als Favoriten markieren**: Nutzer können Einkäufe als Favoriten oder nicht Favoriten markieren.

### Spezielle Funktionen (Freestyle Tasks):

#### FreeStyle Task 1:

- **Sortierung nach Aktualisierungsdatum**: Einkaufslisten können nach dem letzten Änderungsdatum sortiert werden.
- **Favoriten-Status**: Einkäufe können als Favoriten markiert und gefiltert werden.
- **Alle Favoriten anzeigen**: Alle favorisierten Einkäufe können auf einer Seite angezeigt werden.

#### FreeStyle Task 2:

- **Daten von externer API hinzufügen**: Nutzer können Anleitungen ( Instruction) von einem Artikel von einer
  externen API (https://www.themealdb.com/api.php) bekommen.

### Backendstruktur

    .
    ├── backend
    │   ├── src
    │   │   ├── controllers
    │   │   │   ├── ItemController.ts
    │   │   │   ├── ShoppingListController.ts
    │   │   │   └── ...
    │   │   ├── entities
    │   │   │   ├── Item.ts
    │   │   │   ├── ShoppingList.ts
    │   │   │   └── ShoppingListItems.ts
    │   │   ├── services
    │   │   │   ├── ErrorHandler.ts
    │   │   │   ├── ItemService.ts
    │   │   │   ├── ShoppingListService.ts
    │   │   │   └── Validator.ts
    │   ├── .env
    │   ├── package.json
    │   └── tsconfig.json

## Routenstruktur

#### Backend:

    **ItemController**:
    GET /AllItems
    POST /NewItem
    DELETE /:itemId
    PUT /:itemId
    POST /:itemId
    **Freestyle Task 1:**
    PUT /Favorite/:itemId
    GET /AllFavouriteItems

    **ShoppingListController**:
    GET /AllShoppingLists
    POST /NewShoppingList
    DELETE /:id
    PUT /ShoppingList/:id
    GET /ShoppingListWithItem/:itemName
    POST /NewItemToShoppingList/:id
    DELETE /ItemFromShoppingList/:listId/:itemName
    GET /ShoppingList/search

    **Freestyle Task 1:**
    GET /LastUpdatedShoppingList
    
    **Freestyle Task 2:**
    GET /api/:prodName

## Aufgabe 2 Frontend: Einkaufslisten-App

In der zweiten Hausaufgabe liegt der Fokus auf dem Frontend der App, das mit React und TypeScript entwickelt werden.
Die App soll die Funktionalitäten des Backends nutzen und eine intuitive Benutzeroberfläche bieten.

### Frontendstruktur

    .
    ├── app
    │   ├── src
    │   │   ├── components
    │   │   │   ├── AddNewItem.tsx
    │   │   │   ├── AddShoppingList.tsx
    │   │   │   ├── AllFavourtieItems.tsx
    │   │   │   └── FindShoppingList
    |   |   |   |── HomeNavi
    │   │   ├   ├── ItemsInList.tsx
    │   │   │   ├── ItemsPage.tsx
    │   │   │   └── ...
    │   │   |── interfaces
    │   │   │   ├── Item.ts
    │   │   │   ├── ShoppingList.ts 
    │   │   │   └── ...
    │   │   ├── pages
    │   │   │   ├── Items.tsx
    │   │   │   ├── ShoppingLists.tsx
    │   │   │   └── ...
    │   │   ├── services
    │   │   │   ├── ItemService.ts
    │   │   │   ├── ShoppingListService.ts
    │   │   │   └── ...
    │   │   ├──Styles
    │   │   │   ├── AllFavourtieItems.css
    │   │   │   ├── Home.css
    │   │   │   └── ItemFormularStyles.css
    │   │   │   └── ItemPasgesStyles.css
    │   │   │   └── ListFormularStyles.css
    │   │   │   └── Navigation.css
    │   │   │   └── Root.css
    │   │   ├── App.css
    │   │   ├── App.tsx
    │   │   ├── index.tsx
    │   │   └── ...
    │   ├── .eslintrc.js
    │   ├── .prettierrc
    │   ├── package.json
    │   └── tsconfig.json

## Technologien

- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Mikro-ORM
- **Frontend**: React, TypeScript, Material-UI
- **Datenbank**: PostgreSQL
- **Linting**: ESLint
- **Code-Formatierung**: Prettier

### Voraussetzungen

- Node.js
- PostgreSQL
- npm
- Git
- pgAdmin (optional)
- Postman (optional)
- ESLint (optional)
- Prettier (optional)
- Mikro-ORM (optional)
- Material-UI (optional)
- React (optional)
- TypeScript (optional)
- Express (optional)

## Applikation starten

### Backend

    .env Inhalt für die Datenbankverbindung (Mikro-ORM):
        DATABASE_URL=postgresql://benutzername:passwort@hostname:port/datenbankname
    
    1. Navigieren Sie in das Backend-Verzeichnis: `cd backend`
    2. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
    3. Starten Sie den Server: `npm run start:dev`
    4. Datenbank erstellen oder aktualisieren: `npm run schema:fresh`

### Frontend

    1. Navigieren Sie in das Frontend-Verzeichnis: `cd frontend`
    2. Navigation in das Frontend-Verzeichnis: `cd app`
    3. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
    4. Starten Sie die Anwendung: `npm run dev`

**Hinweis**:

- Der Backend-Code wurde standardmäßig auf Englisch verfasst.
- Der Frontend-Code ist ebenfalls auf Englisch geschrieben.
- Die Rückmeldungen und Fehlermeldungen hingegen sind auf Deutsch, da die App für deutschsprachige Nutzer entwickelt
  wurde und Fehlermeldungen für die Zielgruppe in ihrer Sprache verständlicher sein sollten.


    
