import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';

async function createImageInfo(resizedImage) {
  const imageInfo = {
    height: resizedImage.height,
    width: resizedImage.width,
    uri: resizedImage.uri,
    fileName: resizedImage.name || resizedImage.uri.split('/').pop(),
    fileSize: resizedImage.size || null,
    type: resizedImage.type || 'image/jpeg',
    isMirrored: false,
    orientation: 'portrait',
    // type: 'image/jpeg',
    // isMirrored: photo.isMirrored,
    // orientation: photo.orientation,
    base64Data: await RNFS.readFile(resizedImage.uri, 'base64'),
  };

  return imageInfo;
}

/**
 * Resizes an image only if it exceeds the specified maxSize.
 *
 * @param {Object} image - The image object (from react-native-image-picker)
 * @param {number} maxSize - Maximum width or height allowed
 * @returns {Promise<Object>} - Resized image object or original image if resizing isn't needed
 */
const resizeImageIfNeeded = async (image, maxSize) => {
  try {
    const {width, height, uri} = image;

    // Check if resizing is needed
    if (width <= maxSize && height <= maxSize) {
      console.log('Image is within limits. Returning original image.');
      return createImageInfo(image); // No resizing needed
    }

    // Calculate new dimensions while maintaining aspect ratio
    const scaleFactor = maxSize / Math.max(width, height);
    const newWidth = Math.round(width * scaleFactor);
    const newHeight = Math.round(height * scaleFactor);

    console.log(
      `Resizing image from ${width}x${height} to ${newWidth}x${newHeight}`,
    );

    // Resize the image
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      newWidth,
      newHeight,
      'JPEG',
      80, // Quality (1-100)
      0, // Rotation (0 to keep EXIF)
      null, // Output path (null uses temporary path)
      true, // Enable compression
      {onlyScaleDown: true}, // Only scale down if image is larger
    );
    return await createImageInfo(resizedImage);
  } catch (error) {
    console.error('Error resizing image:', error);
    return image; // Return original image if resizing fails
  }
};

const createImageUploadData = imageInfo => {
  const binaryBuffer = Buffer.from(imageInfo.base64Data, 'base64');
  const binaryString = binaryBuffer.toString('binary');
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const createImageDataUrl = imageInfo => {
  return `data:${imageInfo.type};base64,${imageInfo.base64Data}`;
};
/**
 * Processes a list of images and resizes them as needed.
 * @param {Array} images - List of image objects
 * @param {number} maxSize - Maximum allowed width/height
 * @returns {Promise<Array>} - List of resized image objects
 */
const resizeImageList = async (images, maxSize) => {
  if (!images || images.length === 0) return [];

  console.log(`Processing ${images.length} images...`);

  // Resize all images in parallel using Promise.all
  const resizedImages = await Promise.all(
    images.map(image => resizeImageIfNeeded(image, maxSize)),
  );

  console.log(`Finished resizing ${resizedImages.length} images.`);
  return resizedImages;
};

const printImages = images => {
  images.forEach((image, index) => {
    console.log(`Image ${index + 1}:`);
    console.log(`- URI: ${image.uri}`);
    console.log(`- File Name: ${image.fileName || 'Unknown'}`);
    console.log(`- Type: ${image.type || 'Unknown'}`);
    console.log(
      `- File Size: ${image.fileSize ? image.fileSize + ' bytes' : 'Unknown'}`,
    );
    console.log(`- Dimensions: ${image.width} x ${image.height}`);
  });
};

export {
  resizeImageIfNeeded,
  resizeImageList,
  printImages,
  createImageUploadData,
  createImageDataUrl,
};
