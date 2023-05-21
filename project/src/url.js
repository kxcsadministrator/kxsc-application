const API_URL = {
  user: process.env.USER_SERVICE || "http://35.180.192.217:3000",
  institute: process.env.INSTITUTE_SERVICE || "http://35.180.192.217:3001",
  resource: process.env.RESOURCES_SERVICE || "http://35.180.192.217:3002",
};
export default API_URL;
