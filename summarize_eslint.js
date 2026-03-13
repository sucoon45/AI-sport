const fs = require('fs');

const data = JSON.parse(fs.readFileSync('eslint-results.json', 'utf8'));
const filesWithErrors = data.filter(file => file.errorCount > 0 || file.warningCount > 0);

for (const file of filesWithErrors) {
    console.log(`\nFile: ${file.filePath}`);
    for (const msg of file.messages) {
        console.log(`  Line ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
    }
}
