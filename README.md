# Dnd-form - Form Design & Publishing Web Application

---

# PART 1: OVERVIEW & CORE FEATURES

## 1. Overview
- **Dnd-form** is a web-based application for creating, managing, collecting data with, and printing forms, applications, or surveys.
- Users work directly on a paper-like canvas, selecting the components they need and placing them where they belong.

---

## 2. Core Features

### 1. Drag-and-Drop Form Design
* **Paper Canvas Interface**: Simulates a physical printed page. Supports common standard paper sizes (A4, A3, A5) in portrait or landscape orientations, with customizable page margins.
* **Background PDF**: Supports uploading a PDF file as the document background, replacing the background file, and adjusting opacity.
* **Basic Components**:
  * Headings, instructional text, and labels.
  * Input fields (text, textarea, number, date).
  * Date field: supports draggable sliders for location, day, month, and year.
  * Selection dropdowns and square checkboxes.
  * Divider lines (supports toggling dotted lines).
  * Data tables.
  * Images and QR codes.
  * Signature boxes (customizable signer name and labels).
* **Part-Based Styling**: Allows setting font family, font size, and color for each part within a field (label, value, subTitle).
* **Alignment Guides**: Displays dynamic alignment guidelines (smart guides) when moving elements to help keep items aligned with one another.

### 2. Multi-Page Document Editing
* Supports creating documents with one or multiple pages.
* Scrollable page selector supports fast switching between pages.
* Allows switching between pages during design, adding new pages, or removing unnecessary pages as needed.
* When printed or exported, pages are arranged in sequential order.

### 3. Online Data Collection (E-Form)
* Automatically converts print forms into web forms to fill out on desktop or mobile devices.
* Generates public links allowing respondents to fill forms without logging in.
* Configures submission deadlines and submission limits.
* Supports direct signatures, table inputs, and form previews before sharing collection links.

### 4. Submission Management
* Tracks total submissions and completion rates.
* Response table supports custom visible columns, searching, filtering, and sorting by submission date.
* View individual submitted forms and delete when needed.
* Download collected data and export individual submitted forms as PDF files.

### 5. Template Library
* Provides pre-built templates such as leave requests, surveys, and basic agreements.
* Users can preview template contents and duplicate a copy into their account for customization.

### 6. Personal Form Management
* Centralized list displaying all forms created by the user.
* Supports searching by title, reopening for edits, duplicating into a new form, or deleting obsolete forms.

### 7. Sharing & Collaboration
* **Online View Link**: Generates shareable links allowing others to view and print forms in a browser without requiring authentication.
* **Invite via Email**: Shares view or edit permissions with other registered accounts.

### 8. Printing & PDF Export
* Allows previewing the document layout prior to printing.
* Supports direct browser printing or exporting to a PDF file conforming to the selected page size.

### 9. Community Form Contributions
* Users can submit their self-designed forms for administrative review.
* Approved forms are published to the public template library for other users to reference and use.

---

# PART 2: TECHNICAL SPECIFICATION & SETUP GUIDE

## 1. Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, React 19).
* **Language**: TypeScript.
* **UI & Styling**: Tailwind CSS v4, Radix UI, Lucide React, Sonner.
* **Drag-and-Drop**: `@dnd-kit/react`.
* **Rich Text & Table Editor**: TipTap Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`).
* **Client State Management**: Zustand (Form Builder workspace), TanStack React Query (data cache).
* **Database & ORM**: MySQL 8.x or a MySQL-compatible database, [Drizzle ORM](https://orm.drizzle.team/).
* **Authentication**: JWT (jose) stored in HttpOnly Cookies.
* **PDF Export Engine**: Headless Chromium via [Puppeteer](https://pptr.dev/).
* **Background PDF Processing**: `pdf-lib`, `pdfjs-dist`.
* **File Storage**: Supports local disk storage (`local`) or S3-compatible cloud storage (`s3`).
* **Code Quality**: ESLint, Prettier, Husky.
* **E2E Testing**: Playwright.

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

// Styling per field part
export interface FieldPartStyle {
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  color?: string;
  fontSize?: string;
  fontFamily?: string;
}

export interface FieldStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?: "none" | "underline";
  textAlign?: "left" | "center" | "right" | "justify";
  color?: string;
  backgroundColor?: string;
  parts?: Partial<Record<"label" | "value" | "subTitle" | string, FieldPartStyle>>;
}

// Field component structure
export interface BaseSchemaField<T extends FieldType> {
  id: string;
  type: T;
  x: InternalUnit;
  y: InternalUnit;
  width: InternalUnit;
  height: InternalUnit;
  style: FieldStyle;
  data: FieldDataMap[T];
}

// Represents an independent page
export interface FormPageSchema {
  id: string;
  pageNumber: number;
  name?: string;
  page: SchemaPageSettings;
  fields: SchemaField[];
  pdfPageNumber?: number; // Corresponding 1-based index in the source PDF
}

// Background PDF metadata
export interface BackgroundPdfMetadata {
  fileKey: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  totalPages: number;
  opacity?: number;
}

// Overall schema stored in the database (schema_json.content column)
export interface FormSchemaJson {
  pages: FormPageSchema[];
  backgroundPdf?: BackgroundPdfMetadata;
}
```

