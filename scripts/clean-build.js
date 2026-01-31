const fs = require('fs');
const path = require('path');

// Function to forcefully delete a directory
function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return;
  }

  try {
    // Try to delete files individually
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          deleteDirectory(filePath);
        } else {
          // Try to delete file, ignore errors if locked
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            // File might be locked, try to make it writable first
            try {
              fs.chmodSync(filePath, 0o666);
              fs.unlinkSync(filePath);
            } catch (e) {
              // Ignore - file is locked by another process
              console.log(`⚠️  Could not delete ${filePath} (may be locked)`);
            }
          }
        }
      } catch (err) {
        // Ignore errors for locked files
      }
    });
    
    // Try to remove directory
    try {
      fs.rmdirSync(dirPath);
    } catch (err) {
      // Directory might not be empty due to locked files
      console.log(`⚠️  Could not fully delete ${dirPath} (some files may be locked)`);
    }
  } catch (err) {
    console.log(`⚠️  Error cleaning ${dirPath}:`, err.message);
  }
}

// Main function
function main() {
  const nextDir = path.join(process.cwd(), '.next');
  const outDir = path.join(process.cwd(), 'out');
  
  console.log('🧹 Cleaning build directories...');
  
  if (fs.existsSync(nextDir)) {
    console.log('Cleaning .next directory...');
    deleteDirectory(nextDir);
  }
  
  if (fs.existsSync(outDir)) {
    console.log('Cleaning out directory...');
    deleteDirectory(outDir);
  }
  
  console.log('✅ Cleanup complete (some locked files may remain)');
}

main();

