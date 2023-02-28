const Model = require('./models');
const fs = require('fs');
const { model } = require('mongoose');
/* ----------------------------------- Users ----------------------------------- */
const create_new_user = async(data) => {
    const dataToSave = await data.save();
    return dataToSave
}

const get_user_by_id =  async (id) => {
    const result = await Model.user.findById(id);
    return result;
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

const get_all_users = async () => {
    const result =  await Model.user.find();
    return result;
}

const edit_username = async(id, new_username) => {
    await Model.user.findByIdAndUpdate(id, {username: new_username});
    const result = await Model.user.findById(id)
    return result;
}

const update_password = async(id, new_password) => {
    await Model.user.findByIdAndUpdate(id, {password: new_password});
    const result = await Model.user.findById(id);
    return result;
}

const make_super_admin = async (data) => {
    await data.updateOne({superadmin: true});
    const result = await Model.user.findById(data._id);
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
    const result = await Model.user.findById(id);
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
    const result = await Model.user.findById(user_id);
    return result;
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

const get_all_requests = async () => {
    const data = await Model.pubRequest.find()
    return data;
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
    const result = await Model.message.find({recipients: user_id});
    return result;
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

module.exports = { 
    create_new_user, get_user_by_id, get_user_by_email, get_user_by_username, get_all_users, edit_username, update_password, 
    find_existing_token, delete_token, create_new_token, get_user_by_username_or_email, make_super_admin, delete_user,
    add_profile_photo, remove_profile_photo, request_to_publish, find_request_by_resource, get_public_resources, get_all_requests,
    get_institute_by_id, get_resource_by_id, publish , new_message, get_message_by_id, all_messages, edit_message, delete_message,
    get_user_messages, broadcast_message
}