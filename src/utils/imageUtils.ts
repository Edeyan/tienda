/**
 * Helper utility to get maximum resolution, uncompressed and crisp HD images from WordPress, Unsplash, CDNs and local storage
 */
export function getHighQualityImageUrl(url: string | undefined): string {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1600&auto=format&fit=crop&q=95';
  }

  let cleanUrl = url.trim();

  // WordPress upload URL: remove generated thumbnail dimensions (e.g., -300x225, -150x150, -300x341, -600x600, -768x... before extension)
  // to get the uncompressed master original image
  cleanUrl = cleanUrl.replace(/-\d+x\d+(\.(jpg|jpeg|png|webp|gif|avif))/gi, '$1');

  // Unsplash: upgrade width and quality parameters for crisp HD / Retina displays
  if (cleanUrl.includes('images.unsplash.com')) {
    if (cleanUrl.includes('w=')) {
      cleanUrl = cleanUrl.replace(/w=\d+/, 'w=1600');
    } else {
      cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + 'w=1600';
    }
    if (cleanUrl.includes('q=')) {
      cleanUrl = cleanUrl.replace(/q=\d+/, 'q=95');
    } else {
      cleanUrl += '&q=95';
    }
    if (!cleanUrl.includes('auto=format')) {
      cleanUrl += '&auto=format';
    }
    if (!cleanUrl.includes('fit=crop')) {
      cleanUrl += '&fit=crop';
    }
  }

  // Cloudinary: request highest quality & automatic format
  if (cleanUrl.includes('cloudinary.com') || cleanUrl.includes('res.cloudinary.com')) {
    cleanUrl = cleanUrl.replace(/\/q_auto:low\//g, '/q_auto:best,f_auto/');
    cleanUrl = cleanUrl.replace(/\/w_\d+,h_\d+,c_[a-z]+\//g, '/q_auto:best,f_auto/');
  }

  // Shopify CDN: remove dimension suffixes like _300x300, _medium, _compact, _large, etc.
  if (cleanUrl.includes('cdn.shopify.com')) {
    cleanUrl = cleanUrl.replace(/_(pico|icon|thumb|small|compact|medium|large|grande|100x100|200x200|300x300|400x400|600x600)(\.(jpg|jpeg|png|webp|gif))/gi, '$2');
  }

  // Google User Content / Google Photos / Blogger: replace size constraint with max resolution
  if (cleanUrl.includes('googleusercontent.com') || cleanUrl.includes('ggpht.com')) {
    cleanUrl = cleanUrl.replace(/=w\d+-h\d+(-[a-z]+)?/gi, '=s1600');
    cleanUrl = cleanUrl.replace(/=s\d+(-[a-z]+)?/gi, '=s1600');
  }

  return cleanUrl;
}

