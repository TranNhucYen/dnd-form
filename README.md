# DragForm - Form Design & Publishing Web Application

---

# PART 1: OVERVIEW & CORE FEATURES

## 1. Overview
- **DragForm** is a web-based application designed for creating, managing, and printing forms, applications, or surveys directly within a browser.

- Users interact directly on a paper-like canvas: selecting required components and placing them into position rather than manually configuring layouts.

---

## 2. Core Features

### 1. Drag-and-Drop Form Design
* **Paper Canvas Interface**: Simulates a physical printed page. Supports common standard paper sizes (A4, A3, A5) in portrait or landscape orientations, with customizable page margins.
* **Basic Components**:
  * Headings, labels, and instructional text.
  * Input fields (text, number, date).
  * Selection dropdowns and checkboxes.
  * Data tables.
  * Images and QR codes.
  * Signature boxes.
* **Alignment Guides**: Displays dynamic alignment guidelines (smart guides) when moving elements to help keep items aligned with one another.

### 2. Multi-Page Document Editing
* Supports creating documents with one or multiple pages.
* Allows switching between pages during design, adding new pages, or removing unnecessary pages as needed.
* When printed or exported, pages are arranged in sequential order.

### 3. Template Library
* Provides pre-built templates such as leave requests, surveys, and basic agreements.
* Users can preview template contents and duplicate a copy into their account for customization.

### 4. Personal Form Management
* Centralized list displaying all forms created by the user.
* Supports searching by title, reopening for edits, duplicating into a new form, or deleting obsolete forms.

### 5. Sharing & Collaboration
* **Online View Link**: Generates shareable links allowing others to view and print forms in a browser without requiring authentication.
* **Invite via Email**: Shares view or edit permissions with other registered accounts.

### 6. Printing & PDF Export
* Allows previewing the document layout prior to printing.
* Supports direct browser printing or exporting to a PDF file conforming to the selected page size.

### 7. Community Form Contributions
* Users can submit their self-designed forms for administrative review.
* Approved forms are published to the public template library for other users to reference and use.

---

# PART 2: TECHNICAL SPECIFICATION & SETUP GUIDE

## 1. Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19).
* **Language**: TypeScript.
* **UI & Styling**: Tailwind CSS, Radix UI, Lucide React, Sonner.
* **Drag-and-Drop**: `@dnd-kit/react`.
* **Rich Text & Table Editor**: TipTap Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`).
* **Client State Management**: Zustand (Form Builder workspace).
* **Database & ORM**: MySQL 8.x, [Drizzle ORM](https://orm.drizzle.team/).
* **Authentication**: JWT (jose) stored in HttpOnly Cookies.
* **PDF Export Engine**: Headless Chromium via [Puppeteer](https://pptr.dev/).
* **File Storage**: Supports local disk storage (`local`) or S3-compatible cloud storage (`s3`).

---

## 2. System Architecture

### 2.1. 4-Layer Architecture

The codebase is organized into four separate layers:

```text
╭───────────────────────╮      ╭───────────────────────╮      ╭───────────────────────╮      ╭───────────────────────╮
│      Repository       │ ───> │        Service        │ ───> │     Server Action     │ ───> │       Hook / UI       │
├───────────────────────┤      ├───────────────────────┤      ├───────────────────────┤      ├───────────────────────┤
│ • Database / Mock data│      │ • Business logic      │      │ • Auth & Permissions  │      │ • UI state management │
│ • Image URL resolution│      │ • Input validation    │      │ • Unified error handle│      │ • User interactions   │
│ • Drizzle ORM queries │      │ • Throws AppError     │      │ • ActionResponse DTO  │      │ • Canvas rendering    │
╰───────────────────────╯      ╰───────────────────────╯      ╰───────────────────────╯      ╰───────────────────────╯
```

### 2.2. Internal Units System

To minimize rounding errors between different screen display densities (DPI/PPI) and physical printouts:
* **Unit Convention**:
  $$\mathbf{100\text{ Internal Units} = 1\text{ mm}}$$
  *(For example, an A4 page measuring $210 \times 297\text{ mm}$ is represented as $21000 \times 29700\text{ units}$)*.
* **Screen Display Conversion**: Converted using standard CSS ratio `CSS_PX_PER_MM = 96 / 25.4` (~`3.7795 px/mm`).
* Element coordinates ($x, y$), dimensions, and page margins stored in the database all use integer `InternalUnit` values.

---

## 3. Form Data Model (`FormSchemaJson`)

JSON schema structure representing multi-page form documents:

```typescript
// Page configuration
export interface SchemaPageSettings {
  preset: "A3" | "A4" | "A5";
  orientation: "PORTRAIT" | "LANDSCAPE";
  margins: {
    top: InternalUnit;
    bottom: InternalUnit;
    left: InternalUnit;
    right: InternalUnit;
  };
  dimensions: {
    width: InternalUnit;
    height: InternalUnit;
  };
}

