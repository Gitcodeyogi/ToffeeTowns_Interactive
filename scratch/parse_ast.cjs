const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const sourceFile = ts.createSourceFile(
  filePath,
  content,
  ts.ScriptTarget.Latest,
  true // setParentNodes
);

const diagnostics = sourceFile.parseDiagnostics || [];

console.log(`Found ${diagnostics.length} syntactic diagnostics:`);
diagnostics.forEach(diag => {
  const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, diag.start);
  const message = ts.flattenDiagnosticMessageText(diag.messageText, '\n');
  console.log(`Error at line ${line + 1}, col ${character + 1}: ${message}`);
});
