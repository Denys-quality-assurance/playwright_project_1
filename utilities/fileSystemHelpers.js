import fs from 'fs';
import https from 'https';
import os from 'os';
import path from 'path';
import { pipeline } from 'stream';

// Download image from url to the system's directory for temporary files
export async function downloadImageFromUrlToTempDir(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (
          response.statusCode < 200 ||
          response.statusCode >= 300 ||
          !/^image\//.test(response.headers['content-type'])
        ) {
          reject(new Error(`Failed to download image from ${url}, status code: ${response.statusCode}`));
          return;
        }
        // Get the system's temp directory
        const tmpDir = os.tmpdir();
        // Path to a new temp file
        const filePath = path.join(tmpDir, 'test_picture.jpg');

        const fileStream = fs.createWriteStream(filePath);

        // Cleanup function to delete file and reject promise
        function cleanupAndReject(error) {
          fs.unlink(filePath, () => {}); // deletes the file if any error occurs
          reject(error); // Promise is rejected
        }

        response.on('error', cleanupAndReject); // attaching error event on response
        fileStream.on('error', cleanupAndReject); // attaching error event on fileStream

        pipeline(response, fileStream, (err) => {
          if (err) {
            cleanupAndReject(err);
          } else {
            resolve(filePath);
          }
        });
      })
      .on('error', (error) => {
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
  } catch (err) {
    console.error(err);
    return false;
  }
  return false;
}

// Delete the file temporaty file
export function deleteTempFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error('Error while deleting the file: ', err);
  }
}
