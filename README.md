# TransitOps — Smart Transport Operations Platform

TransitOps is an end-to-end transport and logistics operations platform designed to streamline vehicle rosters, operator onboarding, trip dispatch, maintenance tracking, and fuel expense logging through workflow digitization, business rule enforcement, and real-time operational analytics.

---

## 🛠️ Technology Stack

### Backend
* **Language & Runtime**: Java 21 (JDK 25 source/release target compatibility)
* **Framework**: Spring Boot 3.1.5
* **Security & Authentication**: Spring Security (Stateless JWT Filter Chain, CORS filters, BCrypt password hashing)
* **Data Access**: Spring Data JPA / Hibernate ORM
* **Database**: In-Memory H2 Database (configured in PostgreSQL Dialect mode for zero-setup execution)
* **Boilerplate Reduction**: Project Lombok (v1.18.46)

### Frontend
* **Build Tool**: Vite 5
* **Library**: React 18 (Hooks, Context Provider Architecture)
* **Routing**: React Router DOM v6
* **Styling**: Tailwind CSS & Vanilla CSS (curated themes, glassmorphism, responsive grids)
* **Icons**: Lucide React
* **Client**: Axios (request/response interceptors automatically mapping bearer tokens and session timeouts)
* **Analytics**: Recharts (for KPIs and visualization widgets)

---

## 🚀 Key Modules & Business Rules

### 1. Authentication & Security Gateways
* Role-based access control supporting multiple profiles:
  * **Fleet Manager**: Full administrative dashboard permissions.
  * **Driver**: Operations board access.
  * **Safety Officer**: Compliance and operator licensing views.
  * **Financial Analyst**: Expense ledgers and operational ROI metrics.
* Stateless token authentication with request filters validating bearer signatures on API requests.

### 2. Vehicle Roster Management
* Onboards transport assets with registration numbers, load capacities, acquisition metrics, and odometers.
* Automates status cycles (`Available`, `On_Trip`, `In_Shop`, `Retired`) to restrict double-booking or routing assets undergoing repairs.

### 3. Operator Registry
* Tracks licensing category classifications, contact details, safety scores, and medical clearances.
* Enforces validations blocking operators with expired commercial licenses from receiving dispatch routes.

### 4. Smart Trip Dispatch Board
* Automates route planning and scheduling (`Draft` -> `Dispatched` -> `Completed` / `Cancelled`).
* Enforces strict business validations on dispatch:
  * Verifies cargo weight does not exceed the vehicle's maximum load capacity.
  * Verifies that both the vehicle and operator are currently set to `Available`.
  * Verifies the operator's driver license is active and unexpired.
* Completing a route prompts distance logs, updates the vehicle odometer, and returns the operator and vehicle back to `Available`.

### 5. Maintenance Desk
* Schedules service checks and repairs, logging total maintenance costs.
* Intaking a vehicle to the shop automatically toggles its status to `In_Shop` and blocks new trip assignments.

### 6. Fuel & Auto-Expense Logger
* Captures fuel purchases (liters added, transaction cost).
* **Auto-Expense Integration**: Logging fuel automatically generates and records a matching ledger entry of type `"Fuel"`, updating overall fleet expense sheets.

### 7. Performance & Financial Analytics
* Computes real-time KPIs (Active Vehicles, Operators on Duty, Fleet Utilization rates).
* Computes financial stats including vehicle Acquisition Costs vs. Trip Revenues to generate ROI percentages and fuel economy charts.

---

## 🏃 Run Instructions

### 1. Launch the Backend
Navigate to the `backend` folder and run the packaged jar file:
```powershell
cd TransitOps/backend
java -jar target/transitops-backend-0.0.1-SNAPSHOT.jar
```
*Note: The backend is configured to run on port **`8085`**.*

### 2. Launch the Frontend
Navigate to the `frontend` folder and run:
```powershell
cd TransitOps/frontend
npm install
npm run dev
```
*Note: The frontend runs on port **`3000`** and proxies API traffic to port `8085`.*

---

## 🔑 Seeded Credentials

Upon startup, the database seeder automatically populates the following accounts (all share the password **`Password123`**):

| Role | Email | Password |
| :--- | :--- | :--- |
| **Fleet Manager** | `fleet.mgr@transitops.com` | `Password123` |
| **Driver** | `driver.alex@transitops.com` | `Password123` |
| **Safety Officer** | `safety.off@transitops.com` | `Password123` |
| **Financial Analyst** | `fin.analyst@transitops.com` | `Password123` |
