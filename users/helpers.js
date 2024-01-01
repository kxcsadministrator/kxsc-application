//Obtained from https://github.com/ezesundayeze/forgotpassword/blob/master/utils/email/sendEmail.js

const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const axios = require('axios')
const EXTENSION = '.log';

const logger = require('./logger')


const repository = require('./db/repository')
const Model = require('./db/models')

const SECRET_KEY = process.env.SECRET_KEY || 'this-is-just for tests';

const LOG_BASE_URL = process.env.LOG_URL

const clients = {}

const sendEmail = async (email, subject, payload, template) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // naturally, replace both with your real credentials or an application-specific password
      },
    });

    const source = fs.readFileSync(path.join(__dirname, template), "utf8");
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: subject,
        html: compiledTemplate(payload),
      };
    };

    // Send email
    transporter.sendMail(options(), (error, info) => {
      if (error) {
        return error;
      } else {
        return "success";
      }
    });
  } catch (error) {
    return error;
  }
};

/*
Example:
sendEmail(
  "youremail@gmail.com,
  "Email subject",
  { name: "Eze" },
  "./templates/layouts/main.handlebars"
);
*/

const validateUser = async (headers) => {
  if (!headers.authorization) return {status: 401, message: "Token not found"};

  const token = headers.authorization.split(' ')[1];
  if (!token) return {status: 401, message: "Token not found"};
  
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const auth_user = await repository.get_user_by_id(decodedToken.user_id);

    if (!auth_user) return {status: 404, message: "User not found"}
    return {status: 200, data: auth_user}
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

const getAndValidateInstituteAdmin = async(headers, institute_id) => {
  const user = await validateUser(headers);
  if (user.status != 200) return [false, user]

  const user_data = user.data;
  if (user_data.superadmin) return [true, user_data];
  const institute = await repository.get_institute_by_id(institute_id);
  if (!institute) return [false, user_data]
  if (institute.admins.includes(user_data._id.toString())) return [true, user_data];
  return [false, user_data];
}

const validatePublicResource = async (resource_id) => {
  try {
    const resource = await repository.get_resource_by_id(resource_id);
    if (resource.visibility === "public") return true;
    return false;
  } catch (error) {
    console.log(error)
  }
}

const log_request_info = async (message) => {
  logger.info(message)
}

const log_request_error = async (message) => {
  logger.error(message)
}

const get_all_logs = async () => {
  try {
    const res = await axios.get(`${LOG_BASE_URL}/all`);
    return res
  } catch (error) {
    
  }
}

const prepare_log_response = async (data) => {
  let results = []
  data.forEach(element => {
    results.push({'name': element, 'link': `${LOG_BASE_URL}/download/${element}`})
  });
  return results
}

const get_log_files = () => {
  const files = fs.readdirSync('./files/logs/');

  const logFiles = files.filter(file => {
    return path.extname(file).toLowerCase() === EXTENSION;
  }); 
  return logFiles;
}

const delete_file = (path) => {
  if (!path) return;
  fs.unlink(path, (err) => {
      if (err) {
        log_request_error(`file unlink: ${err}`)
        return
      }
    }
  )
}

const send_request_notification = async(request_type="publish-request") => {
  const recipients = await repository.get_super_admins()
  if (recipients.length < 1) {
    return null 
  }

  const recipient_idx = []
  for (let i = 0; i < recipients.length; i++) {
      recipient_idx.push(recipients[i]._id)
  }

for (let i = 0; i < recipient_idx.length; i++) {
  const owner = recipient_idx[i];
  const notification = new Model.notification({
      type: request_type,
      owner: owner
  })
  const notify_res = repository.create_new_notification(notification);
  if (owner in clients){
    const [msg, pub_req, user_req] = await repository.get_user_notifications(owner)
    const data = {messages: msg, publish_requests: pub_req, new_user_requests: user_req}
    clients[owner].write(`data: ${JSON.stringify(data)}\n\n`)
  }
  }
}

const send_instiute_notification = async(id) => {
  const recipients = await repository.get_institute_admins(id)
  if (recipients.length < 1) {
    return null 
  }

  const recipient_idx = []
  for (let i = 0; i < recipients.length; i++) {
      recipient_idx.push(recipients[i]._id)
  }

  for (let i = 0; i < recipient_idx.length; i++) {
    const owner = recipient_idx;
    const notification = new Model.notification({
        type: "request",
        owner: owner
    })
    const notify_res = await repository.create_new_notification(notification);
    if (owner in clients){
      const [msg, req] = await repository.get_user_notifications(owner)
      const data = {messages: msg, requests: req}
      clients[owner].write(`data: ${JSON.stringify(data)}\n\n`)
    }
  }
}

module.exports = {
  sendEmail, validateUser, validatePublicResource, validateInstituteAdmin, log_request_error, log_request_info, get_all_logs,
  prepare_log_response, get_log_files, delete_file, clients, send_request_notification, send_instiute_notification,
  getAndValidateInstituteAdmin
};