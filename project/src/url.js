const API_URL = {
  user: process.env.USERS_SERVICE || "http://13.38.61.166:3002",
  institute: process.env.INSTITUTE_SERVICE || "http://13.38.61.166:3001",
  resource: process.env.RESOURCES_SERVICE || "http://13.38.61.166:3000",
};
export default API_URL;
