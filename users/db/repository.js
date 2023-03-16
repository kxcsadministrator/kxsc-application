const Model = require('./models');
const fs = require('fs');
const { query } = require('express');
/* ----------------------------------- Users ----------------------------------- */
const create_new_user = async(data) => {
    const dataToSave = await data.save();
    return dataToSave
}

const get_user_dashboard = async(id) => {
    const institutes = await Model.institute.find({$or: [
        {admins: id},
        {members: id}
    ]}, {_id: 1, name: 1, resources: 1})

    let institute_resources = []
    let main_institute_name = null
    let main_institute_id = null
    let user_resources = []
    let user_tasks = []

    if (institutes.length > 0){
        main_institute_name = institutes[0].name
        main_institute_id = institutes[0]._id
        institute_resources = await Model.resource.find(
            {"_id": {$in: institutes[0].resources}}, 
            {_id: 1, topic: 1, rating: 1, institute: 1, date: 1, author: 1, avatar: 1}
        )
        for (let i = 0; i < institute_resources.length; i++) {
            const resource = institute_resources[i];
            const author = await Model.user.findById(resource.author, {_id: 1, username: 1})
            const institute = await Model.institute.findById(resource.institute, {_id: 1, name: 1})
            resource.author = author.username
            resource.institute = institute.name
            let date  = new Date(resource.date).toDateString()
            let data = {
                _id: resource._id,
                topic: resource.topic,
                author: author.username,
                institute: institute.name,
                rating: resource.rating,
                date: date,
                avatar: resource.avatar
            }
            institute_resources[i] = data
        }
        user_tasks = await Model.task.find({$or: [
            {author: id},
            {collaborators: id}
        ], institute: institutes[0]._id}, {_id: 1, name: 1, status: 1})
    }

    user_resources = await Model.resource.find({author: id}, {_id: 1, topic: 1, rating: 1, institute: 1, date: 1, avatar: 1, author: 1})
    for (let i = 0; i < user_resources.length; i++) {
        const resource = user_resources[i];
        const author = await Model.user.findById(resource.author, {_id: 1, username: 1})
        const institute = await Model.institute.findById(resource.institute, {_id: 1, name: 1})
        resource.author = author.username
        resource.institute = institute.name
        let date  = new Date(resource.date).toDateString()
        let data = {
            _id: resource._id,
            topic: resource.topic,
            author: author.username,
            institute: institute.name,
            rating: resource.rating,
            date: date,
            avatar: resource.avatar
        }
        user_resources[i] = data
    }

    return {
        institute_resource: {
            name: main_institute_name,
            _id: main_institute_id,
            resources: institute_resources
        },
        user_resources: user_resources,
        user_institutes: institutes.slice(1),
        user_tasks: user_tasks
    }
    
}

const clean_user_by_id =  async (id) => {
    const result = await Model.user.findById(id, {_id: 1, username: 1, superadmin: 1, profile_picture: 1, date_created: 1});
    let image = null;
    if (result.profile_picture){
        image = await get_profile_photo(result.profile_picture)
    }
    result.profile_picture = image
    return result;
}

const get_user_by_id =  async (id) => {
    const result = await Model.user.findById(id, {_id: 1, username: 1, superadmin: 1, profile_picture: 1, date_created: 1});
    return result
}

const get_user_by_email = async (user_email) => {
    const result = await Model.user.findOne({email: user_email});
    return result;
}

const get_user_by_username = async (_username_) => {
    const result = await Model.user.findOne({username: _username_});
    return result;
}

const get_user_by_username_or_email = async (name) => {
    let user = await get_user_by_email(name);
    if (!user) user = await get_user_by_username(name);
    return user;
}

const get_all_users = async (offset, limit) => {
    const data =  await Model.user.find({}, {_id: 1, username: 1, superadmin: 1, date_created: 1}).sort({"date_created": -1}).skip((offset - 1) * limit).limit(limit)
    const results = []
    
    for (let i = 0; i < data.length; i++) {
        const user = data[i]
        
        let date  = new Date(user.date_created).toDateString()
        let r = {
            _id: user._id,
            username: user.username,
            superadmin: user.superadmin,
            date_registered: date,
        }
        results.push(r)
    }
    return results
}

const get_institute_members = async(institute_id) => {
    const temp = await Model.institute.findById(institute_id);
    const members = temp.members;
    const admins = temp.admins;

    const member_results = await Model.user.find({ "_id": {$in: members} }, {username: 1, _id: 1});
    const admin_results = await Model.user.find({ "_id": {$in: admins} }, {username: 1, _id: 1});
    const resource_results = await Model.resource.find(
        {"_id": {$in: temp.resources}}, {_id: 1, topic: 1}
    )
    return [member_results, admin_results, resource_results];
}

