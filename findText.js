import fs from "fs";
import path from "path";

const root = "./src";

function scan(dir) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);

    if (fs.statSync(full).isDirectory()) {
      scan(full);
    } else if (/\.(jsx|tsx)$/.test(file)) {
      const content = fs.readFileSync(full, "utf8");
      const lines = content.split("\n");

      let found = [];

      lines.forEach((line, index) => {
        // Cherche les textes dans des balises JSX (entre > et <)
        const matches = [...line.matchAll(/>([^<{>\n]*[A-Za-z0-9À-ÿ][^<{>\n]*)</g)];

        for (const m of matches) {
          const text = m[1].trim();
          // Ignore les occurrences de "ft_transcendence"
          if (text && !/ft_transcendence/i.test(text)) {
            found.push(`Ligne ${index + 1}: "${text}"`);
          }
        }
      });

      if (found.length > 0) {
        console.log(`\n📄 ${full}`);
        found.forEach(f => console.log("  " + f));
      }
    }
  }
}

scan(root);
