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

- **Einkaufslisten hinzufügen**: Nutzer können neue Einkaufslisten mit einem Namen und einer Beschreibung hinzufügen.
- **Einkaufslisten anzeigen**: Nutzer können aller hinzugefügten Einkaufslisten angezeigt bekommen.
- **Einkaufslisten bearbeiten**: Nutzer können neue oder schon existierende Artikel zu Einkaufslisten hinzufügen,
- auch die bestehenden Artikel von Einkaufslisten löschen.
- **Einkaufslisten löschen**: Nutzer können Einkaufslisten nach ihrer Namen entfernen.
- Einkaufslisten suchen: Nutzer können nach Einkaufslisten basierend auf ihrem Namen oder ihrer Beschreibung suchen.
- **Artikel erstellen**: Nutzer können neue Einkäufe mit einem Namen, einer Beschreibung und einem Foto hinzufügen.
- **Artikel anzeigen**: Nutzer können eine Liste aller hinzugefügten Einkäufe anzeigen.
- **Artikel bearbeiten**: Nutzer können Name oder Beschreibung zu bestehenden Einkäufen bearbeiten.
- **Artikel löschen**: Nutzer können Einkäufe entfernen.
- **Artikel zu einer Einkaufsliste hinzufügen**: Nutzer können bestehende Einkäufe zu einer Einkaufsliste hinzufügen.
- **Artikel von einer Einkaufsliste entfernen**: Nutzer können bereits vorhandene Einkäufe von einer Einkaufsliste
  entfernen.
- **Artikel suchen**: Nutzer können nach Einkäufen basierend auf ihrem Namen oder ihrer Beschreibung suchen.

### Spezielle Funktionen (Freestyle Tasks):

- **Top-Einkäufe**: Beliebte Einkäufe, sortiert nach Menge.
- **Sortierung nach Aktualisierungsdatum**: Einkaufslisten können nach dem letzten Änderungsdatum sortiert werden.
- **Favoriten-Status**: Einkäufe können als Favoriten markiert und gefiltert werden.

## Technologien

- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Mikro-ORM
- **Frontend**: React, TypeScript, Material-UI
- **Datenbank**: PostgreSQL
- **Linting**: ESLint
- **Code-Formatierung**: Prettier

## Projektstruktur

### Backend

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
    │   │   │   └── ...
    │   │   ├── services
    │   │   │   ├── ItemService.ts
    │   │   │   ├── ShoppingListService.ts
    │   │   │   └── ...
    │   ├── .env
    │   ├── package.json
    │   └── tsconfig.json

### Frontend

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

## Routenstruktur

    Backend:

    GET /AllItems
    POST /NewItem
    DELETE /:itemId
    PUT /:itemId
    PUT /Favorite/:itemId
    GET /AllFavouriteItems
    POST /:itemId


    Frontend:

    GET /items
    GET /items/:id
    POST /items
    PUT /items/:id
    DELETE /items/:id
    GET /shopping-lists
    GET /shopping-lists/:id
    POST /shopping-lists
    PUT /shopping-lists/:id
    DELETE /shopping-lists/:id
    GET /shopping-lists/:id/items
    POST /shopping-lists/:id/items
    DELETE /shopping-lists/:id/items/:itemId
    GET /items/search
    GET /shopping-lists/search

## Aufsetzen der Applikation

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




    
