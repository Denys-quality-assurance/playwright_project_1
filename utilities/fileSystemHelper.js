/*
 * The main purpose of this code file is to provide utility functions for reading and writing files,
 * and manipulating images. It provides functions to create unique file names, shorten long names,
 * check if a file exists, delete a file, download an image from a URL, and compare images.
 *
 */

import fs from 'fs';
import util from 'util';
import https from 'https';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';

const BASE_IMG_PATHS = {
  MOBILE_WEBKIT:
    './tests/test-data/googleSearch/baseline-images/baseline_homepage_logo_Webkit_Mobile.png',
  DESKTOP:
    './tests/test-data/googleSearch/baseline-images/baseline_homepage_logo.png',
};

// A function to generate a unique filename by combining the project name, a timestamp and the filename.
export function generateUniqueFileName(testInfo, fileName) {
  try {
    // Shorten the name
    const shortenFilename = getShortenedName(fileName);

    const projectName = testInfo.project.name;
    let timestamp;
    let filePath;
    do {
      timestamp = Date.now();
      filePath = getTempFilePath(fileName);
    } while (checkFileExists(filePath));
    return `${projectName}_${timestamp}_${shortenFilename}`;
  } catch (error) {
    console.error(`Error while creating unique file name: ${error.message}`);
  }
}

// A function to shorten a given fileName
export function getShortenedName(fileName) {
  try {
    const MAX_LENGTH = 30;

    // Check if the string contains underscore
    if (fileName.includes('_')) {
      // Split the string on the underscore
      const parts = fileName.split('_');
      const beforeUnderscore = parts[0].slice(0, MAX_LENGTH); // Get first part, cut up to 30 symbols
      const afterUnderscore = parts.slice(1).join('_'); // If there are multiple underscores, join the strings after the first underscore
      // Concatenate the parts into one string using template literals
      const newString = `${beforeUnderscore}_${afterUnderscore}`;

      // Return the constructed string
      return newString;
    }

    // If there is no underscore, cut the string up to 30 characters
    return fileName.slice(0, MAX_LENGTH);
  } catch (error) {
    console.error(`Error while getting the short file name: ${error.message}`);
  }
}

// Get path of the operating system's temporary directory
export function getTempDirPath() {
  try {
    // Get the system's temp directory
    const tmpDir = os.tmpdir();
    return tmpDir;
  } catch (error) {
    console.error(
      `Error while getting the path to the temporaty directory: ${error.message}`
    );
  }
}

// Get path of a given filename under the system temporary directory
export function getTempFilePath(fileName) {
  try {
    // Get the system's temp directory
    const tmpDir = getTempDirPath();
    // Path to a new temp file
    const filePath = path.join(tmpDir, fileName);
    return filePath;
  } catch (error) {
    console.error(
      `Error while getting the path to the temporaty file: ${error.message}`
    );
  }
}

// Download an image from a specified URL to the system's directory for temporary files
export async function downloadImageFromUrlToTempDir(url, testInfo) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        // Check if the response status code is not successful or if the Content-Type of the response is not an 'image'.
        // If any check fails, reject the Promise with the appropriate error message
        if (
          response.statusCode < 200 ||
          response.statusCode >= 300 ||
          !/^image\//.test(response.headers['content-type'])
        ) {
          reject(
            new Error(
              `Failed to download image from ${url}, status code: ${response.statusCode}`
            )
          );
          return;
        }
        // Create a unique filename for the downloaded image and generate its path in the system's temporary files directory
        const fileName = generateUniqueFileName(
          testInfo,
          'downloaded_picture.jpg'
        );
        const filePath = getTempFilePath(fileName);

        // Create a writable stream to write the image file to the filesystem
        const fileStream = fs.createWriteStream(filePath);

        // Attach 'error' event listeners to the response and file writing stream to handle any errors by invoking the cleanup function
        response.on('error', (error) =>
          cleanupAndReject(error, filePath, reject)
        ); // attaching error event on response
        fileStream.on('error', (error) =>
          cleanupAndReject(error, filePath, reject)
        ); // attaching error event on fileStream

        // Use the 'pipeline' function to pipe the response (readable stream) into the file writing stream.
        // If there is any error during this process, invoke the cleanup function;
        // otherwise, resolve the Promise with the filePath
        pipeline(response, fileStream, (error) => {
          if (error) {
            cleanupAndReject(error, filePath, reject);
          } else {
            resolve(filePath);
          }
        });
      })

      // If there is any error during the HTTPS GET request, log the error and reject the promise with the error
      .on('error', (error) => {
        console.error(
          `Error while downloading image from url to the system's directory for temporary files: ${error.message}`
        );
        reject(error);
      });
  });
}

// Cleanup function to delete the file and reject the promise in case of any error during file saveing process
function cleanupAndReject(error, filePath, reject) {
  fs.unlink(filePath, () => {}); // deletes the file if any error occurs
  console.error(`Error while saveing the file: ${error.message}`);
  reject(error); // Promise is rejected
}

