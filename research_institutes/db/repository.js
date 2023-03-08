const Model = require('./models');
const fs = require('fs');
const axios = require('axios');
const USERS_BASE_URL = process.env.USERS_SERVICE

/* 
The functions in this file interact directly with the DB. These functions abstract away
all business logic related to the database hence can be used directly in any routes file.

The aim of this style of implementation is for the code in the routes to remain the same
irrespective of the type of db being used.
*/

//************************ Some helpers added here to prevent circular imports ***********************//
const get_insitute_member_data = async(institute_id, headers) => {
    const publish_res = await axios({
        method: 'get',
        url: `${USERS_BASE_URL}/institute-data/${institute_id}`,
        headers: {'Authorization': `Bearer ${headers.authorization.split(' ')[1]}`}
    })

    return publish_res.data;
}

const get_task_member_data = async(author_id, collab_idx, headers) => {
    const publish_res = await axios({
        method: 'get',
        url: `${USERS_BASE_URL}/task-data`,
        data: {"author": author_id, "collabs": collab_idx},
        headers: {'Authorization': `Bearer ${headers.authorization.split(' ')[1]}`}
    })

    return publish_res.data;
}

const get_task_readable = async (task, header) => {
    const member_data = await get_task_member_data(task.author, task.collaborators, header);
    const institute = await get_institute_by_id(task.institute)
    const files = await Model.taskFile.find({ "_id": {$in: task.files} }, {_id: 1, original_name: 1, date_created: 1});
    const comments = await Model.comment.find({ "_id": {$in: task.comments} }, {_id: 1, body: 1, date_created: 1});
    
    const result = {
        "id": task._id, 
        "institute": institute.name,
        "author": member_data.author,
        "collaborators": member_data.collaborators,
        "files": files,
        "comments": comments
    }
    return result;
}

const log_request_error = async (message) => {
    try {
      const res = await axios.post(`${LOG_BASE_URL}/error`, {"message": message});
      return res
    } catch (error) {
      console.log(error)
    }
}

const get_resources_readable = async (resources_idx) => {
    const publish_res = await axios({
        method: 'post',
        url: `${USERS_BASE_URL}/resources-data`,
        data: {"resources": resources_idx}
    })
    if (publish_res.status != 200) return {status: 400, message: "something went wrong"};

    return {status: 200, data: publish_res.data};
}

/* ----------------------------------- Institutes ----------------------------------- */
const create_new_institute = async(data) => {
    const dataToSave = await data.save();
    return dataToSave;
}

const get_institute_by_name = async (name) => {
    const result = await Model.institute.findOne({'name': name});
    return result;
}

const get_institute_by_id = async(id) => {
    const institute = await Model.institute.findById(id);
    return institute;
}

const get_institute_data = async (id, headers, user_id='') => {
    const institute = await Model.institute.findById(id);
    if (!institute) return null;
    const member_data = await get_insitute_member_data(id, headers);
    let tasks = null
    const files = await Model.instituteFile.find({ "_id": {$in: institute.files} }, {_id: 1, original_name: 1, date_created: 1})

    if (user_id === ''){
        tasks = await Model.task.find({ "_id": {$in: institute.tasks} }, {_id: 1, name: 1})
    }
    else tasks = await get_user_tasks_by_institute(id, user_id);
    
    const result = {
        "id": institute._id,
        "name": institute.name,
        "members": member_data.members,
        "admins": member_data.admins,
        "resources": member_data.resources,
        "tasks": tasks,
        "files": files
    }
    return result;
}


const get_all_institutes = async() => {
    const result = await Model.institute.find({}, {_id: 1, name: 1}).sort({"date_created": -1});
    return result;
}

const get_user_institutes = async(user_id) => {
    const result = await Model.institute.find({$or: [
        {admins: user_id},
        {members: user_id}
    ]},{_id: 1, name: 1}).sort({"date_created": -1});
    return result
}

const add_institute_admins =  async (id, admin_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$addToSet: {admins: admin_idx}});
    const result = await Model.institute.findById(id,  {_id: 1, name: 1});
    return result;
}

const remove_institue_admins = async (id, admin_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$pullAll: {admins: admin_idx}});
    const result = await Model.institute.findById(id,  {_id: 1, name: 1});
    return result;
}

const add_institute_members =  async (id, members_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$addToSet: {members: members_idx}});
    const result = await Model.institute.findById(id, {_id: 1, name: 1});
    return result;
}

const remove_institute_members = async (id, members_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$pullAll: {members: members_idx}});
    const result = await Model.institute.findById(id, {_id: 1, name: 1});
    return result;
}

