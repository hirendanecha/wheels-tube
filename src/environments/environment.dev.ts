const url = 'https://api.wheels.tube';
const webUrl = 'https://wheels.tube/';
const tubeUrl = 'https://video.wheels.tube/'

// const url = 'http://localhost:8080';
// const webUrl = 'http://localhost:4200/';

export const environment = {
  production: false,
  hmr: false,
  serverUrl: `${url}/api/v1/`,
  socketUrl: `${url}/`,
  webUrl: webUrl,
  tubeUrl: tubeUrl,
  domain: '.wheels.tube',
  siteKey:'0x4AAAAAAAUwDv2sJ3UlZCEf',
  secretKey:'0x4AAAAAAAUwDilFmDq516h-owR9Q0Ew5hk'
};
