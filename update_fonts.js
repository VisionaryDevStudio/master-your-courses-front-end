const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Replace Google Fonts Link
content = content.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">/g,
  '<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">'
);

// Replace Tailwind config
content = content.replace(
  /heading:\s*\['Outfit',\s*'sans-serif'\],/g,
  "display: ['Outfit', 'sans-serif'],"
);

// Replace font-heading class globally
content = content.replace(/font-heading/g, 'font-display');

fs.writeFileSync('index.html', content);
console.log("Updated index.html");
