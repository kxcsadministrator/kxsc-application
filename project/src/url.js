const API_URL = {
  user: process.env.USER_SERVICE || "http://52.47.55.146:3000",
  institute: process.env.INSTITUTE_SERVICE || "http://52.47.55.146:3001",
  resource: process.env.RESOURCES_SERVICE || "http://52.47.55.146:3002",
};
export default API_URL;
