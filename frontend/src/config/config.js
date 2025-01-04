const { REACT_APP_BACKEND, REACT_APP_SERVER_PORT } = process.env;
const config = {
  serverUrl: `http://${REACT_APP_BACKEND}:${REACT_APP_SERVER_PORT}`,
}
export default config;