---

## 4. Core Technical Modules

### 4.1. Form Builder Engine
* **Zustand Store (`useFormBuilderStore`)**: 
  * Manages the `pages` array, current `activePageId`, active page properties, and background PDF metadata.
  * Bidirectionally synchronizes data between the active page and the `pages` list.
  * Maintains independent Undo/Redo histories for drag-and-drop operations and TipTap table contents.
* **Field Components**:
  Provides 12 component types: `label`, `text`, `textarea`, `number`, `date`, `select`, `checkbox`, `line`, `datatable`, `image`, `qrcode`, `signature`.
* **Smart Alignment Guides**:
  Compares coordinates of the moving element with surrounding elements along both horizontal and vertical axes to assist alignment (snap threshold: `5px`).

### 4.2. E-Form Engine & Data Collection
* Converts absolute canvas coordinates into responsive row/column structures for web forms (`schema-to-eform.transformer.ts`).
* Parses TipTap table structure into data entry cells (`table-ast-parser.ts`).
* Maps submitted response data back into the original schema for PDF printing (`hydrate-submission.ts`).

### 4.3. PDF Export Engine (Puppeteer)
* **CSS Print Specifications**:
  * Configures `@page { size: ${w}mm ${h}mm; margin: 0mm !important; }`.
  * Utilizes `break-after: page` to enforce physical page breaks between document pages.
* **Render Readiness Synchronization (`usePrintReadiness`)**:
  Puppeteer monitors the `window.__DRAGFORM_RENDER_READY__` flag, ensuring web fonts (`document.fonts.ready`), tables, images, and background PDFs are fully rendered before capturing the PDF.
* **Process & Context Management**:
  Reuses a shared browser instance and launches isolated browser contexts per PDF export request to conserve system memory and CPU resources.

### 4.4. Media Storage & Hydration Driver
* **Schema and File Data Separation**:
  The schema only stores the file identifier (`fileKey`).
* **Dynamic Hydration on Read (`hydrateImageUrls`)**:
  When loading form data to render on the canvas or to export as PDF, the system automatically resolves the `fileKey` into a valid URL corresponding to the active storage driver.
* **Flexible Storage Drivers**:
  Allows switching between local filesystem storage (`local`) and S3-compatible cloud storage (`s3`, R2 Object Storage, RustFS) via environment configuration.

---

## 5. Installation & Setup Guide

### 5.1. Prerequisites
* **Node.js**: Version `24.x`.
* **Package Manager**: `pnpm` (version `9.15.9`).
* **Database**: MySQL `>= 8.0` or compatible MariaDB.

### 5.2. Setup Steps

**1. Install project dependencies:**
```bash
pnpm install
```
*(The `postinstall` script automatically copies `pdf.worker.min.mjs` into `public/`)*.

**2. Configure environment variables (`.env`):**
```bash
cp .env.example .env
```
Fill in the necessary parameters in `.env`:
```env
# Database connection string
DATABASE_URL="mysql://root:password@localhost:3306/dnd_form_db"

# Data mode (false: real MySQL database, true: in-memory mock data)
USE_MOCK_DATA=false

# Secret key for JWT signing (at least 32 characters)
JWT_SECRET="your_jwt_secret_key_at_least_32_characters"

# Seed administrator account (super_admin)
SUPER_ADMIN_FULL_NAME="Super Admin"
SUPER_ADMIN_EMAIL="admin@dragform.io"
SUPER_ADMIN_PASSWORD="YourPassword123!"   # example only; use a strong unique password in production

# File storage driver ('local' or 's3')
STORAGE_DRIVER=local
LOCAL_STORAGE_DIR=storage/uploads
LOCAL_PUBLIC_URL=/api/files
```

Create the empty `dnd_form_db` database before running the commands below (for example, `CREATE DATABASE dnd_form_db;`). Migrations create tables, but do not create the database.

**3. Initialize the database:**

For a local database, choose **one** of the following methods (do not use both on the same database):
```bash
# Option A: production-like, apply files from drizzle/
pnpm db:migrate

# Option B: sync the schema directly, useful during development
pnpm db:push
```

Then load the default data (roles, permissions, and administrator account):
```bash
pnpm db:seed
```

When changing the schema in `src/db/schema/`, generate a migration and commit the entire `drizzle/` directory:
```bash
pnpm db:generate
```

> **Do not use `pnpm db:push` with a production database:** it may delete data and does not keep a change history. Use `db:migrate` in production.

**4. Start development server:**
```bash
pnpm dev
```
Open your browser and navigate to: `http://localhost:3000`

### 5.3. Other Useful Commands
* `pnpm typecheck`: Run TypeScript type-checking without emitting code.
* `pnpm lint`: Run ESLint code quality checks.
* `pnpm format`: Format source code with Prettier.
* `pnpm build`: Create an optimized production build.
* `pnpm start`: Start the production build.

---

# PART 3: CI/CD & AUTOMATED DEPLOYMENT

