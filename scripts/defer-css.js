const fs = require('fs');
const path = require('path');

// Function to recursively find all HTML files
function findHTMLFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && !file.startsWith('.')) {
        findHTMLFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to defer CSS in HTML content using print media trick
function deferCSSInHTML(htmlContent) {
  // Pattern to match CSS link tags - more comprehensive
  const cssLinkPattern = /<link([^>]*?)\s+rel\s*=\s*["']stylesheet["']([^>]*?)>/gi;
  
  return htmlContent.replace(cssLinkPattern, (match) => {
    // Skip if already has data-deferred or is a data URI
    if (match.includes('data-deferred') || match.includes('data:')) {
      return match;
    }
    
    // Extract href
    const hrefMatch = match.match(/href\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) {
      return match;
    }
    
    const href = hrefMatch[1];
    
    // Skip if it's a data URI or inline styles
    if (href.startsWith('data:') || !href) {
      return match;
    }
    
    // Skip if it's already using preload
    if (match.includes('rel="preload"') || match.includes("rel='preload'")) {
      return match;
    }
    
    // Add media="print" and onload handler to convert to async loading
    // This prevents render blocking while still loading the CSS
    let newLink = match;
    
    // Remove existing media attribute if present
    newLink = newLink.replace(/\s+media\s*=\s*["'][^"']*["']/gi, '');
    
    // Add media="print" and onload handler
    if (newLink.endsWith('>')) {
      newLink = newLink.slice(0, -1) + ' media="print" onload="this.media=\'all\'">';
    } else if (newLink.endsWith('/>')) {
      newLink = newLink.slice(0, -2) + ' media="print" onload="this.media=\'all\'" />';
    }
    
    // Add data-deferred attribute
    if (!newLink.includes('data-deferred')) {
      newLink = newLink.replace(/>$/, ' data-deferred="true">');
      newLink = newLink.replace(/\/>$/, ' data-deferred="true" />');
    }
    
    // Add noscript fallback for browsers without JavaScript
    const noscriptFallback = match.replace(/media\s*=\s*["'][^"']*["']/gi, '');
    const noscript = `\n<noscript>${noscriptFallback}</noscript>`;
    
    return newLink + noscript;
  });
}

// Main function
function main() {
  const outDir = path.join(process.cwd(), 'out');
  
  if (!fs.existsSync(outDir)) {
    console.log('⚠️  "out" directory not found. Make sure you have run "next build" first.');
    return;
  }

  console.log('🔄 Deferring CSS in HTML files...');
  
  const htmlFiles = findHTMLFiles(outDir);
  
  if (htmlFiles.length === 0) {
    console.log('⚠️  No HTML files found in "out" directory.');
    return;
  }

  let processedCount = 0;
  
  htmlFiles.forEach((filePath) => {
    try {
      let htmlContent = fs.readFileSync(filePath, 'utf8');
      const originalContent = htmlContent;
      
      htmlContent = deferCSSInHTML(htmlContent);
      
      if (htmlContent !== originalContent) {
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        processedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });

  console.log(`✅ Processed ${processedCount} HTML file(s) with CSS deferring.`);
}

// Run the script
main();