const get_task_members = async(author_id, collab_idx) => {
    const author = await Model.user.findById(author_id, {username: 1, _id: 1});
    const collab_results = await Model.user.find({ "_id": {$in: collab_idx} }, {username: 1, _id: 1});
    
    return [author, collab_results];
}

const get_resource_data = async(resource_id) => {
    const resource = await Model.resource.findById(resource_id);
    const user = await Model.user.findById(resource.author, {username: 1, _id: 1});
    const institute = await Model.institute.findById(resource.institute, {_id: 1, name: 1});
    
    return [user, institute];
}

const get_resources_readable = async (resources_idx) => {
    const result = await Model.resource.find({"_id": {$in: resources_idx}}, {_id: 1, topic: 1})
    return result;
}

const edit_username = async(id, new_username) => {
    await Model.user.findByIdAndUpdate(id, {username: new_username});
    const result = await clean_user_by_id(id)
    return result;
}

const update_password = async(id, new_password) => {
    await Model.user.findByIdAndUpdate(id, {password: new_password});
    const result = await clean_user_by_id(id);
    return result;
}

const make_super_admin = async (data) => {
    await data.updateOne({superadmin: true});
    const result = await clean_user_by_id(data._id);
    return result;
}

const delete_user = async (data) => {
    const result = await data.deleteOne();
    return result;
}

const add_profile_photo =  async (id, data) => {
    const photo = await Model.profilePic.findOne({user: id});
    if (photo){
        fs.unlink(photo.path, (err) => {
            if (err) {
              console.error(err)
              return
            }
        }
        )
        photo.deleteOne();
    } 
    
    const dataToSave = await data.save();
    await Model.user.findByIdAndUpdate(id, {profile_picture: dataToSave._id.toString()})
    const result = await clean_user_by_id(id);
    return result;
}

const remove_profile_photo = async (photo_id, user_id) => {
    const photo = await Model.profilePic.findById(photo_id);
    if (photo){
        fs.unlink(photo.path, (err) => {
            if (err) {
              console.error(err)
              return
            }
        }
        )
        photo.deleteOne();
    }

    await Model.user.findByIdAndUpdate(user_id, {profile_picture: null});
    const result = await clean_user_by_id(user_id);
    return result;
}

const get_profile_photo = async(photo_id) => {
    const photo = await Model.profilePic.findById(photo_id, {_id: 1, original_name: 1, path: 1});
    return photo;
}

/* ---------------------------------------- Token ------------------------------- */
const create_new_token = async(data) => {
    const result = await data.save();
    return result;
}

const find_existing_token = async(user_id) => {
    const result = await Model.token.findOne({userId: user_id});
    return result;
}

const delete_token = async(token) => {
    const result = await token.deleteOne();
    return result;
}

/*---------------------------------------- Publication Requests -------------------------------------------------*/
const request_to_publish = async (data) => {
    const dataToSave = await data.save();
    return dataToSave;
}

const publish = async (resource_id) => {
    const request = await Model.pubRequest.findOne({resource: resource_id});
    if (!request) throw new Error(`resource ${resource_id} request not found`);

    const resource = await get_resource_by_id(resource_id);
    if (!resource) throw new Error(`resource ${resource_id} not found`);

    await Model.resource.findByIdAndUpdate(resource_id, {visibility: "public"});
    const result = await Model.resource.findById(resource_id);

    await Model.pubRequest.findOneAndDelete({resource: resource_id});
    return result;
}

const find_request_by_resource = async (resource_id) => {
    const data = await Model.pubRequest.findOne({resource: resource_id})
    return data;
}

const get_all_requests = async (offset, limit) => {
    const data = await Model.pubRequest.find().skip((offset - 1) * limit).limit(limit)
    const resources_idx = []
    const res = []

    data.forEach((elem) => {
        resources_idx.push(elem.resource)
    })

    const resources = await get_resources_readable(resources_idx)

    for (let i = 0; i < resources.length; i++) {
        let r = {}
        r.institute = data[i].institute
        r.resource = resources[i]
        r.id = data[i].id
        res.push(r)
    }
    return res;
}

/* ------------------------------ Resources/Institutes misc ----------------------------- */
const get_institute_by_id = async (id) => {
    const result = await Model.institute.findById(id);
    return result;
}

const get_resource_by_id = async (id) => {
    const result = await Model.resource.findById(id);
    return result;
}

const get_public_resources = async () => {
    const data = await Model.resource.find({visibility: "public"})
    return data;
}

