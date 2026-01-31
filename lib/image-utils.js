/**
 * Optimize Cloudinary image URLs by adding transformation parameters
 * This reduces image download size by serving appropriately sized images
 * 
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Transformation options
 * @param {number} options.width - Desired width in pixels
 * @param {number} options.height - Desired height in pixels (optional)
 * @param {string} options.quality - Image quality (default: 'auto')
 * @param {string} options.format - Image format (default: 'auto')
 * @returns {string} Optimized Cloudinary URL
 */
export function optimizeCloudinaryImage(url, options = {}) {
  if (!url || typeof url !== 'string') {
    return url || '/placeholder.svg';
  }

  // If it's not a Cloudinary URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const {
    width = 400,
    height,
    quality = 'auto',
    format = 'auto',
  } = options;

  try {
    // Parse Cloudinary URL structure: 
    // https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{version}/{public_id}.{format}
    // Example: https://res.cloudinary.com/dsobipud5/image/upload/v1764003092/products/gyciysq5bq4wz4cb6xvf.webp
    
    // Ensure URL uses https
    const httpsUrl = url.replace(/^http:\/\//, 'https://');
    const urlObj = new URL(httpsUrl);
    const pathParts = urlObj.pathname.split('/').filter(part => part); // Remove empty parts
    
    // Find the index of 'upload' in the path
    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      // If URL doesn't have standard structure, return as-is
      return url;
    }

    // Check if transformations already exist (they would be right after 'upload')
    // Transformations don't start with 'v' (version) and contain underscores
    const hasExistingTransformations = uploadIndex + 1 < pathParts.length && 
      pathParts[uploadIndex + 1] && 
      !pathParts[uploadIndex + 1].match(/^v\d+$/) && // Not a version number
      pathParts[uploadIndex + 1].includes('_'); // Has transformation syntax

    // Build transformation string
    const transformations = [];
    
    // Add width
    transformations.push(`w_${width}`);
    
    // Add height if specified, otherwise use scale to maintain aspect ratio
    if (height) {
      transformations.push(`h_${height}`);
      transformations.push('c_fill'); // Fill with crop
    } else {
      // Use scale to maintain aspect ratio (better than h_auto)
      transformations.push('c_scale');
    }
    
    // Add quality
    transformations.push(`q_${quality}`);
    
    // Add format (use auto:format for better browser support)
    if (format === 'auto') {
      transformations.push('f_auto');
    } else {
      transformations.push(`f_${format}`);
    }
    
    // Reconstruct URL with transformations
    const transformationString = transformations.join(',');
    const beforeUpload = pathParts.slice(0, uploadIndex + 1);
    const afterUpload = pathParts.slice(uploadIndex + 1);
    
    // If there are existing transformations, replace them; otherwise insert new ones
    if (hasExistingTransformations) {
      // Replace existing transformations
      afterUpload[0] = transformationString;
    } else {
      // Insert new transformations before version number or public_id
      afterUpload.unshift(transformationString);
    }
    
    // Reconstruct path
    const optimizedPath = '/' + [...beforeUpload, ...afterUpload].join('/');
    urlObj.pathname = optimizedPath;
    
    // Ensure https protocol
    urlObj.protocol = 'https:';
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error, url);
    // Return original URL if transformation fails
    return url;
  }
}

/**
 * Get optimized image URL based on display size
 * For card images displayed at ~294px, we'll request 400px (2x for retina)
 * 
 * @param {string} url - Original image URL
 * @param {string} size - Size preset: 'thumbnail' (294px), 'card' (400px), 'medium' (600px), 'large' (800px)
 * @returns {string} Optimized URL
 */
export function getOptimizedImageUrl(url, size = 'card') {
  const sizeMap = {
    thumbnail: 294,
    card: 400,
    medium: 600,
    large: 800,
  };

  const width = sizeMap[size] || sizeMap.card;
  
  return optimizeCloudinaryImage(url, {
    width,
    quality: 'auto',
    format: 'auto',
  });
}

