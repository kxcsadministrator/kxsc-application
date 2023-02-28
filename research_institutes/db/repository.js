const Model = require('./models');
const fs = require('fs');
/* 
The functions in this file interact directly with the DB. These functions abstract away
all business logic related to the database hence can be used directly in any routes file.

The aim of this style of implementation is for the code in the routes to remain the same
irrespective of the type of db being used.
*/

/* ----------------------------------- Institutes ----------------------------------- */
const create_new_institute = async(data) => {
    const dataToSave = await data.save();
    return dataToSave;
}

const get_institute_by_name = async (name) => {
    const result = await Model.institute.findOne({'name': name});
    return result;
}

const get_institute_by_id = async (id) => {
    const result = await Model.institute.findById(id);
    return result;
}

const get_all_institutes = async() => {
    const result = await Model.institute.find().sort({"date_created": -1});
    return result;
}

const add_institute_admins =  async (id, admin_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$addToSet: {admins: admin_idx}});
    const result = await Model.institute.findById(id);
    return result;
}

const remove_institue_admins = async (id, admin_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$pullAll: {admins: admin_idx}});
    const result = await Model.institute.findById(id);
    return result;
}

const add_institute_members =  async (id, members_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$addToSet: {members: members_idx}});
    const result = await Model.institute.findById(id);
    return result;
}

const remove_institute_members = async (id, members_idx) => {
    await Model.institute.findByIdAndUpdate(id, {$pullAll: {members: members_idx}});
    const result = await Model.institute.findById(id);
    return result;
}

const add_institute_file = async (institute_id, data) => {
    let idx = [];
    const dataToSave = await Model.instituteFile.insertMany(data);
    dataToSave.forEach(element =>{
        idx.push(element._id);
    });
    let parent = await Model.institute.findByIdAndUpdate(institute_id, {$addToSet: {files: idx}});
    parent = await Model.institute.findById(institute_id);
    return parent;
}

const add_resources_to_institute = async(institute_id, resources_idx) => {
    await Model.institute.findByIdAndUpdate(institute_id, {$addToSet: {resources: resources_idx}});
    const result = await Model.institute.findById(institute_id);
    return result;
}

const remove_resources_from_institute = async (institute_id, resources_idx) => {
    await Model.institute.findByIdAndUpdate(institute_id, {$pullAll: {resources: resources_idx}});
    const result = await Model.institute.findById(institute_id);
    return result;
}


const get_institute_files = async (id) => {
    const result = Model.instituteFile.find({parent: id});
    return result;
}

const get_one_institute_file = async (file_name) => {
    const result = Model.instituteFile.findOne({name: file_name});
    return result;
}

const get_institute_count = async () => {
    const result = await Model.institute.count();
    return result;
}

const edit_institute_name = async (id, new_name) => {
    let result = await Model.institute.findByIdAndUpdate(id, {name: new_name});
    result = await Model.institute.findById(id);
    return result;
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
    const data = await Model.pubRequest.find({institute: institute_id})
    return data;
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

const get_task_by_id = async (id) => {
    const result = await Model.task.findById(id)
    return result;
}

const get_all_institute_tasks = async(id) => {
    const result = await Model.task.find({institute: id});
    return result;
}

const get_all_tasks = async() => {
    const result =  await Model.task.find().sort({"date_created": -1});
    return result;
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

const add_collaborators =  async (id, collab_idx) => {
    await Model.task.findByIdAndUpdate(id, {$addToSet: {collaborators: collab_idx}});
    const result = await Model.task.findById(id);
    return result;
}

const remove_collaborators =  async (id, collab_idx) => {
    await Model.task.findByIdAndUpdate(id, {$pullAll: {collaborators: collab_idx}});
    const result = await Model.task.findById(id);
    return result;
}

const add_task_file = async (task_id, data) => {
    let idx = [];
    const dataToSave = await Model.taskFile.insertMany(data);
    dataToSave.forEach(element =>{
        idx.push(element._id);
    });
    let parent = await Model.task.findByIdAndUpdate(task_id, {$addToSet: {files: idx}});
    parent = await Model.task.findById(task_id);
    return parent;
}

const get_tasks_files = async (id) => {
    const result = Model.taskFile.find({parent: id});
    return result;
}

const get_one_task_file = async (file_name) => {
    const result = Model.taskFile.findOne({name: file_name});
    return result;
}

const edit_task_name = async (id, new_name) => {
    let result = await Model.task.findByIdAndUpdate(id, {name: new_name});
    result = await Model.task.findById(id);
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
    get_institute_requests
 };