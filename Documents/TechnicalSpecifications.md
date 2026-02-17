# Technical Specifications

This document details the technical implementation of the Little Leap AQL system, including authentication, API structure, and frontend-backend integration.

## 1. Architecture Overview

The system follows a **Serverless** architecture using Google's ecosystem:

*   **Frontend:** Quasar Framework (Vue.js 3 + Vite) PWA.
*   **Backend:** Google Apps Script (GAS) published as a Web App.
*   **Database:** Google Sheets (Relational data modeled in sheets).

## 2. Authentication & Security

### user Identity
*   **Credential Storage:** User data is stored in the `Users` sheet.
*   **Password Handling:** Passwords are **never** stored in plain text. They are hashed using **SHA-256** before storage.
*   **Login Flow:**
    1.  Frontend sends email & password to GAS `doPost`.
    2.  GAS hashes the input password and compares it with the stored hash.
    3.  If valid, GAS generates a `token` (UUID), stores it in the `ApiKey` column, and returns it to the client.

### Stateless API Authentication
*   **Token-Based:** Subsequent API requests must include this `token`.
*   **Validation:** The `validateToken(token)` function in `auth.gs` checks if the received token matches a valid user's `ApiKey`.
*   **Session:** The frontend stores the token in `localStorage`. There is no server-side session; validation is purely simple token matching against the sheet.

## 3. API Design (Google Apps Script)

All traffic is handled via a single entry point: `doPost(e)`.

### Request Format
```json
{
  "action": "functionName",
  "token": "user-auth-token",
  "data": { ...payload }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Optional message",
  "data": { ...resultObject }
}
```

### Key Functions
*   `handleLogin(email, password)`: Authenticates user.
*   `crud(action, sheetName, data)`: Generic handler for Create, Read, Update, Delete operations.

## 4. Frontend Implementation

### Stack
*   **Quasar CLI with Vite**
*   **Pinia**: For state management (Auth, Dashboard data).
*   **Axios**: For HTTP requests to the GAS Web App URL.

### PWA & Offline Capabilities
*   **Service Worker:** Uses Workbox for caching assets and API responses.
*   **Local Persistence:** Critical data (e.g., Product Master) is cached in IndexedDB/localStorage to allow order taking even without internet connectivity. Sync occurs when connection is restored.

## 5. Data Persistence (Google Sheets)

### Optimization
*   **Skipping Headers:** Scripts are configured to skip the first $N$ rows (headers) for faster reads.
*   **Batch Operations:** `getValues()` and `setValues()` are used to minimize calls to the SpreadsheetApp API, which is slow.
*   **Concurrency:** Google Sheets has limits on concurrent writes. The system uses lock services where critical to prevent race conditions.
