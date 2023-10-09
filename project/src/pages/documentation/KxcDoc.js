import React from "react";

function kxcDoc() {
  return (
    <div className="flex flex-col gap-3 w-[90%] mx-auto my-6">
      <h1>KXC Frontend Documentation</h1>
      <p className="md:text-[18px]">
        The KXC Web Application is a robust, React-based web platform designed
        for educational institutions. This application serves as a comprehensive
        solution to manage user registrations, institute creation, and resource
        management. Leveraging a powerful API, the platform facilitates seamless
        interaction between users, institutes, and resources, providing an
        intuitive and dynamic user experience.
      </p>
      <div className="my-4 flex flex-col gap-5">
        <h1>Table of Content</h1>

        <ol className="list-decimal flex flex-col gap-3 md:text-[18px]">
          <li>
            <span className="text-blue-500">Installation and Setup</span>
          </li>
          <li>
            <span className="text-blue-500">Usage</span>
          </li>
          <li>
            <span className="text-blue-500">Styling</span>
          </li>
          <li>
            <span className="text-blue-500">API Integration</span>
          </li>
          <li>
            <span className="text-blue-500">Contributing</span>
          </li>
        </ol>
      </div>
      <div className="my-4 flex flex-col gap-3">
        <h1>1. Installation and Setup</h1>
        <p className="md:text-[18px]">
          To get started with this project, follow these steps
        </p>
        <ol className="flex flex-col md:text-[18px] list-decimal gap-2 -mt-2">
          <li>
            Clone the repository: git clone
            https://github.com/your_username/kxc.git
          </li>
          <li>Install dependencies: npm install</li>
          <li>Start the development server: npm start</li>
        </ol>
      </div>
      <div className="my-4 flex flex-col gap-2">
        <h1>2. Usage</h1>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.1 User Registration</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Creating an Account</h4>
            <ul className="list-disc md:text-[18px]">
              <li>
                Navigate to sign up Page - for public user("/public/sign_up"),
                for admin user("/sign_up"){" "}
              </li>
              <li>Fill in the required fields</li>
              <li>Click on the "sign up" button </li>
            </ul>
          </div>
          <div className="mb-2 flex flex-col gap-1">
            <h4>2. Logging In</h4>
            <ul className="list-disc md:text-[18px]">
              <li>
                Access the login page - for public user ("/public/login"), for
                admin user("/login")
              </li>
              <li>Enter your registered email and password.</li>
              <li>Click "Login" to access your account.</li>
            </ul>
          </div>
          <div className="mb-2 flex flex-col gap-1">
            <h4>3. Create a User(for Admin) </h4>
            <ul className="list-disc md:text-[18px]">
              <li>click on manage user in your dashboard</li>
              <li>click on "create User"</li>
              <li>click on the "Submit" button</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.2 Research Institute Management</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Creating an Institute</h4>
            <ul className="list-disc md:text-[18px]">
              <li>As an administrator, go to the dashboard.</li>
              <li>
                click on "Manage Research Institute" and click on "create RI"
              </li>
              <li>Fill in the required fields</li>
              <li>Click on the "Submit" button </li>
            </ul>
          </div>
          <div className="mb-2 flex flex-col gap-1">
            <h4>2. Adding Member to an Institute</h4>
            <ul className="list-disc md:text-[18px]">
              <li>As an administrator, go to the dashboard.</li>
              <li>
                click on "Manage Research Institute" and click on "List of RI"
              </li>
              <li>click on the "eye" icon to view any institute</li>
              <li>Click on the "Members" tab and click on "add member" </li>
              <li>
                select "registered user" tab if the user is registered or
                "unregistered user" tab if the user is not{" "}
              </li>
              <li>Fill the details and click on "Submit"</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.3 Resources Management</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Creating a Resource</h4>
            <ul className="list-disc md:text-[18px]">
              <li> Go to the dashboard.</li>
              <li>
                Click on "Manage Research Institute" and click on "List of RI"
              </li>
              <li>Click on the "eye" icon to view any institute</li>
              <li>Click on the "Resurces" tab and click on "Add Resource" </li>
              <li>Fill in the required fields</li>
              <li>Click on the "Submit" button </li>
            </ul>
          </div>
          <div className="mb-2 flex flex-col gap-1">
            <h4>2. Approve Pending Resource</h4>
            <ul className="list-disc md:text-[18px]">
              <li>As an administrator, go to the dashboard.</li>
              <li>
                Click on "Manage Resources" and click on "View All Resource
                Items"
              </li>
              <li>Click on any of the resources </li>
              <li>Click on the "Approve resource" button </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.4 Categories Management</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Creating a Category</h4>
            <ul className="list-disc md:text-[18px]">
              <li> Go to the dashboard.</li>
              <li>
                Click on "Manage Categories" and click on "Create Category"
              </li>
              <li>Fill in the required fields</li>
              <li>Click on the "Submit" button </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.5 Resource Type Management</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Creating a Resource Type</h4>
            <ul className="list-disc md:text-[18px]">
              <li> Go to the dashboard.</li>
              <li>
                Click on "Manage Resource Types" and click on "Create Resource
                Type"
              </li>
              <li>Fill in the required fields</li>
              <li>Click on the "Submit" button </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.6 Message Management</h2>
          <div className="mb-2 flex flex-col gap-1">
            <h4>1. Sending a Message</h4>
            <ul className="list-disc md:text-[18px]">
              <li> Go to the dashboard.</li>
              <li>Click on "Messages and click on "Send Messages"</li>
              <li>Fill in the required fields</li>
              <li>Click on the "Send" button </li>
            </ul>
          </div>
        </div>
        <div className="mt-3 mb-1 flex flex-col">
          <h2>2.6 Logging Out</h2>
          <div className="mb-2 flex flex-col gap-1">
            <ul className="list-disc md:text-[18px]">
              <li>Click on your profile icon</li>
              <li>Select "Log Out" from the dropdown menu"</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-4 flex flex-col gap-2">
        <h1>3. Styling</h1>
        <p className="md:text-[18px] ">
          The styling of KXC Web Application is achieved through a combination
          of Tailwind CSS, Bootstrap, and custom CSS. This approach allows for a
          flexible and responsive design that caters to various screen sizes and
          devices.
        </p>
      </div>
      <div className="my-4 flex flex-col gap-2">
        <h1>4. Axios</h1>
        <p className="md:text-[18px] ">
          Axios serves as the primary tool for making API requests in this
          project. It provides a simple and intuitive interface for sending HTTP
          requests to the backend server, receiving responses, and handling
          errors.
        </p>
        <p className="md:text-[18px] ">
          Key features of Axios integration in this project include:
        </p>
        <ul className="list-disc">
          <li>
            RESTful API Consumption: Axios is utilized to interact with the
            backend API endpoints, allowing for the retrieval and manipulation
            of data related to users, institutes, resources, and other entities.
          </li>
          <li>
            Asynchronous Requests: Axios supports asynchronous operations,
            ensuring that API requests do not block the main thread and allowing
            for a responsive user interface.
          </li>
          <li>
            Error Handling: The library provides mechanisms for handling errors,
            including network issues, server errors, and other potential issues
            that may arise during API interactions.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default kxcDoc;
