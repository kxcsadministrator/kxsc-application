const axios = require('axios');
const repository = require('./db/repository');

const USERS_BASE_URL = process.env.USERS_SERVICE

const LOG_BASE_URL = process.env.LOG_URL

/** 
 * Checks array 1 for elements of array2 not in array1
 * Example:
 * a1 = [1, 3, 5, 7]
 * a2 = [2, 3, 4, 5]
 * validateArray(a1, a2) ==> arr = [1, 2, 4] 
*/
const validateArray = async (array1, array2)=>{
    let arr = []
    for (const e in array2) {
        let elem = array2[e]
        if ( array1.indexOf(elem) === -1 ) {
            arr.push(elem);
        }
    }
    return arr;
}

const validateUser = async (headers) => {
    // if (!headers.authorization) return {status: 401, message: "Token not found"};

    const token = headers.authorization.split(' ')[1];
    // if (!token) return {status: 401, message: "Token not found"};
    
    try {
        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {token: token});
        const user = auth_user_res.data;
        return {status: 200, data: user}
    } catch (error) {
        return {status: 400, message: error.message}
    }
}

const validateTopicName = async (topic_name, institute_id, author_id) => {
    const resource = await repository.get_resource_by_topic(topic_name);
    if (!resource) return true;
    
    if (resource.institute.toString() == institute_id && resource.author.toString() == author_id) return false;
    return true;
}

const log_request_info = async (message) => {
    try {
      const res = await axios.post(`${LOG_BASE_URL}/info`, {"message": message});
      return res
    } catch (error) {
      console.log(error)
    }
  }
  
  const log_request_error = async (message) => {
    try {
      const res = await axios.post(`${LOG_BASE_URL}/error`, {"message": message});
      return res
    } catch (error) {
      console.log(error)
    }
  }

module.exports = {validateArray, validateUser, validateTopicName, log_request_error, log_request_info};