## 1. Overview
The workflow in `.github/workflows/ci-cd.yml` checks the source code, builds and pushes Docker images to GitHub Container Registry (GHCR), then deploys the application to EC2 through AWS Systems Manager (SSM), without opening SSH port 22.

The workflow has three jobs that run in sequence: `test` → `build-and-push` → `deploy`. The latter two jobs run only on pushes to `main` or when manually dispatched on `main`.

---

## 2. GitHub variables to create

Before running deployments, go to **Repository → Settings → Secrets and variables → Actions → Variables** and create these Repository variables:

| Variable | Value |
| --- | --- |
| `AWS_ACCOUNT_ID` | ID of the AWS account containing the IAM Role used by GitHub Actions. |
| `AWS_ROLE_NAME` | Name of the IAM Role that allows GitHub Actions to authenticate with OIDC and deploy. |
| `AWS_REGION` | AWS region containing the EC2 instance, for example `ap-southeast-1`. |
| `EC2_INSTANCE_ID` | Instance ID of the EC2 instance to deploy to, for example `i-0123456789abcdef0`. |
| `DEPLOY_DIR` | Deployment directory on EC2, for example `/opt/dnd-form`. |

Use these exact variable names. These are **Repository variables**, not Secrets. The IAM Role needs an OIDC trust policy for GitHub, and EC2 must be managed by SSM to receive commands. GitHub Actions provides `GITHUB_TOKEN` automatically for pushing images to GHCR; you do not need to create it.

---

## 3. Pipeline stages

The pipeline is configured in `.github/workflows/ci-cd.yml`:

### 3.1. Test (`test`)
* Runs on Ubuntu with Node.js 24 and pnpm for pull requests to `main`, pushes to `main`, or manual workflow runs.
* Installs dependencies with `pnpm install --frozen-lockfile`, then runs `pnpm typecheck`.
* The **Check migrations are up to date** step runs `pnpm db:generate` and checks for changes in `drizzle/`. If the schema requires a migration but the migration files have not been generated and committed, the job fails. Run `pnpm db:generate` locally and commit the files in `drizzle/`.

### 3.2. Build and push Docker images (`build-and-push`)
* Runs only after `test` succeeds, for pushes to `main` or `workflow_dispatch` on `main`. Pull requests run only `test`.
* Docker Buildx builds two targets from the `Dockerfile`: `runner`, which contains the Next.js standalone application, Google Chrome Stable, and fonts for PDF export; and `migrator`, which contains the Drizzle schema, migrations, and seed code.
* Pushes images to a GHCR package named with the lowercase repository name. The application image uses the `latest` and `<git SHA>` tags; the migrator image uses the `migrator` and `migrator-<git SHA>` tags. Build cache is stored using GitHub Actions cache.

### 3.3. Deploy to EC2 (`deploy`)
* Runs only after `build-and-push` succeeds, for pushes to `main` or `workflow_dispatch` on `main`.
* GitHub Actions authenticates to AWS with OIDC and the IAM Role, verifies the identity with `aws sts get-caller-identity`, then sends an `AWS-RunShellScript` command to EC2 through SSM.
* The workflow encodes `docker-compose.yml` and sends it to EC2, creates `DEPLOY_DIR` if needed, saves the Compose file there, and creates or updates `.env.deploy` with the current commit's `IMAGE_NAME` and `IMAGE_TAG`. The application's `.env` file remains on EC2.
* On EC2, the workflow pulls both images, runs the `migrate` service (`pnpm db:migrate && pnpm db:seed`), starts the `dnd-form` service, and removes images older than seven days. If migration fails, the command chain stops and the new app container is not started. The workflow waits for SSM to finish, retrieves the result, and fails the deployment if the SSM command fails.
* Seeding runs on every deployment; the seed script skips rows that already exist. Changing the super admin password in `.env` does not update an account that has already been created.

### 3.4. Environment variables on EC2
The `.env` file is stored in the deployment directory on EC2 and is **not** included in the image or repository. At minimum, configure:
```env
DATABASE_URL="mysql://<user>:<password>@<db-host>:<port>/dnd_form_db"   # add SSL parameters if required by your provider
JWT_SECRET="..."
SUPER_ADMIN_FULL_NAME="..."
SUPER_ADMIN_EMAIL="..."
SUPER_ADMIN_PASSWORD="..."
STORAGE_DRIVER=local
```
`STORAGE_DRIVER=local` stores files in a Docker volume. For `STORAGE_DRIVER=s3`, also configure `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, and `S3_PUBLIC_URL`; `S3_REGION`, `S3_ENDPOINT`, and `S3_FORCE_PATH_STYLE` can be set depending on the provider. If `USE_MOCK_DATA` is unset or anything other than `false`, mock mode is enabled; set `USE_MOCK_DATA=false` to use the MySQL data.

Create the `dnd_form_db` database in advance. The user in `DATABASE_URL` needs `CREATE`, `ALTER`, and `INDEX` privileges, and the database must allow connections from EC2. EC2 needs Docker Compose and a working SSM Agent, and it must be able to pull the GHCR package if that package is private.