// Checking if a file exists at the specified file path
export function checkFileExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      //file exists
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error while checking the file existance: ${error.message}`);
  }
}

// Deletes a file at the specified path
export function deleteFileAtPath(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`Error while deleting the file: ${error.message}`);
  }
}

// Asynchronously read a file from the disk and return its contents as a buffer
export async function readDataFromFileAsync(filePath) {
  try {
    // Use built-in util.promisify to convert the fs.readFile callback function into a function that supports Promises
    const readFilePromise = util.promisify(fs.readFile);
    // Perform the async file read operation and wait for it to complete
    const fileBuffer = await readFilePromise(filePath);
    // Return the file's contents as a buffer
    return fileBuffer;
  } catch (error) {
    console.error(
      `Error while reading the file asynchronously: ${error.message}`
    );
  }
}

// Synchronously read a file from the disk and return its contents as a buffer
export function readDataFromFileSync(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    console.error(
      `Error while reading the file synchronously: ${error.message}`
    );
  }
}

// Asynchronously write data to a file in the disk
export async function writeDataToFileAsync(filePath, data) {
  try {
    // Use built-in util.promisify to convert the fs.writeFile callback function into a function that supports Promises
    const writeFilePromise = util.promisify(fs.writeFile);
    // Perform the async file write operation and wait for it to complete
    await writeFilePromise(filePath, data);
  } catch (error) {
    console.error(`Error while writing file: ${error.message}`);
  }
}

// Compare the actual screenshot against the expected baseline Logo, attach results to the report, delete temporary files
export async function getMismatchedPixelsCount(
  actualScreenshotPath,
  testInfo,
  sharedContext
) {
  try {
    // Device type
    const isMobile = sharedContext._options.isMobile || false;
    // Browser type
    const defaultBrowserType = testInfo.project.use.defaultBrowserType;

    // Path of the expected Baseline Logo image
    const expectedBaselinePath = getBaselineImagePath(
      isMobile,
      defaultBrowserType
    );

    // Convert binaris into Buffers, transform Buffers into pixel data for direct comparison
    const expectedBaseline = PNG.sync.read(
      fs.readFileSync(expectedBaselinePath)
    );
    // Resize the Actual screenshot if needed
    const actualScreenshot = await resizeActualScreenshotToBaseline(
      expectedBaseline,
      actualScreenshotPath
    );

    // Create mismatchedPixelsDiff PNG object
    const { width, height } = expectedBaseline;
    const mismatchedPixelsDiff = new PNG({ width, height });
    // Compare images
    const mismatchedPixelsCount = pixelmatch(
      expectedBaseline.data,
      actualScreenshot.data,
      mismatchedPixelsDiff.data,
      width,
      height,
      {
        threshold: 0.19,
      }
    );
    if (mismatchedPixelsCount > 0) {
      const diffImageName = generateUniqueFileName(
        testInfo,
        'difference_between_basaline_and_actual_screenshot.png'
      );
      // Get path of diffImageName under the system temporary directory
      const diffImagePath = getTempFilePath(diffImageName);
      await writeDataToFile(diffImagePath, mismatchedPixelsDiff);

      // Paths of files to attach
      const paths = [expectedBaselinePath, actualScreenshotPath, diffImagePath];

      // Attach images to test report
      await attachAllImages(testInfo, paths);

      // Delete the temporaty files
      // deleteFileAtPath(diffImagePath);
    }
    // Delete the temporaty files
    deleteFileAtPath(actualScreenshotPath);
    return mismatchedPixelsCount;
  } catch (error) {
    console.error(
      `Error while comparing actual screenshot against a baseline screenshot: ${error.message}`
    );
  }
}

export function getBaselineImagePath(isMobile, defaultBrowserType) {
  return isMobile && defaultBrowserType == 'webkit'
    ? BASE_IMG_PATHS.MOBILE_WEBKIT
    : BASE_IMG_PATHS.DESKTOP;
}

// Resize the Actual screenshot if needed
export async function resizeActualScreenshotToBaseline(
  expectedBaseline,
  actualScreenshotPath
) {
  // Convert binaris into Buffers, transform Buffers into pixel data for direct comparison
  const actualScreenshotOriginalSize = PNG.sync.read(
    fs.readFileSync(actualScreenshotPath)
  );

  // Resize image if needed
  if (
    expectedBaseline.width !== actualScreenshotOriginalSize.width ||
    expectedBaseline.height !== actualScreenshotOriginalSize.height
  ) {
    // The sizes don't match. Resize the screenshot buffer.
    const actualScreenshotOriginalBuffer =
      fs.readFileSync(actualScreenshotPath);
    const resizedScreenshotBuffer = await sharp(actualScreenshotOriginalBuffer)
      .resize(expectedBaseline.width, expectedBaseline.height) // Resize to expectedBaseline dimensions
      .png()
      .toBuffer();

    // Return resized screenshot buffer
    return PNG.sync.read(resizedScreenshotBuffer);
  } else {
    // The sizes match. No need to resize.
    return actualScreenshotOriginalSize;
  }
}

export function attachAllImages(testInfo, paths) {
  return Promise.all(paths.map((p) => attachImage(testInfo, p)));
}

// Write the data into new file via stream
export function writeDataToFile(filePath, data) {
  return new Promise((resolve, reject) => {
    try {
      const fileStream = fs.createWriteStream(filePath);

      // Attach 'error' event listener to the file writing stream to handle any errors by invoking the cleanup function
      fileStream.on('error', (error) =>
        cleanupAndReject(error, filePath, reject)
      );

      // Use the 'end' event to resolve the Promise with the filePath when file is fully written
      fileStream.on('finish', () => resolve(filePath));

      // Write data (PNG) to the file through the stream
      data.pack().pipe(fileStream);
    } catch (error) {
      console.error(
        `Error while writing data into a new file: ${error.message}`
      );
      reject(error);
    }
  });
}

// Attach image to test report
export async function attachImage(testInfo, imagePath) {
  try {
    return testInfo.attach(getFileName(imagePath), {
      path: imagePath,
      contentType: 'image/png',
    });
  } catch (error) {
    console.error(
      `Error while attaching image to test report: ${error.message}`
    );
  }
}

// Get the file name from the file path
export function getFileName(filePath) {
  try {
    return path.basename(filePath);
  } catch (error) {
    console.error(
      `Error while getting the file name from the file path: ${error.message}`
    );
  }
}
