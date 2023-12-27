const url = 'https://api.wheels.tube';
const webUrl = 'https://wheels.tube/';
const tubeUrl = 'https://video.wheels.tube/'

// const url = 'http://localhost:8080';
// const webUrl = 'http://localhost:4200/';

export const environment = {
  production: true,
  hmr: false,
  serverUrl: `${url}/api/v1/`,
  socketUrl: `${url}/`,
  webUrl: webUrl,
  tubeUrl: tubeUrl,
  domain: '.wheels.tube'
};
