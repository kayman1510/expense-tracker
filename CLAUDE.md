# Claude Code Instructions

This repository contains a simple personal Expense Tracker web application.

Claude should follow the rules below when generating or modifying code.

---

## Project Goal

Build a simple personal expense tracking web application that runs locally and uses only free technologies.

The application should allow a user to:

- add expenses
- store expenses
- view saved expenses

---

## Technology Stack

Claude must use only the following technologies.

Frontend:
- HTML
- CSS
- JavaScript

Backend:
- Python
- FastAPI

Database:
- SQLite

No additional frameworks should be introduced unless explicitly requested.

---

## Project Folder Structure

Claude must respect this folder structure.

```
expense-tracker/
backend/
app/
main.py
routes.py
models.py
database.py
requirements.txt

frontend/

data/

README.md
project-spec.md
CLAUDE.md
.gitignore
```


Claude must not move files outside this structure.

---

## Backend Rules

The backend must:

- use FastAPI
- store expense records in SQLite
- use `database.py` for database connection
- use `models.py` for data structures
- use `routes.py` for API endpoints
- use `main.py` as the application entry point

---

## Frontend Rules

The frontend must:

- be simple
- use plain HTML, CSS, and JavaScript
- communicate with the backend via HTTP API calls

No frontend frameworks should be used.

---

## Version 1 Scope

Claude must only implement the Version 1 features defined in `project-spec.md`.

Do not add features beyond Version 1.

---

## Code Style

Claude should generate code that is:

- simple
- readable
- minimal
- easy for a beginner to understand

Avoid unnecessary complexity.

---

## Development Environment

The application should run locally in VS Code using Python and FastAPI.

The SQLite database file should be stored inside the `data` folder.