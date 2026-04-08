# StageCraft

AI-powered end-to-end testing framework built with [Playwright](https://playwright.dev), [Cucumber BDD](https://cucumber.io), and [ZeroStep AI](https://zerostep.com). Includes a feature-rich React demo app as the test target.

## Screenshots

### Home Page
![Home Page](docs/home.png)

### Dashboard
![Dashboard](docs/dashboard.png)

### Login
![Login](docs/login.png)

### Interactive Playground
![Playground](docs/playground.png)

### Data Table
![Data Table](docs/datatable.png)

---

## Tech Stack

| Layer     | Technology                        | Purpose                            |
| --------- | --------------------------------- | ---------------------------------- |
| Frontend  | React 18, React Router 6          | Demo app (test target)             |
| UI        | Custom CSS, Glassmorphism, Inter   | Dark theme design system           |
| Icons     | React Icons (Heroicons v2)        | UI icons                           |
| Testing   | Playwright 1.44                   | Browser automation engine          |
| BDD       | Cucumber.js 10                    | Gherkin feature files              |
| AI        | ZeroStep 0.1.5                    | Natural language test steps        |

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### 1. Start the frontend

```bash
cd frontend/playwright-front
npm install
npm start
```

The app runs on **http://localhost:3000**.

### 2. Set up the test suite

```bash
cd backend/playwright-api
npm install
npx playwright install
```

### 3. (Optional) Configure ZeroStep AI

Copy the env template and add your ZeroStep token:

```bash
cp .env.example .env
# Edit .env and set ZEROSTEP_TOKEN=0step:your-actual-token
```

Get a free token at [zerostep.com](https://zerostep.com).

---

## Demo Credentials

| Username | Password    | Role   |
| -------- | ----------- | ------ |
| `user1`  | `password1` | Admin  |
| `user2`  | `password2` | Tester |

---

## How to Use

### Running Tests

StageCraft supports three testing approaches. Make sure the frontend is running first (`npm start` in `frontend/playwright-front`).

#### Playwright Tests (Headless)

```bash
cd backend/playwright-api
npx playwright test
```

#### Playwright Tests (Headed — see the browser)

```bash
npx playwright test --headed
```

#### Cucumber BDD Tests

```bash
npm run test:cucumber
```

#### View HTML Report

After running Playwright tests, open the rich HTML report:

```bash
npx playwright show-report
```

### Available npm Scripts

| Script             | Command                        | Description                              |
| ------------------ | ------------------------------ | ---------------------------------------- |
| `test`             | `playwright test`              | Run all Playwright specs (headless)      |
| `test:headed`      | `playwright test --headed`     | Run with visible browser                 |
| `test:cucumber`    | `cucumber-js`                  | Run Cucumber BDD scenarios               |
| `report`           | `playwright show-report`       | Open the last HTML test report           |

---

## Writing Tests

### Approach 1: Pure Playwright

Create spec files in `backend/playwright-api/tests/`:

```typescript
// tests/dashboard.spec.ts
import { test, expect } from "@playwright/test";

test("dashboard loads stats", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard");
  await expect(page.locator("h1")).toHaveText("Dashboard");
  await expect(page.locator(".dash-stat-card")).toHaveCount(4);
});

test("data table filters by status", async ({ page }) => {
  await page.goto("http://localhost:3000/data");
  await page.selectOption(".dt-select", "failed");
  // All visible rows should show "Failed" status
  const rows = page.locator(".dt-status.failed");
  await expect(rows).toHaveCount(await rows.count());
});
```

### Approach 2: Cucumber BDD

**Step 1** — Write a `.feature` file in `backend/playwright-api/features/`:

```gherkin
# features/login.feature
Feature: Login

  Scenario: User enters invalid credentials and fails to log in
    Given the user is on the login page
    When the user enters an invalid username and password
    And the user clicks on the "Login" button
    Then an error message "Invalid username or password" should be displayed
    And the user should remain on the login page
```

**Step 2** — Implement step definitions in `backend/playwright-api/steps/`:

```typescript
// steps/login.steps.ts
import { Given, When, Then } from "@cucumber/cucumber";
import { expect, Browser, Page } from "@playwright/test";
import { chromium } from "playwright";

let browser: Browser;
let page: Page;

Given("the user is on the login page", async function () {
  browser = await chromium.launch();
  page = await browser.newPage();
  await page.goto("http://localhost:3000/login");
});

When("the user enters an invalid username and password", async function () {
  await page.fill('input[name="username"]', "user3");
  await page.fill('input[name="password"]', "password3");
});

When('the user clicks on the "Login" button', async function () {
  await page.click('button[type="submit"]');
});

Then("an error message {string} should be displayed", async function (msg: string) {
  await expect(page.locator(".error")).toHaveText(msg);
});

Then("the user should remain on the login page", async function () {
  await expect(page).toHaveURL("http://localhost:3000/login");
});
```

### Approach 3: ZeroStep AI (No Selectors)

Write tests in plain English — ZeroStep's AI finds elements automatically:

```typescript
// tests/signin.spec.ts
import { test } from "@playwright/test";
import { ai } from "@zerostep/playwright";

test("login with invalid credentials", async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  const aiArgs = { page, test };

  await ai('Type "user3" in the username box', aiArgs);
  await ai('Type "password3" in the password box', aiArgs);
  await ai("Press enter", aiArgs);
  // AI finds elements by intent, not by CSS selectors
});
```

---

## Test Target Pages

The React frontend provides rich, interactive pages for writing diverse E2E tests:

| Page         | Route         | Testable Elements                                                        |
| ------------ | ------------- | ------------------------------------------------------------------------ |
| Home         | `/`           | Navigation links, CTA buttons, conditional welcome message               |
| Login        | `/login`      | Form inputs, submit button, error validation, redirect on success         |
| Logout       | `/logout`     | Confirmation message, navigation links                                   |
| Dashboard    | `/dashboard`  | Stat cards, bar chart, test run list, coverage progress bars              |
| Playground   | `/playground` | Toggles, counter (+/−/reset), slider, star rating, tags, search, tabs, todo CRUD, accordion, modal dialog, progress bars |
| Data Table   | `/data`       | Text search, dropdown filters (status, type), column sort, pagination    |

### Playground Component Test Ideas

```typescript
test("toggle switches", async ({ page }) => {
  await page.goto("http://localhost:3000/playground");
  const toggle = page.locator(".toggle-switch").first();
  await toggle.click();
  await expect(toggle).not.toHaveClass(/active/);
});

test("counter increment/decrement", async ({ page }) => {
  await page.goto("http://localhost:3000/playground");
  await page.locator(".counter-btn").last().click(); // +
  await expect(page.locator(".counter-value")).toHaveText("1");
});

test("todo list add and complete", async ({ page }) => {
  await page.goto("http://localhost:3000/playground");
  await page.fill('.todo-input-row input', "New test task");
  await page.locator(".todo-add-btn").click();
  await expect(page.locator(".todo-text").last()).toHaveText("New test task");
});

test("modal open and close", async ({ page }) => {
  await page.goto("http://localhost:3000/playground");
  await page.getByText("Open Modal").click();
  await expect(page.locator(".modal-content")).toBeVisible();
  await page.getByText("Cancel").click();
  await expect(page.locator(".modal-content")).not.toBeVisible();
});
```

### Data Table Test Ideas

```typescript
test("search filters results", async ({ page }) => {
  await page.goto("http://localhost:3000/data");
  await page.fill(".dt-search", "Login");
  await expect(page.locator(".dt-name")).toContainText(["Login"]);
});

test("pagination works", async ({ page }) => {
  await page.goto("http://localhost:3000/data");
  await page.locator(".dt-page-btn").getByText("2").click();
  await expect(page.locator(".dt-page-btn.active")).toHaveText("2");
});
```

---

## Configuration

### Playwright Config (`playwright.config.ts`)

| Setting          | Value                  | Notes                           |
| ---------------- | ---------------------- | ------------------------------- |
| `testDir`        | `./tests`              | Playwright spec files           |
| `fullyParallel`  | `true`                 | Tests run in parallel           |
| `retries`        | `2` (CI) / `0` (local) | Automatic retry on CI           |
| `reporter`       | `html`                 | Rich HTML report with traces    |
| `trace`          | `on-first-retry`       | Captures trace on first failure |
| `browser`        | Chromium               | Firefox/WebKit available        |

To enable multi-browser testing, uncomment the Firefox/WebKit sections in `playwright.config.ts`.

To auto-start the frontend before tests, uncomment the `webServer` block:

```typescript
webServer: {
  command: 'npm run start',
  url: 'http://127.0.0.1:3000',
  reuseExistingServer: !process.env.CI,
},
```

---

## Project Structure

```
stage-craft/
├── docs/                             # Screenshots & docs
│   ├── home.png
│   ├── dashboard.png
│   ├── login.png
│   ├── login-filled.png
│   ├── playground.png
│   └── datatable.png
├── backend/
│   └── playwright-api/               # Test suite
│       ├── playwright.config.ts      # Playwright configuration
│       ├── zerostep.config.json      # ZeroStep AI token
│       ├── .env.example              # Environment template
│       ├── tests/
│       │   ├── home.spec.ts          # Playwright spec (playwright.dev)
│       │   └── signin.spec.ts        # ZeroStep AI test
│       ├── features/
│       │   └── login.feature         # Cucumber BDD scenario
│       └── steps/
│           └── login.steps.ts        # Step definitions
└── frontend/
    └── playwright-front/             # React demo app
        ├── public/
        │   └── index.html
        └── src/
            ├── App.js                # Root with routing & glass nav
            ├── App.css               # Navigation & shared styles
            ├── Home.js               # Hero, features, stats, CTA
            ├── Home.css
            ├── Login.js              # Glassmorphic split-panel login
            ├── Login.css
            ├── Logout.js             # Animated logout confirmation
            ├── Logout.css
            ├── Dashboard.js          # Stats, chart, runs, coverage
            ├── Dashboard.css
            ├── Playground.js         # 10+ interactive components
            ├── Playground.css
            ├── DataTable.js          # Search, sort, filter, paginate
            ├── DataTable.css
            ├── index.js              # React entry point
            └── index.css             # Global styles & design tokens
```

---

## Design System

| Token               | Value                                          |
| -------------------- | ---------------------------------------------- |
| Background           | `#0a0a1a` → `#0f0f2a` → `#1a0a2e` gradient   |
| Accent Cyan          | `#00d4ff`                                      |
| Accent Purple        | `#a855f7`                                      |
| Accent Pink          | `#ec4899`                                      |
| Accent Green         | `#22c55e`                                      |
| Glass Background     | `rgba(255,255,255,0.03)` + `blur(20px)`        |
| Heading Font         | Inter 800                                      |
| Code Font            | JetBrains Mono                                 |
| Border Radius        | 8px / 12px / 16px / 24px                       |
