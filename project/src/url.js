const API_URL = {
  user: process.env.USERS_SERVICE || "https://sedaltd.com:3000",
  institute: process.env.INSTITUTE_SERVICE || "https://sedaltd.com:3001",
  resource: process.env.RESOURCES_SERVICE || "https://sedaltd.com:3002",
};
export default API_URL;
