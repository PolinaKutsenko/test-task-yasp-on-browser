import _ from 'lodash';
// import fs from 'fs';
import path from 'path';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);

const app = () => {
  const button = document.querySelector('button');
  button.addEventListener('click', async () => {
    console.log('clicked!');
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const displayMediaOptions = {
      video: {
        cursor: 'never',
      },
      audio: false,
    };

    video.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

    const videoTrack = video.srcObject.getVideoTracks()[0];
    const { height, width } = videoTrack.getSettings();

    context.drawImage(video, 0, 0, width, height);
    context.getImageData(0, 0, width, height);
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    document.body.append(link);
    link.href = dataURL;
    link.download = 'image.png';
    const base64Format = dataURL.split('base64,')[1];
    console.log(base64Format);

    const response = await fetch('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer t1.9euelZrOz4rHycmXjpnKkYqKj5PKlO3rnpWaj5qXzseMnZOMmpySz8vOkMfl8_dmCB1j-e8vWztu_t3z9yY3GmP57y9bO27-zef1656VmpiQmpWUm4-JkMiUzsyVl5iV7_0.2L_r4tYZ-XGbHV1DzXGsjvc_wahpFATxfeZqMvPiz26MgIERFlfbLpZ1g9gt7I-uG82HdDjrKa0rCc7V2pSBAQ',
      },
      body: {
        folderId: 'string',
        analyze_specs: [{
          content: base64Format,
          features: [{
            type: 'TEXT_DETECTION',
            text_detection_config: {
              language_codes: ['*'],
            },
          }],
        }],
      },
    });
    const result = await response.json();
    console.log(result);
    const fileName = `${_.uniqueId('txtFile_')}.txt`;
    const filePath = buildFullPath(`screenshots/${fileName}`);
    /* fs.writeFile(filePath, result, (e) => {
      if (e) {
        console.log('Something wrong!');
      } else {
        console.log('File .txt written successfully!');
      }
    }); */
  });
};

export default app;
