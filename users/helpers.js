//Obtained from https://github.com/ezesundayeze/forgotpassword/blob/master/utils/email/sendEmail.js

const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const repository = require('./db/repository')

const SECRET_KEY = process.env.SECRET_KEY || 'this-is-just for tests';
const RESOURCES_URL = process.env.RESOURCES_SERVICE

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

const validatePublicResource = async (resource_id) => {
  try {
    // let resources_idx = []
    // const resources = await repository.get_public_resources()

    // resources.map(r => {
    //   resources_idx.push(r._id)
    // })
    // if (resources_idx.includes(resource_id)) return true
    
    // return false
    const resource = await repository.get_resource_by_id(resource_id);
    if (resource.visibility === "public") return true;
    return false;
  } catch (error) {
    console.log(error)
  }
}

module.exports = {sendEmail, validateUser, validatePublicResource, validateInstituteAdmin};