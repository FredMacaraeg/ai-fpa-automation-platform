# Release Notes

## Portfolio Release - v1.6

This release strengthens data context, refresh governance, variance safety, workbook usability, and repository quality controls.

### Data context and refresh governance

- Renamed **Close Through** to **Simulation Cutoff** so the control describes how the portfolio model is being demonstrated.
- Retained the complete FY2026 synthetic feed required for annual outputs and multi-cutoff testing.
- Tagged every included source row as `FY2026_FULL_YEAR_DEMO` and added an explicit `FULL-YEAR DEMO` coverage status.
- Added blocking states for `FUTURE DATA`, `MISSING CLOSED PERIOD`, `STALE REFRESH`, `NO REFRESH DATE`, and mapping exceptions on live feeds.
- Preserved the downstream import and three-statement checks while allowing the explicitly tagged demonstration feed.

### Variance and documentation fixes

- Zero-budget variance percentages now return `n.a.` instead of a misleading `0%`.
- Monthly and YTD status logic now returns `NO BUDGET` when a percentage comparison is unavailable.
- Removed a duplicate workflow step and replaced outdated v1.3/v1.5 file references.
- Clarified that source coverage and the active simulation cutoff are separate concepts.

### Usability and automation

- Replaced the oversized embedded M-code block with a compact, version-controlled query reference.
- Moved the governed query to `power-query/qry_Actuals.m`.
- Added `scripts/validate-fpa-project.mjs` and a GitHub Actions quality workflow.
- Refreshed repository screenshots from the v1.6 workbook.

### Release validation

- 213 sample landing rows across all 12 FY2026 periods
- 0 unmapped rows
- Query Feed: READY
- Coverage Status: FULL-YEAR DEMO
- Model Import: READY
- Balance Sheet Check: OK
- Cash Tie Check: OK
- Equity Roll-Forward Check: OK
- Scenario and simulation-cutoff tests passed
- Zero formula-reference errors in the release validation pass

## Portfolio Release - v1.5.1

This release freezes the Excel application before deeper AI development.

### Final usability improvements
- Added traffic-light conditional formatting for unmapped-account controls.
- Standardized validated / attention / blocking status colors.
- Improved visual distinction between Actual and Forecast periods.
- Improved variance-status readability.
- Added freeze panes to long operating sheets.
- Clarified Power Query operating instructions and source-of-truth tabs.
- Preserved all underlying financial-model logic from prior versions.

### Release validation
- 213 sample landing rows
- 0 unmapped rows
- Query Feed: READY
- Model Import: READY
- Balance Sheet Check: OK
- Cash Tie Check: OK
- Equity Roll-Forward Check: OK
- No identified formula-reference errors in the release validation pass

## Version History

### v1.5
Portfolio-release UX pass, Portfolio Guide, dashboard cleanup, model conventions, and recruiter-facing demo workflow.

### v1.4
Introduced the application-style Control Center, operating workflow, status indicators, and direct navigation.

### v1.3
Added the Power Query landing-zone design, configurable source path, refresh-control layer, and governed actuals refresh workflow.

### v1.2.1
Added favorable/unfavorable variance classifications, root-cause versus derived-impact logic, and clearer management-review statuses.

### v1.2
Added monthly Budget vs. Actual analysis, materiality controls, and a rolling forecast that separates closed actual periods from future forecast periods.

### v1.1
Added Raw Actuals, Account Map, and Actuals Staging layers with unmapped-account controls and dynamic feeds into the existing financial model.

### v1.0
Established the integrated Income Statement, Balance Sheet, Cash Flow, scenario assumptions, dashboards, model checks, and AI-commentary prompt layer.
