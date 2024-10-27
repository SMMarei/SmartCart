# FWE-WS-24-25-772434

# Projektbeschreibung
Die Einkaufslisten-App unterstützt die Nutzer bei der Erstellung und Verwaltung verschiedener Einkaufslisten und 
ermöglicht es, den Fortschritt der Einkäufe zu verfolgen. Die App besteht aus einem Backend (Aufgabe 1) und 
weiteren Funktionen, die später hinzugefügt werden (Aufgabe 2). Das Ziel ist eine intuitive und nützliche Lösung 
für die Organisation und Optimierung von Einkäufen.

## Aufgabe 1 Backend: Einkaufslisten-App

In der ersten Hausaufgabe liegt der Fokus auf dem Backend der App, das mit Node.js und TypeScript entwickelt werden soll.
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
- **Artikel von einer Einkaufsliste entfernen**: Nutzer können bereits vorhandene Einkäufe von einer Einkaufsliste entfernen.
- **Artikel suchen**: Nutzer können nach Einkäufen basierend auf ihrem Namen oder ihrer Beschreibung suchen.

### Spezielle Funktionen (Freestyle Tasks):
- **Top-Einkäufe**: Beliebte Einkäufe, sortiert nach Menge.
- **Sortierung nach Aktualisierungsdatum**: Einkaufslisten können nach dem letzten Änderungsdatum sortiert werden.
- **Favoriten-Status**: Einkäufe können als Favoriten markiert und gefiltert werden.

##  Routenstruktur
    Backend:
    - `GET /shoppingLists/GetAllShoppingLists`: Ruft eine Liste aller Einkaufslisten ab.
    - `POST /shoppingLists/CreateShoppingList`: Erstellt eine neue Einkaufsliste.
    - `DELETE /shoppingLists/DeleteShoppingList/:listName`: Löscht eine bestimmte Einkaufsliste.
    - `PUT /shoppingLists/AddItemToShoppingList/:listName/:itemName`: Fügt einen Artikel zu einer bestimmten Einkaufsliste hinzu.
    - `PUT /shoppingLists/DeleteItemFromShoppingList/:listName/:itemName`: Entfernt einen Artikel von einer bestimmten Einkaufsliste.
    - `GET /shoppingLists/SearchShoppingListByName/:listName`: Ruft eine Einkaufsliste anhand ihres Namens ab.
    - `GET /shoppingLists/SearchShoppingListByDescription/:listDescription`: Ruft Einkaufsliste anhand ihrer Beschreibung ab.
    - `GET /shoppingLists/GetShoppingListWithItem/:itemName`: Ruft Einkaufsliste  mit bestimmten Artikel ab.   
    - `GET /shoppingLists/SortLastUpdatedShoppingList`: Freestyle Task 1. Sortiert Einkaufsliste nach dem letzten Änderungsdatum.
   
    - `GET /items/GetPopularItems`: Freestyle Task 1. Ruft eine Liste der häufig gekauften anhad ihrer Menge ab.
    - `GET /items/GetFavoriteItems`: Freestyle Task 1. Ruft eine Liste der favorisierten Artikeln ab.
    - `GET /items/SearchItemsByName/:itemName`: Sucht nach Artikeln basierend auf ihrem Namen.
    - `GET /items/SearchItemsByDescription/:itemDescription`: Sucht nach Artikeln basierend auf ihrer Beschreibung.
    - `PUT /items/ToggleFavorite/:itemName`: Markiert einen Artikel als Favorit oder Wenn einen Favoiten Artikel als nicht Favorite .
    - 'PUT /items/ChangeItemName/:itemName': Aktualisiert einen bestimmten Artikel. 
    - 'PUT /items/ChangeItemDescription/:itemDescription': Aktualisiert die Beschreibung eines bestimmten Artikels.
    - 'POST /items/CreateItem': Erstellt einen neuen Artikel.
    - 'GET /items/GetAllItems': Ruft eine Liste aller Artikel ab.
    - `DELETE /items/DeleteItem/:itemName`: Löscht einen bestimmten Artikel.
 
##  Aufsetzen der Applikation
### Backend
    .env Inhalt für die Datenbankverbindung (Mikro-ORM):
        DATABASE_URL=postgresql://benutzername:passwort@hostname:port/datenbankname
    
    1. Navigieren Sie in das Backend-Verzeichnis: `cd backend`
    2. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
    3. Starten Sie den Server: `npm run start:dev`
    4. Datenbank erstellen oder aktualisieren: `npm run schema:fresh`
    
### Frontend
    1. Navigieren Sie in das Frontend-Verzeichnis: `cd frontend`
    2. Installieren Sie die notwendigen Abhängigkeiten: `npm install`
    3. Starten Sie die Anwendung: `npm start`
    