const add_institute_file = async (institute_id, data) => {
    let idx = [];
    const dataToSave = await Model.instituteFile.insertMany(data);
    dataToSave.forEach(element =>{
        idx.push(element._id);
    });
    let parent = await Model.institute.findByIdAndUpdate(institute_id, {$addToSet: {files: idx}});
    parent = await Model.institute.findById(institute_id, {_id: 1, name: 1});
    return parent;
}

const get_institute_file_by_id = async(file_id) => {
    const res = await Model.instituteFile.findById(file_id)
    return res;
}

const delete_institute_file = async(file_id) => {
    const file = await Model.instituteFile.findById(file_id)
    const parent_id = file.parent.toString();

    let institute = await Model.institute.findByIdAndUpdate(parent_id, {$pullAll: {files: [file_id]}});

    fs.unlink(file.path, (err) => {
            if (err) {
            log_request_error(`file unlink: ${err}`)
            return
            }
        }
    )
    Model.instituteFile.findByIdAndDelete(file_id)
    institute = await Model.institute.findById(parent_id, {_id: 1, name: 1})
    return institute;
}

const add_resources_to_institute = async(institute_id, resources_idx) => {
    await Model.institute.findByIdAndUpdate(institute_id, {$addToSet: {resources: resources_idx}});
    const result = await Model.institute.findById(institute_id, {_id: 1, name: 1});
    return result;
}

const remove_resources_from_institute = async (institute_id, resources_idx) => {
    await Model.institute.findByIdAndUpdate(institute_id, {$pullAll: {resources: resources_idx}});
    const result = await Model.institute.findById(institute_id, {_id: 1, name: 1});
    return result;
}


const get_institute_files = async (id) => {
    const result = Model.instituteFile.find({parent: id});
    return result;
}

const get_one_institute_file = async (id) => {
    const result = Model.instituteFile.findById(id)
    return result;
}

const get_institute_count = async () => {
    const result = await Model.institute.count();
    return result;
}

const edit_institute_name = async (id, new_name) => {
    let result = await Model.institute.findByIdAndUpdate(id, {name: new_name});
    result = await Model.institute.findById(id, {_id: 1, name: 1});
    return result;
}

const update_institute = async(id, updateObj) => {
    const data = await Model.institute.findByIdAndUpdate(id, updateObj)
    const res = await Model.institute.findById(id, {_id: 1, name: 1});
    return res
}

const delete_institute = async (id) => {
    const files = await Model.instituteFile.find({parent: id});
    if (files){
        files.map(p => {
            fs.unlink(p.path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            }
            )
        })
    }
    const institute = await Model.institute.findById(id);
    const tasks = institute.tasks;
    
    for (let i = 0; i < tasks.length; i++){
        await delete_task(tasks[i]._id.toString());
    }

    await Model.instituteFile.deleteMany({parent: id});
    const result = await Model.institute.findByIdAndDelete(id);
    return result
}

/*---------------------------------------- Publication Requests -------------------------------------------------*/
const request_to_publish = async (data) => {
    const dataToSave = await data.save();
    return dataToSave;
}

const publish = async (institute_id, resource_id) => {
    const request = await Model.pubRequest.findOne({resource: resource_id});
    if (!request) throw new Error(`resource ${resource_id} request not found`);

    const institute = await get_institute_by_id(institute_id)
    if (institute.resources.includes(resource_id)) throw new Error(`resource  $${resource_id} already published under institute ${institute_id}`)

    const data = await add_resources_to_institute(institute_id, [resource_id]);
    await Model.pubRequest.findOneAndDelete({resource: resource_id});
    return data;
}

const find_request_by_resource = async (resource_id) => {
    const data = await Model.pubRequest.findOne({resource: resource_id})
    return data;
}

const get_institute_requests = async (institute_id) => {
    let data = await Model.pubRequest.find({institute: institute_id})
    let result = []
    const resources = []
    data.forEach((elem) => {
        resources.push(elem.resource)
    })
    const res = await get_resources_readable(resources)
    const arr = res.data
    
    for (let i = 0; i < arr.length; i++) {
        const r = {}
        r.institute = data[i].institute
        r.id = data[i].id
        r.resource = arr[i]
        result.push(r)
    }
    return result;
}

/*---------------------------------------- Tasks -------------------------------------------------*/
const create_new_task = async(data) => {
    const dataToSave = await data.save();
    const institute_id = dataToSave.institute;

    // update institute with tasks
    await Model.institute.findByIdAndUpdate(institute_id, {$addToSet: {tasks: dataToSave._id}})
    return dataToSave;
}

const get_task_by_name = async (name, institute_id) => {
    const result = await Model.task.findOne({'name': name, institute: institute_id});
    return result;
}


