const axios = require('axios');
const repository = require('./db/repository');
const model = require('./db/models')

const USERS_BASE_URL = process.env.USERS_SERVICE


const validateUser = async (headers) => {
    if (!headers) return {status: 401, message: "Token not found"};

    const token = headers.authorization.split(' ')[1];
    if (!token) return {status: 401, message: "Token not found"};
    
    try {
        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {token: token});
        const user = auth_user_res.data;
        return {status: 200, data: user}
    } catch (error) {
        return {status: 400, message: error.message}
    }
}

const validateInstituteAdmin = async (headers, institute_id) => {
    const user = await validateUser(headers);
    if (user.status != 200) return false

    const user_data = user.data;
    if (user_data.superadmin) return true;
    const institute = await repository.get_institute_by_id(institute_id);
    if (!institute) return false
    if (institute.admins.includes(user_data._id.toString())) return true;
    return false;
}

const validateInstituteMembers = async (headers, institute_id) => {
    const institute = await repository.get_institute_by_id(institute_id);
    if (!institute) return false

    const isAdmin =  await validateInstituteAdmin(headers, institute_id);
    if (isAdmin) return true;

    // if user is not an admin, check if user is a member
    const user = await validateUser(headers);
    if (user.status != 200) return false
    const user_data = user.data;
    if (institute.members.includes(user_data._id.toString())) return true;
    return false;
}

const validateTaskMembers = async (headers, task_id) => {
    const task  = await repository.get_task_by_id(task_id);
    if (!task) return false

    const isAdmin =  await validateInstituteAdmin(headers, task.institute.toString());
    if (isAdmin) return true;

    const user = await validateUser(headers);
    if (user.status != 200) return false
    const user_data = user.data;
    if (task.collaborators.includes(user_data._id.toString())) return true;
    return false;
}

const validateUserResource = async (user, resource_id) => {
    if (user.resources.includes(resource_id)) return true;
    return false;
}


const validateUsername = async (username) => {
    const auth_user_res =  await  axios.post(`${USERS_BASE_URL}/validate-user`, {username: username});
    return auth_user_res.data.id
}

const validateUserdata = async (data) => {
    let valid_data = []
    for (let i = 0; i < data.length; i++) {
        const res = await validateUsername(data[i]);
        valid_data.push(res)
    }
    return {status: 200, data: valid_data}

}

const admin_publish_request = async (institute_id, resource_id, headers) => {
    const publish_res = await axios({
        method: 'post',
        url: `${USERS_BASE_URL}/admin-publish-request/${institute_id}/${resource_id}`,
        headers: {'Authorization': `Bearer ${headers.authorization.split(' ')[1]}`}
    })
    if (publish_res.status != 200) return {status: 400, message: "something went wrong"};

    return {status: 200, data: publish_res.data};
}

const validateCollabs = async (collaborators, institute_id) => {
    const institute = await repository.get_institute_by_id(institute_id);
    const admins = institute.admins.toString();
    const members = institute.members.toString();
    const valid_colabs = members.concat(admins)

    console.log(collaborators, '---', valid_colabs)
    return collaborators.every(val => valid_colabs.includes(val));
}

module.exports = {
    validateUser, validateInstituteAdmin, validateInstituteMembers, validateUserResource, validateUserdata, admin_publish_request,
    validateTaskMembers, validateCollabs
};