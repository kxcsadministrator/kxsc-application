const API_URL = {
  user: process.env.USERS_SERVICE || "https://moniat60.com.ng:3000",
  institute: process.env.INSTITUTE_SERVICE || "https://moniat60.com.ng:3001",
  resource: process.env.RESOURCES_SERVICE || "https://moniat60.com.ng:3002",
};
export default API_URL;