const search_resource = async (keyword, id) => {
    const re = new RegExp(keyword, "i")
    let data = []
    let result = await Model.resource.find({topic: {$regex: re}, institute: id}, {_id: 1, topic: 1, author: 1, rating: 1})
    
    for (let i = 0; i < result.length; i++) {
        const item = result[i];
        let obj = {
            _id: item._id,
            topic: item.topic,
            author: await Model.user.findById(item.author, {username: 1}),
            rating: item.rating
        }
        data.push(obj)
    }
    return data;
}

const get_main_institute = async(id) => {
    const res = await Model.institute.find({$or: [
        {admins: id},
        {members: id}
    ]}, {_id: 1, name: 1})
    return res[0]
}

/* ------------------------------ Messages ----------------------------- */
const new_message = async (data) => {
    const result = await data.save();
    return result;
}

const all_messages = async () => {
    const result = await Model.message.find().sort({"date_created": -1});
    return result
}

const get_message_by_id = async (id) => {
    const result = await Model.message.findById(id);
    return result;
}

const broadcast_message = async(sender_id, message) => {
    const recipient_idx = await Model.institute.find().distinct('admins');
    const data = new Model.message({
        sender: sender_id,
        recipients: recipient_idx,
        body: message
    })
    const dataToSave = await data.save();
    return dataToSave;
}

const get_user_messages = async (user_id) => {
    // const result = await Model.message.find({recipients: user_id}, {_id: 1, sender: 1, subject: 1, body: 1, date_created: 1});
    const result = await Model.message.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender_info"
            }
        }
    ])
    const messages = []
    for (let i = 0; i < result.length; i++) {
        const msg = result[i];
        let data = {
            _id: msg._id,
            sender: {_id: msg.sender_info[0]._id,username: msg.sender_info[0].username},
            subject: msg.subject,
            body: msg.body,
            date_created: new Date(msg.date_created).toDateString()
        }
       messages.push(data)
    }
    return messages;
}

const edit_message = async (id, new_body) => {
    await Model.message.findByIdAndUpdate(id, {body: new_body});
    const result = await Model.message.findById(id);
    return result;
}

const delete_message = async (id) => {
    const result = await Model.message.findByIdAndDelete(id);
    return result;
}

/* ------------------------------ Search ----------------------------- */
const super_admin_search = async (query) => {
    let data = {}
    let resource_results = []
    const resources = await Model.resource.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                  query: `${query}`,
                  path: {
                    'wildcard': '*'
                  }
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "topic": 1,
                "author": 1,
                "institute": 1,
                "rating": 1
            }
          }
    ])
    resources.forEach(async (item) => {
        let author_name = await Model.user.findById(item.author, {username: 1})
        let institute_data = await Model.institute.findById(item.institute, {_id: 1, name: 1})
        let obj = {
            _id: item._id,
            topic: item.topic,
            author: author_name,
            institute: institute_data,
            rating: item.rating
        }
        resource_results.push(obj)
    })

    const institute_results = await Model.institute.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                  query: `${query}`,
                  path: {
                    'wildcard': '*'
                  }
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": 1,
            }
          }
    ])
    // const institute_results = await Model.institute.find({$text: {$search: query}}, {_id: 1, name: 1})

    const user_results = await Model.user.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                  query: `${query}`,
                  path: {
                    'wildcard': '*'
                  }
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "username": 1,
                "profile_picture": 1,
            }
          }
    ])
    // const user_results = await Model.user.find({$text: {$search: query}}, {_id: 1, username: 1, profile_picture: 1})
    data["resources"] = resource_results
    data["institutes"] = institute_results
    data["user_results"] = user_results
    return data

}

const search_publication_requests = async (query) => {
    const resource = await Model.resource.find({topic: query})
    if (resource){
        const results = await Model.pubRequest.find({resource: resource._id})
        return results
    }
    return null;   
}

const search_username = async (query) => {
    const re = new RegExp(query, "i");
    const user_results = await Model.user.find({username: {$regex: re}}, {_id: 1, username: 1, profile_picture: 1, email: 1})
    return user_results
}

module.exports = { 
    create_new_user, get_user_by_id, get_user_by_email, get_user_by_username, get_all_users, edit_username, update_password, 
    find_existing_token, delete_token, create_new_token, get_user_by_username_or_email, make_super_admin, delete_user,
    add_profile_photo, remove_profile_photo, request_to_publish, find_request_by_resource, get_public_resources, get_all_requests,
    get_institute_by_id, get_resource_by_id, publish , new_message, get_message_by_id, all_messages, edit_message, delete_message,
    get_user_messages, broadcast_message, get_institute_members, get_task_members, get_resource_data, get_profile_photo,
    clean_user_by_id, get_resources_readable, get_user_dashboard, super_admin_search, search_publication_requests,
    search_username, search_resource, get_main_institute
}