# EventHub Automation Framework — Common Commands

> All commands are written for **PowerShell** (Windows).
> Mac/Linux bash equivalents are noted where the syntax differs.

---

## Running Tests

### Run all tests
```powershell
npx playwright test
```

### Run by tag
```powershell
# API tests only
npx playwright test --grep "@api"

# UI tests only
npx playwright test --grep "@ui"

# E2E tests only
npx playwright test --grep "@e2e"

# Smoke tests only
npx playwright test --grep "@smoke"

# Regression suite
npx playwright test --grep "@regression"
```

### Run a specific file
```powershell
npx playwright test tests/api/auth.spec.ts
npx playwright test tests/e2e/booking-journey.e2e.spec.ts
```

### Run in a specific browser
```powershell
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run in headed mode (see the browser)
```powershell
npx playwright test --headed
```

### Run in UI mode (interactive)
```powershell
npx playwright test --ui
```

### Run with debug mode
```powershell
npx playwright test --debug
```

### Run a single test by name
```powershell
npx playwright test --grep "user can log in with valid credentials"
```

---

## Allure Reporting

### Serve the report immediately after a test run (generates + opens in browser)
```powershell
npx allure serve allure-results
```

### Generate the report to a folder
```powershell
npx allure generate allure-results --clean -o allure-report
```

### Open a previously generated report
```powershell
npx allure open allure-report
```

### Clean up report artifacts
```powershell
# PowerShell
Remove-Item -Recurse -Force allure-results, allure-report

# Mac/Linux
# rm -rf allure-results allure-report
```

---

## Playwright HTML Report

### Open the last Playwright HTML report
```powershell
npx playwright show-report
```

---

## Performance Tests (k6)

### Build all performance tests
```powershell
npm run k6:build
```

### Run events performance test using dotenv file (recommended locally)
```powershell
npm run k6:run dist/performance/events.perf.js
```

### Run events performance test with inline env vars
```powershell
# PowerShell
k6 run --env API_BASE_URL=https://api.eventhub.rahulshettyacademy.com/api `
       --env TEST_EMAIL=your@email.com `
       --env TEST_PASSWORD=yourpassword `
       dist/performance/events.perf.js

# Mac/Linux
# k6 run --env API_BASE_URL=https://api.eventhub.rahulshettyacademy.com/api \
#        --env TEST_EMAIL=your@email.com \
#        --env TEST_PASSWORD=yourpassword \
#        dist/performance/events.perf.js
```

---

## Auth State

### Delete cached auth token (forces re-authentication on next run)
```powershell
# PowerShell
Remove-Item auth-state.json

# Mac/Linux
# rm auth-state.json
```

---

## Dependency Management

### Install dependencies
```powershell
npm ci
```

### Install Playwright browsers
```powershell
npx playwright install --with-deps chromium firefox
```

### Install a specific browser only
```powershell
npx playwright install chromium
```

### Uninstall a package
```powershell
npm uninstall <package-name>
```

---

## Useful Combinations

### Clean run — wipe old results, run smoke tests, serve report
```powershell
# PowerShell
Remove-Item -Recurse -Force allure-results, allure-report -ErrorAction SilentlyContinue; npx playwright test --grep "@smoke"; npx allure serve allure-results

# Mac/Linux
# rm -rf allure-results allure-report && npx playwright test --grep "@smoke" && npx allure serve allure-results
```

### Run smoke tests in both browsers
```powershell
npx playwright test --grep "@smoke" --project=chromium --project=firefox
```
