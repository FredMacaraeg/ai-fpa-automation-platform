# Chainalysis Interview Pricing Model

> Independent portfolio project using synthetic data and illustrative assumptions. It is not affiliated with Chainalysis and does not contain Chainalysis confidential information or actual price points.

This Google Sheets-ready model demonstrates how a finance leader can connect deal-level pricing decisions to portfolio pricing performance.

## What the model covers

- Hybrid pricing: annual platform fee, analyst seats, committed usage, and overages
- Segment packaging: different structures for government, financial institution, and crypto-business buyers
- Discount governance: expected value, gross margin, term, commitment, and annual-prepay trade-offs
- Renewal repricing: staged increases for underpriced legacy cohorts
- Portfolio metrics: ARR, ACV, realized price, weighted discount, win rate, sales cycle, renewal rate, NRR, usage growth, gross margin, expansion ARR, churn by price cohort, and multi-product penetration

## Workbook flow

1. `Pricing Summary` presents the active quote, the portfolio KPI set, and outcomes from the pricing cases.
2. `Quote Builder` converts editable deal inputs into recurring ACV, contract value, expected value, gross margin, realized price, NRR, and a deal-desk status.
3. `Pricing Cases` evaluates five examples across the four pricing situations.
4. `Portfolio Metrics` calculates the dashboard from synthetic customer and closed-opportunity data.
5. `Assumptions` owns package defaults and deal-desk guardrails.
6. `Quote Log` stores quote snapshots created by Apps Script.

## Automation

The model recalculates with native formulas and data validation. `Code.gs` adds a `Pricing Model` menu with three actions:

- Refresh calculations
- Run guardrail check
- Log current quote

It also uses `onEdit` to surface package or deal-desk exceptions when quote inputs change.

### Install in Google Sheets

1. Import `Chainalysis_Interview_Pricing_Model.xlsx` into Google Sheets.
2. Open **Extensions > Apps Script**.
3. Replace the default script with `Code.gs`.
4. Add the included `appsscript.json` manifest if you manage the project with `clasp`; otherwise the default manifest is sufficient.
5. Save and reload the spreadsheet.
6. Use the new **Pricing Model** menu.

The first menu action that writes to the sheet will request Google authorization.

## Suggested interview demo

1. Start on `Pricing Summary` and explain the decision sequence: diagnose realized price and usage, match the value metric to the segment, test expected value and margin, then apply guardrails.
2. In `Quote Builder`, change the segment, package, usage, discount, term, and payment cadence.
3. Show how ACV, contract value, expected value, gross margin, and approval status change immediately.
4. Run the guardrail check and log the quote.
5. Move to `Portfolio Metrics` to connect one deal decision to company-wide pricing performance and renewal outcomes.

## Important modeling note

Usage units are intentionally generic because the appropriate value metric can differ by product and segment. In a live implementation, Finance would replace them with governed product measures such as monitored transaction volume, API consumption, investigation capacity, data access, or another metric validated with Product and Sales.

