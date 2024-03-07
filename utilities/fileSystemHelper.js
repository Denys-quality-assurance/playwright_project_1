import fs from 'fs';
import util from 'util';
import https from 'https';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import sharp from 'sharp';

// Create unique file name
export function createUniqueFileName(testInfo, fileName) {
  try {
    const shortenFilename = getShortenName(fileName);
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

// Shorten the string
export function getShortenName(str) {
  try {
    const MAX_LENGTH = 30;

    // Check if the string contains underscore
    if (str.includes('_')) {
      // Split the string on the underscore
      const parts = str.split('_');
      const beforeUnderscore = parts[0].slice(0, MAX_LENGTH); // Get first part, cut up to 30 symbols
      const afterUnderscore = parts.slice(1).join('_'); // If there are multiple underscores, join the strings after the first underscore
      // Concatenate the parts into one string using template literals
      const newString = `${beforeUnderscore}_${afterUnderscore}`;

      // Return the constructed string
      return newString;
    }

    // If there is no underscore, cut the string up to 30 characters
    return str.slice(0, MAX_LENGTH);
  } catch (error) {
    console.error(`Error while getting the short file name: ${error.message}`);
  }
}

// Get path to the system's temp directory
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

// Get path to the system's temp directory with the temporaty file
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

// Download image from url to the system's directory for temporary files
export async function downloadImageFromUrlToTempDir(url, testInfo) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
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
        // Path to a new temp file
        const fileName = createUniqueFileName(
          testInfo,
          'downloaded_picture.jpg'
        );
        const filePath = getTempFilePath(fileName);

        const fileStream = fs.createWriteStream(filePath);

        // Cleanup function to delete file and reject promise
        function cleanupAndReject(error) {
          fs.unlink(filePath, () => {}); // deletes the file if any error occurs
          console.error(
            `Error while deleting file after a previous error: ${error.message}`
          );
          reject(error); // Promise is rejected
        }

        response.on('error', cleanupAndReject); // attaching error event on response
        fileStream.on('error', cleanupAndReject); // attaching error event on fileStream

        pipeline(response, fileStream, (error) => {
          if (error) {
            cleanupAndReject(error);
          } else {
            resolve(filePath);
          }
        });
      })
      .on('error', (error) => {
        console.error(
          `Error while downloading image from url to the system's directory for temporary files: ${error.message}`
        );
        reject(error);
      });
  });
}

// Check file exists
export function checkFileExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      //file exists
      return true;
    }
  } catch (error) {
    console.error(`Error while checking the file existance: ${error.message}`);
    return false;
  }
  return false;
}

// Delete the temporaty file
export function deleteTempFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`Error while deleting the file: ${error.message}`);
  }
}

// Read the file data into a buffer asynchronously
export async function readFile(filePath) {
  try {
    const readFilePromise = util.promisify(fs.readFile); // Create a promisified version of fs.readFile
    const fileBuffer = await readFilePromise(filePath);
    return fileBuffer;
  } catch (error) {
    console.error(
      `Error while reading the file asynchronously: ${error.message}`
    );
  }
}

// Read the file data into a buffer synchronously
export function readFileSync(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch (error) {
    console.error(
      `Error while reading the file synchronously: ${error.message}`
    );
  }
}

// Write data to file
export async function writeFile(filePath, data) {
  try {
    const writeFilePromise = util.promisify(fs.writeFile); // Create a promisified version of fs.writeFile
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
    let expectedBaselinePath;
    // Get browser type
    const defaultBrowserType = testInfo.project.use.defaultBrowserType;
    // Get device type
    const isMobile = sharedContext._options.isMobile || false;
    // Path of the expected Baseline Logo image
    if (isMobile && defaultBrowserType == 'webkit') {
      expectedBaselinePath =
        './tests/test-data/googleSearch/baseline-images/baseline_homepage_logo_Webkit_Mobile.png';
    } else {
      expectedBaselinePath =
        './tests/test-data/googleSearch/baseline-images/baseline_homepage_logo.png';
    }

    // Convert binaris into Buffers, transform Buffers into pixel data for direct comparison
    const expectedBaseline = PNG.sync.read(
      fs.readFileSync(expectedBaselinePath)
    );
    const actualScreenshotOriginalSize = PNG.sync.read(
      fs.readFileSync(actualScreenshotPath)
    );

    // Resize the screenshot if needed
    let actualScreenshot;
    if (
      expectedBaseline.width !== actualScreenshotOriginalSize.width ||
      expectedBaseline.height !== actualScreenshotOriginalSize.height
    ) {
      // The sizes don't match. Resize the screenshot buffer.
      const actualScreenshotOriginalBuffer =
        fs.readFileSync(actualScreenshotPath);
      const resizedScreenshotBuffer = await sharp(
        actualScreenshotOriginalBuffer
      )
        .resize(expectedBaseline.width, expectedBaseline.height) // Resize to expectedBaseline dimensions
        .png()
        .toBuffer();

      // Use resized screenshot buffer
      actualScreenshot = PNG.sync.read(resizedScreenshotBuffer);
    } else {
      // The sizes match. No need to resize.
      actualScreenshot = actualScreenshotOriginalSize;
    }

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
      const diffImageName = createUniqueFileName(
        testInfo,
        'difference_between_basaline_and_actual_screenshot.png'
      );
      const diffImagePath = writeDataToFile(
        mismatchedPixelsDiff,
        diffImageName
      );

      // Attach images to test report
      Promise.all([
        await attachImage(testInfo, expectedBaselinePath),
        await attachImage(testInfo, actualScreenshotPath),
        await attachImage(testInfo, diffImagePath),
      ]);

      // Delete the temporaty files
      deleteTempFile(diffImagePath);
    }
    // Delete the temporaty files
    deleteTempFile(actualScreenshotPath);
    return mismatchedPixelsCount;
  } catch (error) {
    console.error(
      `Error while comparing actual screenshot against a baseline screenshot: ${error.message}`
    );
  }
}

// Write the data into new file via stream
export function writeDataToFile(data, fileName) {
  try {
    const filePath = getTempFilePath(fileName);
    data.pack().pipe(fs.createWriteStream(filePath));
    return filePath;
  } catch (error) {
    console.error(
      `Error while writing the data into new file via stream: ${error.message}`
    );
  }
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
