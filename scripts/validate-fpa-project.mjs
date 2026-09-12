import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const workbookPath = "model/AI_FP&A_Three_Statement_Model_v1.6.xlsx";
const csvPath = "sample-data/AI_FP&A_Actuals_Source_v1.6.csv";

const requiredFiles = [
  workbookPath,
  csvPath,
  "power-query/qry_Actuals.m",
  "documentation/FP&A_Automation_Case_Study.pdf",
  "screenshots/control-center.png",
  "screenshots/planning-dashboard.png",
  "screenshots/power-query-control.png",
  "screenshots/variance-analysis.png",
  "README.md",
  "RELEASE_NOTES.md",
];

const failures = [];
const pass = (message) => console.log(`✓ ${message}`);
const fail = (message) => failures.push(message);

for (const relative of requiredFiles) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) fail(`Missing required file: ${relative}`);
  else if (fs.statSync(absolute).size === 0) fail(`Required file is empty: ${relative}`);
}

if (failures.length === 0) pass("Required release files are present");

function parseCsvLine(line) {
  const fields = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += char;
    }
  }
  fields.push(field);
  return fields;
}

if (fs.existsSync(path.join(root, csvPath))) {
  const csv = fs.readFileSync(path.join(root, csvPath), "utf8").replace(/^\uFEFF/, "").trim();
  const rows = csv.split(/\r?\n/).map(parseCsvLine);
  const expectedHeader = [
    "Period End",
    "Account Code",
    "Account Name",
    "Department",
    "Data Type",
    "Source Amount ($mm)",
    "Source System",
    "Import Batch",
  ];
  if (JSON.stringify(rows[0]) !== JSON.stringify(expectedHeader)) fail("CSV header does not match the governed eight-column schema");
  if (rows.length - 1 !== 213) fail(`CSV must contain 213 data rows; found ${rows.length - 1}`);
  const periods = new Set(rows.slice(1).map((row) => row[0]));
  if (periods.size !== 12) fail(`CSV must contain 12 unique periods; found ${periods.size}`);
  if (rows.slice(1).some((row) => row.length !== 8)) fail("CSV contains a row that does not have eight fields");
  if (rows.slice(1).some((row) => row[7] !== "FY2026_FULL_YEAR_DEMO")) fail("Every sample row must be tagged FY2026_FULL_YEAR_DEMO");
  if (!failures.some((item) => item.startsWith("CSV"))) pass("Sample CSV schema, row count, period count, and demo tags are valid");
}

if (fs.existsSync(path.join(root, workbookPath))) {
  const xlsx = path.join(root, workbookPath);
  const signature = fs.readFileSync(xlsx).subarray(0, 4).toString("hex");
  if (signature !== "504b0304") fail("Workbook does not have a valid XLSX ZIP signature");
  if (fs.statSync(xlsx).size < 100_000) fail("Workbook is unexpectedly small");
  try {
    execFileSync("unzip", ["-t", xlsx], { stdio: "ignore" });
    const entries = execFileSync("unzip", ["-Z1", xlsx], { encoding: "utf8" }).trim().split(/\r?\n/);
    const xmlEntries = entries.filter((entry) => entry === "xl/sharedStrings.xml" || entry.startsWith("xl/worksheets/sheet"));
    const workbookXml = execFileSync("unzip", ["-p", xlsx, "xl/workbook.xml"], { encoding: "utf8" });
    const workbookText = execFileSync("unzip", ["-p", xlsx, ...xmlEntries], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
    for (const sheetName of ["Control_Center", "Planning_Assumptions", "BvA_Analysis", "Power_Query_Control", "Portfolio_Guide"]) {
      if (!workbookXml.includes(`name="${sheetName}"`)) fail(`Workbook is missing required sheet: ${sheetName}`);
    }
    for (const token of ["v1.6", "Simulation Cutoff", "FULL-YEAR DEMO", "FUTURE DATA", "MISSING CLOSED PERIOD", "STALE REFRESH", "n.a.", "NO BUDGET"]) {
      if (!workbookText.includes(token)) fail(`Workbook is missing required control token: ${token}`);
    }
    pass("Workbook package, required sheets, release labels, and control formulas are present");
  } catch (error) {
    fail(`Workbook package validation failed: ${error.message}`);
  }
}

const queryPath = path.join(root, "power-query/qry_Actuals.m");
if (fs.existsSync(queryPath)) {
  const query = fs.readFileSync(queryPath, "utf8");
  for (const token of ["tblPQConfig", "SourcePath", "Columns=8", "AddedRefreshTimestamp"]) {
    if (!query.includes(token)) fail(`Power Query file is missing required token: ${token}`);
  }
  pass("Power Query source contains the governed configuration and refresh steps");
}

function validateMarkdownLinks(relative) {
  const markdown = fs.readFileSync(path.join(root, relative), "utf8");
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].trim().split(/\s+/)[0].replace(/^<|>$/g, "");
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const withoutAnchor = decodeURIComponent(target.split("#")[0]);
    const resolved = path.resolve(path.dirname(path.join(root, relative)), withoutAnchor);
    if (!resolved.startsWith(root + path.sep) || !fs.existsSync(resolved)) fail(`${relative} has a broken local link: ${target}`);
  }
}

for (const markdownFile of ["README.md", "RELEASE_NOTES.md"]) {
  if (fs.existsSync(path.join(root, markdownFile))) validateMarkdownLinks(markdownFile);
}
pass("Markdown local links resolve to repository files");

const textFiles = ["README.md", "RELEASE_NOTES.md", csvPath, "power-query/qry_Actuals.m"];
const forbidden = ["Chainalysis", "OBM Inc", "Evotek", "Greenidge"];
for (const relative of textFiles) {
  if (!fs.existsSync(path.join(root, relative))) continue;
  const content = fs.readFileSync(path.join(root, relative), "utf8");
  for (const term of forbidden) {
    if (content.toLowerCase().includes(term.toLowerCase())) fail(`${relative} contains interview- or employer-specific term: ${term}`);
  }
}
pass("Release text remains general-purpose and synthetic");

if (failures.length > 0) {
  console.error("\nFP&A project validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nFP&A project validation passed.");