const get_task_data = async(id, header) => {
    const task = await Model.task.findById(id);
    
    const result = await get_task_readable(task, header)
    return result;
}

const get_task_by_id = async (id) => {
    const result = await Model.task.findById(id);
    return result;
}

const get_all_institute_tasks = async(id) => {
    const result = await Model.task.find({institute: id}, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const get_all_tasks = async() => {
    const result =  await Model.task.find({}, {_id: 1, name: 1, author: 1, status: 1}).sort({"date_created": -1});
    return result;
}

const get_user_tasks_by_institute = async(institute_id, user_id) => {
    const result = await Model.task.find({institute: institute_id, 
        $or: [
            {author: user_id},
            {collaborators: user_id}
        ]
    }).sort({"date_created": -1});
    return result
} 

const update_task = async(id, updateObj) => {
    const data = await Model.task.findByIdAndUpdate(id, updateObj);
    const result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1})
    return result
}

const delete_task = async (id) => {
    const files = await Model.taskFile.find({parent: id});
    if (files){
        files.map(p => {
            fs.unlink(p.path, (err) => {
                if (err) {
                  console.error(err)
                  return
                }
            }
            )
        })
    }
    
    const result = await Model.task.findByIdAndDelete(id);
    const parent_id = result.institute;

    await Model.institute.findByIdAndUpdate(parent_id, {$pullAll: {tasks: [id]}});
    await Model.taskFile.deleteMany({parent: id});
    await Model.comment.deleteMany({task: id});
    return result;
}

const mark_task_as_completed = async (id) => {
    const task = await Model.task.findByIdAndUpdate(id, {status: "completed"})
    const result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const mark_task_as_pending = async (id) => {
    const task = await Model.task.findByIdAndUpdate(id, {status: "ongoing"})
    const result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const add_collaborators =  async (id, collab_idx) => {
    await Model.task.findByIdAndUpdate(id, {$addToSet: {collaborators: collab_idx}});
    const result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const remove_collaborators =  async (id, collab_idx) => {
    await Model.task.findByIdAndUpdate(id, {$pullAll: {collaborators: collab_idx}});
    const result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const add_task_file = async (task_id, data) => {
    let idx = [];
    const dataToSave = await Model.taskFile.insertMany(data);
    dataToSave.forEach(element =>{
        idx.push(element._id);
    });
    let parent = await Model.task.findByIdAndUpdate(task_id, {$addToSet: {files: idx}});
    parent = await Model.task.findById(task_id, {_id: 1, name: 1, author: 1, status: 1});
    return parent;
}

const get_tasks_files = async (id) => {
    const result = Model.taskFile.find({parent: id});
    return result;
}

const get_one_task_file = async (id) => {
    const result = Model.taskFile.findById(id);
    return result;
}

const edit_task_name = async (id, new_name) => {
    let result = await Model.task.findByIdAndUpdate(id, {name: new_name});
    result = await Model.task.findById(id, {_id: 1, name: 1, author: 1, status: 1});
    return result;
}

const add_task_comment = async (data) => {
    const dataToSave = await data.save();
    const task_id = dataToSave.task;
    await Model.task.findByIdAndUpdate(task_id, {$addToSet: {comments: dataToSave._id}});
    return dataToSave;
}

const get_task_comments = async (id) => {
    const result = await Model.comment.find({task: id});
    return result;
}

const get_comment_by_id = async (id) => {
    const result = await Model.comment.findById(id);
    return result;
}

const edit_task_comment = async (id, new_body) => {
    let result = await Model.comment.findByIdAndUpdate(id, {body: new_body});
    result = await Model.comment.findById(id);
    return result;
}

const delete_task_comment = async(id) => {
    const result = await Model.comment.findByIdAndDelete(id);
    return result;
}


module.exports = { 
    create_new_institute, get_institute_by_name, get_institute_by_id, get_all_institutes, add_institute_admins,
    remove_institue_admins, add_institute_members, remove_institute_members, add_institute_file, get_institute_files,
    get_one_institute_file, get_institute_count, delete_institute, create_new_task, get_task_by_name, get_all_institute_tasks,
    get_all_tasks, get_task_by_id, delete_task, add_collaborators, remove_collaborators, get_tasks_files, get_one_task_file,
    add_task_file, add_task_comment, get_task_comments, edit_task_comment, delete_task_comment, get_comment_by_id, edit_task_name,
    edit_institute_name, add_resources_to_institute, remove_resources_from_institute, request_to_publish, publish, find_request_by_resource,
    get_institute_requests, get_institute_data, get_task_data, mark_task_as_completed, mark_task_as_pending, update_task, update_institute,
    get_institute_file_by_id, delete_institute_file, get_user_institutes, get_user_tasks_by_institute
 };