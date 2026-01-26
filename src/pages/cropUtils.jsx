/**
 * cropUtils.jsx - Utility functions for image cropping
 * Adapted from react-easy-crop documentation
 */

/**
 * Creates an Image object from a URL
 * @param {string} url - Image URL
 * @returns {Promise<HTMLImageElement>}
 */
export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Handle CORS issues
    image.src = url;
  });

/**
 * Converts degrees to radians
 * @param {number} degreeValue - Angle in degrees
 * @returns {number} Angle in radians
 */
export function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Calculates the bounding box size after rotation
 * @param {number} width - Original width
 * @param {number} height - Original height
 * @param {number} rotation - Rotation angle in degrees
 * @returns {Object} Rotated dimensions
 */
export function rotateSize(width, height, rotation) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crops an image with optional rotation and flipping
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop area in pixels
 * @param {number} pixelCrop.x - X coordinate
 * @param {number} pixelCrop.y - Y coordinate
 * @param {number} pixelCrop.width - Width
 * @param {number} pixelCrop.height - Height
 * @param {number} rotation - Rotation angle in degrees (default: 0)
 * @param {Object} flip - Flip configuration
 * @param {boolean} flip.horizontal - Flip horizontally
 * @param {boolean} flip.vertical - Flip vertically
 * @returns {Promise<string>} Blob URL of cropped image
 */
export default async function getCroppedImg(
  imageSrc,
  pixelCrop,
  rotation = 0,
  flip = { horizontal: false, vertical: false }
) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas context not available');
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Center the canvas context
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Draw the image
  ctx.drawImage(image, 0, 0);

  // Get cropped image data
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  );

  // Reset canvas to crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Put cropped data back
  ctx.putImageData(data, 0, 0);

  // Return as blob URL
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      } else {
        reject(new Error('Canvas is empty'));
      }
    }, 'image/jpeg', 0.95); // 0.95 quality
  });
}

/**
 * Simplified crop function without rotation/flip
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop area
 * @param {string} format - Image format (default: 'image/jpeg')
 * @param {number} quality - Image quality 0-1 (default: 0.9)
 * @returns {Promise<string>} Cropped image URL
 */
export async function simpleCrop(imageSrc, pixelCrop, format = 'image/jpeg', quality = 0.9) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, format, quality);
    };
    
    image.onerror = () => reject(new Error('Failed to load image'));
  });
}

/**
 * Crop image with brightness adjustment
 * @param {string} imageSrc - Source image URL
 * @param {Object} pixelCrop - Crop area
 * @param {number} brightness - Brightness percentage (50-150)
 * @returns {Promise<string>} Cropped and adjusted image URL
 */
export async function cropWithBrightness(imageSrc, pixelCrop, brightness = 100) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      // Apply brightness filter
      ctx.filter = `brightness(${brightness}%)`;
      
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png'); // Use PNG to preserve quality with filters
    };
    
    image.onerror = () => reject(new Error('Failed to load image'));
  });
}

/**
 * Get image dimensions
 * @param {string} imageSrc - Image URL
 * @returns {Promise<{width: number, height: number}>}
 */
export async function getImageDimensions(imageSrc) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height
      });
    };
    
    image.onerror = () => reject(new Error('Failed to load image'));
  });
}

/**
 * Calculate crop area based on aspect ratio
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} aspectRatio - Desired aspect ratio (width/height)
 * @returns {Object} Calculated crop area
 */
export function calculateCropArea(width, height, aspectRatio) {
  let cropWidth, cropHeight;
  
  if (width / height > aspectRatio) {
    // Image is wider than desired aspect ratio
    cropHeight = height;
    cropWidth = cropHeight * aspectRatio;
  } else {
    // Image is taller than desired aspect ratio
    cropWidth = width;
    cropHeight = cropWidth / aspectRatio;
  }
  
  return {
    x: (width - cropWidth) / 2,
    y: (height - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight
  };
}

/**
 * React hook for image cropping
 * @param {string} imageSrc - Source image
 * @param {Object} crop - Crop state {x, y}
 * @param {number} zoom - Zoom level
 * @param {number} rotation - Rotation angle
 * @param {number} aspect - Aspect ratio
 * @returns {Function} Function to get cropped image
 */
export function useImageCrop(imageSrc, crop, zoom, rotation = 0, aspect = 1) {
  const getCroppedImage = useCallback(async () => {
    if (!imageSrc) return null;
    
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    // Calculate crop area based on zoom and position
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = (image.width / zoom) * scaleX;
    const cropHeight = cropWidth / aspect;
    
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  }, [imageSrc, crop, zoom, rotation, aspect]);
  
  return getCroppedImage;
}