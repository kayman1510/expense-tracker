# Expense Tracker Project Specification

## 1. Project Overview

Expense Tracker is a personal web application for recording, viewing, and managing day-to-day expenses. The purpose of this project is to practice building a full web app in VS Code using Git for version control and Claude Code as an AI coding assistant. The app will focus on a simple, clean, and practical Version 1 that uses free technologies only.

## 2. Goal

The goal of this project is to build a simple personal expense tracking web app that allows a user to add expenses, view expense records, and monitor spending in an organized way. This project is also intended as a hands-on practice project for learning project setup, Git workflow, app structure, and AI-assisted coding with Claude Code.

## 3. Target User

The target user for Version 1 is a single personal user who wants to track their own expenses locally.

## 4. Version 1 Objective

Version 1 will focus on the core expense tracking workflow only. The first working version should allow the user to enter expense data, save it, and view saved expense records through a simple web interface.

## 5. Core Features for Version 1

Version 1 of the Expense Tracker app will include the following core features:

1. Add a new expense
2. View all saved expenses
3. Store expense data in a local database
4. Show expense details in a simple table or list
5. Allow basic categorization of expenses
6. Record the date of each expense
7. Keep the interface simple and easy to use

## 6. Out of Scope for Version 1

The following items are intentionally out of scope for the first version of the project:

1. User login and authentication
2. Multi-user support
3. Cloud database or paid hosting
4. Mobile app version
5. Budget forecasting
6. Charts and advanced analytics
7. Export to Excel or PDF
8. Recurring expense automation
9. AI insights or recommendations
10. Bank account integration

## 7. Expense Data Fields

Each expense record in Version 1 will contain the following fields:

1. ID
2. Title
3. Amount
4. Category
5. Expense Date
6. Notes
7. Created At

### Field Notes

- ID: unique identifier for each expense
- Title: short name of the expense
- Amount: money spent on the expense
- Category: type of expense such as Food, Transport, Bills, Shopping, or Other
- Expense Date: the date when the expense happened
- Notes: optional short description
- Created At: timestamp for when the record was added to the system

## 8. Technology Stack

The project will use the following technologies for Version 1:

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- FastAPI

### Database
- SQLite

### Development Tools
- VS Code
- Git
- GitHub
- Claude Code

### Cost Constraint
All core technologies used in Version 1 must be free to use for local development. No paid database, hosting, or third-party service will be required for the first version of the project.

## 9. User Workflow

The basic user workflow for Version 1 will be:

1. User opens the Expense Tracker web app
2. User sees a form to add a new expense
3. User enters expense details such as title, amount, category, date, and notes
4. User submits the form
5. The backend validates the input data
6. The expense is saved in the SQLite database
7. The user can view the saved expenses in a list or table on the page
8. The user can continue adding more expenses

## 10. Initial Architecture

Version 1 will use a simple three-part architecture:

1. Frontend
   - Built with HTML, CSS, and JavaScript
   - Provides the user interface for entering and viewing expenses

2. Backend
   - Built with Python and FastAPI
   - Handles API requests, input validation, and business logic

3. Database
   - SQLite database stored locally
   - Saves expense records on the user’s machine

### Architecture Flow

- The user interacts with the frontend in the browser
- The frontend sends requests to the FastAPI backend
- The backend processes the request and reads from or writes to the SQLite database
- The backend returns data to the frontend
- The frontend displays the result to the user

## 11. Initial Folder Structure

The initial project folder structure for Version 1 will be:

expense-tracker/
├── backend/
├── frontend/
├── data/
├── README.md
├── project-spec.md
└── .gitignore

### Folder Purpose

- backend/: FastAPI application code
- frontend/: HTML, CSS, and JavaScript files
- data/: local SQLite database file
- README.md: project introduction
- project-spec.md: project planning and specification document
- .gitignore: files and folders Git should ignore

## 12. Version 1 Deliverable

Version 1 will be considered complete when the project includes the following:

1. A frontend page with a form for adding a new expense
2. Input fields for title, amount, category, expense date, and notes
3. A FastAPI backend that accepts expense data
4. Validation for required fields
5. SQLite database storage for expense records
6. A way to retrieve saved expenses from the backend
7. A frontend display showing saved expenses in a list or table
8. A project structure that runs locally in VS Code
9. All code saved in the Git repository with proper commits

### Version 1 Success Condition

The user should be able to open the app locally, add an expense, save it successfully, and see the saved expense displayed in the interface.