// Field component structure
export interface BaseSchemaField<T extends FieldType> {
  id: string;
  type: T;
  x: InternalUnit;
  y: InternalUnit;
  width?: InternalUnit;
  height?: InternalUnit;
  style?: FieldStyle;
  data?: FieldDataMap[T];
}

// Represents an independent page
export interface FormPageSchema {
  id: string;
  pageNumber: number;
  name?: string;
  page: SchemaPageSettings;
  fields: SchemaField[];
}

// Overall schema stored in the database (schema_json.content column)
export interface FormSchemaJson {
  pages: FormPageSchema[];
}
```

---

## 4. Core Technical Modules

### 4.1. Form Builder Engine
* **Zustand Store (`useFormBuilderStore`)**: 
  * Manages the `pages` array, current `activePageId`, and active page properties.
  * Bidirectionally synchronizes data between the active page and the `pages` list.
  * Maintains independent Undo/Redo histories for drag-and-drop operations and TipTap table contents.
* **Field Components**:
  Provides 12 component types: `label`, `text`, `textarea`, `number`, `date`, `select`, `checkbox`, `line`, `datatable`, `image`, `qrcode`, `signature`.
* **Smart Alignment Guides**:
  Compares coordinates of the moving element with surrounding elements along both horizontal and vertical axes to assist alignment (snap threshold: `5px`).

### 4.2. PDF Export Engine (Puppeteer)
* **CSS Print Specifications**:
  * Configures `@page { size: ${w}mm ${h}mm; margin: 0mm !important; }`.
  * Utilizes `break-after: page` to enforce physical page breaks between document pages.
* **Render Readiness Synchronization (`usePrintReadiness`)**:
  Puppeteer monitors the `window.__DRAGFORM_RENDER_READY__` flag, ensuring web fonts (`document.fonts.ready`), tables, and images are fully rendered before capturing the PDF.
* **Process & Context Management**:
  Reuses a shared browser instance and launches isolated browser contexts per PDF export request to conserve system memory and CPU resources.

### 4.3. Media Storage & Hydration Driver
* **Schema and File Data Separation**:
  The schema only stores the file identifier (`fileKey`).
* **Dynamic Hydration on Read (`hydrateImageUrls`)**:
  When loading form data to render on the canvas or to export as PDF, the system automatically resolves the `fileKey` into a valid URL corresponding to the active storage driver.
* **Flexible Storage Drivers**:
  Allows switching between local filesystem storage (`local`) and S3-compatible cloud storage (`s3`, R2 Object Storage, RustFS) via environment configuration.

---

## 5. Installation & Setup Guide

### 5.1. Prerequisites
* **Node.js**: Version `>= 20.x`.
* **Package Manager**: `pnpm` (version `>= 9.x`).
* **Database**: MySQL `>= 8.0` or compatible MariaDB.

### 5.2. Setup Steps

**1. Install project dependencies:**
```bash
pnpm install
```

**2. Configure environment variables (`.env`):**
```bash
cp .env.example .env
```
Fill in the necessary parameters in `.env`:
```env
# Database connection string
DATABASE_URL="mysql://root:password@localhost:3306/dragform_db"

# Data mode (false: real MySQL database, true: in-memory mock data)
USE_MOCK_DATA=false

# Secret key for JWT signing (at least 32 characters)
JWT_SECRET="your_jwt_secret_key_at_least_32_characters"

# Seed administrator account (super_admin)
SUPER_ADMIN_FULL_NAME="Super Admin"
SUPER_ADMIN_EMAIL="admin@dragform.io"
SUPER_ADMIN_PASSWORD="YourPassword123!"

# File storage driver ('local' or 's3')
STORAGE_DRIVER=local
LOCAL_STORAGE_DIR=storage/uploads
LOCAL_PUBLIC_URL=/api/files
```

**3. Initialize database schema & seed initial data:**
```bash
# Push Drizzle schema to MySQL
pnpm db:push

# Seed default system data (roles, admin account)
pnpm db:seed
```

**4. Start development server:**
```bash
pnpm dev
```
Open your browser and navigate to: `http://localhost:3000`

### 5.3. Other Useful Commands
* `pnpm typecheck`: Run TypeScript type-checking without emitting code.
* `pnpm lint`: Run ESLint code quality checks.
* `pnpm build`: Create an optimized production build.