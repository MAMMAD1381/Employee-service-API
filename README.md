# **Employee Service API**
# Table of Contents
- [**Employee Service API**](#employee-service-api)
- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
  - [Descriptions](#descriptions)
- [Router Class Documentation](#router-class-documentation)
  - [Initialization](#initialization)
  - [Methods](#methods)
  - [Usage Example](#usage-example)
  - [Notes](#notes)
- [Middleware Functions](#middleware-functions)
  - [bodyParser](#bodyparser)
    - [Parameters](#parameters)
    - [Usage Example](#usage-example-1)
    - [Implementation](#implementation)
  - [paramParser](#paramparser)
    - [Parameters](#parameters-1)
    - [Usage Example](#usage-example-2)
    - [Implementation](#implementation-1)
  - [bodyValidation](#bodyvalidation)
    - [Parameters](#parameters-2)
    - [Usage Example](#usage-example-3)
    - [Implementation](#implementation-2)
  - [paramValidation](#paramvalidation)
    - [Parameters](#parameters-3)
    - [Usage Example](#usage-example-4)
    - [Implementation](#implementation-3)
  - [customErrorHandler](#customerrorhandler)
    - [Parameters](#parameters-4)
    - [Usage Example](#usage-example-5)
    - [Implementation](#implementation-4)
  - [Notes](#notes-1)


# Overview
The **Employee Service API** is a scalable and robust solution for managing employee data, built using pure Node.js with minimal third-party libraries. This project emphasizes modularity and performance, providing a highly efficient API for various employee management tasks.

# Setup

## Prerequisites
Before you begin, ensure you have met the following requirements:

- **Node.js**: Install the latest version of Node.js.
- **Redis**: Ensure Redis is installed and running on your machine.
- **npm**: Node Package Manager is required for managing dependencies.

## Installation

To set up and install the Employee Service API, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/MAMMAD1381/Employee-service-API.git
   ```

2. Navigate to the project directory:
   ```sh
   cd employee-service-api
   ```

3. Install the necessary dependencies:
   ```sh
   npm install
   ```

4. Start the Redis server (if not already running):
   ```sh
   redis-server
   ```

5. Run the application:
   ```sh
   npm start
   ```

# Project Structure

```
node_modules/
src/
│
├── controller/
│   └── controller.js
│
├── errors/
│   ├── CustomError.js
│   └── customErrorHandler.js
│
├── middleware/
│   ├── Parsers/
│   └── Validations/
│
├── models/
│   └── RedisModel.js
│
├── repositories/
│   └── UserRepository.js
│
├── routes/
│   ├── dataServiceRoute.js
│   └── Router.js
│
├── schema/
│   ├── BodySchemas/
│   ├── ParamSchemas/
│   └── schema.js
│
├── services/
│   └── UserService.js
│
├── utils/
│   ├── commonResponse.js
│   ├── Password.js
│   ├── Regex.js
│   └── Server.js
│
├── .env
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```

---

This structure reflects the organization of your project as shown in the images. Each directory and file is listed, providing a clear overview of the project's layout. You can add descriptions of each part if needed for more clarity:

## Descriptions

- **controller/**: Contains the application controllers.
- **errors/**: Custom error classes and error handlers.
- **middleware/**: Middleware components for parsing and validation.
- **models/**: Data models used in the application.
- **repositories/**: Data access layer, interacting with the data source.
- **routes/**: Defines the application routes.
- **schema/**: Validation schemas for request bodies and parameters.
- **services/**: Business logic layer.
- **utils/**: Utility functions and modules.
- **index.js**: Main entry point of the application.
- **.env**: Environment variables.
- **.gitignore**: Specifies which files and directories to ignore in version control.
- **package.json**: Metadata about the project and its dependencies.
- **README.md**: Project documentation (this file).


# Router Class Documentation

**Class Overview**  
The `Router` class provides a flexible and scalable routing system built on the Node.js `http` module. It includes custom body and parameter parsers and supports middleware and error handling. This class is designed to manage HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `UPDATE`) efficiently, with the ability to handle routes with placeholders (e.g., `/something/:id`).

## Initialization

```javascript
constructor(request, response)
```

- **`request`**: The HTTP request object.
- **`response`**: The HTTP response object.

## Methods

**`route`**

Sets a global path to execute functions for the specified routes. This method accepts URLs with placeholders.

```javascript
route(path)
```

- **`path`**: The route path as a string (e.g., `/something/:id`).

**Returns**: The current `Router` instance for chainability.

---

**`get`**

Registers a handler for `GET` requests.

```javascript
get()
```

**Returns**: The current `Router` instance for chainability.

---

**`post`**

Registers a handler for `POST` requests.

```javascript
post()
```

**Returns**: The current `Router` instance for chainability.

---

**`put`**

Registers a handler for `PUT` requests.

```javascript
put()
```

**Returns**: The current `Router` instance for chainability.

---

**`delete`**

Registers a handler for `DELETE` requests.

```javascript
delete()
```

**Returns**: The current `Router` instance for chainability.

---

**`update`**

Registers a handler for `UPDATE` requests.

```javascript
update()
```

**Returns**: The current `Router` instance for chainability.

---

**`exec`**

Executes all registered routes parallel. This method should be called last to ensure proper route execution.

```javascript
async exec(errorHandler)
```

- **`errorHandler`**: Optional error handler function.

---

**Private Methods**

**`#execMethod`**

Executes all registered functions for a given method and route.

```javascript
async #execMethod(method, Arguments)
```

- **`method`**: The HTTP method (e.g., `GET`, `POST`).
- **`Arguments`**: The arguments passed to the registered handlers.

---

**`#setRegex`**

Sets the regex pattern for the route with placeholders.

```javascript
#setRegex(path)
```

- **`path`**: The route path as a string.

---

**`#end`**

Handles the response at the end of route execution. Returns error responses if necessary.

```javascript
async #end()
```

## Usage Example

Here's an example of how to use the `Router` class:

```javascript
const { addUser, updateUser, getUser, deleteUser, getUsers, getUserByUsername } = require('../controller/controller')
const Router = require('./Router')
const customErrorHandler = require('../errors/customErrorHandler')
const schema = require('../schema/schema')

// middlewares
const paramParser = require('../middleware/Parsers/paramParser')
const paramValidation = require('../middleware/Validations/paramValidation')
const bodyValidation = require('../middleware/Validations/bodyValidation')
const bodyParser = require('../middleware/Parsers/bodyParser')

/**
 * route related to dataService
 * @param {Request} req 
 * @param {Response} res 
 */
const dataService = async (req, res) => {
    let router = new Router(req, res)

    // get
    router
        .route(routingRoutes.get)
        .get(paramParser(routingRoutes.get), paramValidation(schema.param.get), getUser)

    // post
    router
        .route(routingRoutes.post)
        .post(bodyParser, bodyValidation(schema.body.post), addUser)

    // put
    router
        .route(routingRoutes.put)
        .put(bodyParser, bodyValidation(schema.body.put), updateUser)

    router
        .route(routingRoutes.delete)
        .delete(paramParser(routingRoutes.delete), paramValidation(schema.param.delete), deleteUser)

    router
        .route(routingRoutes.getUsers)
        .get(paramParser(routingRoutes.getUsers), paramValidation(schema.param.getUsers), getUsers)

    router
        .route(routingRoutes.getByUsername)
        .get(paramParser(routingRoutes.getByUsername), paramValidation(schema.param.getUserByUsername), getUserByUsername)

    await router.exec(customErrorHandler)
}

const routingRoutes = {
    get: '/dataService/:id',
    post: '/dataService',
    put: '/dataService',
    delete: '/dataService/:id',
    getUsers: '/dataService/users/:parentID',
    getByUsername: '/dataService/user/:username'
}

module.exports = dataService
```

## Notes

- **Route Placeholders**: The `route` method supports placeholders (e.g., `:id`) and converts them to regex patterns for flexible routing.
- **Chaining**: Methods like `get`, `post`, `put`, `delete`, and `update` can be chained for a clean and readable routing setup.
- **Error Handling**: The `exec` method can accept an optional error handler function to manage errors gracefully.
- **Private Methods**: Private methods (`#execMethod`, `#setRegex`, `#end`) handle the internal workings of the routing logic, ensuring routes are matched and executed correctly.

By following these steps and methods, you can effectively manage and utilize the `Router` class for building scalable and robust APIs with Node.js.



# Middleware Functions

## bodyParser

**Function Overview**  
Middleware for parsing the body of a request. It parses incoming request data and attaches the parsed body to `request.body`.

### Parameters

- **`request`**: HTTP request object.
- **`response`**: HTTP response object.

### Usage Example

```javascript
const router = new Router(request, response);
router.route('/send').post(bodyParser, sendController);
// Other routing codes
```

### Implementation

```javascript
const CustomError = require("../../errors/CustomError");

/**
 * Middleware for parsing the body of a request.
 * @param {Request} request - HTTP request object.
 * @param {Response} response - HTTP response object.
 * @returns {Promise<object>} Parsed body object.
 */
const bodyParser = async (request, response) => {
    return new Promise((resolve, reject) => {
        let body = '';

        request.on('data', (chunk) => {
            body += chunk;
        });

        request.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                request.body = parsedBody;
                resolve(parsedBody);
            } catch (error) {
                resolve(undefined);
            }
        });

        request.on('error', (error) => {
            reject(new CustomError('Error parsing body data', 500));
        });
    });
};

module.exports = bodyParser;
```

---

## paramParser

**Function Overview**  
Middleware for extracting parameters from the request URL based on a specified path template. It attaches extracted parameters to `request.params`.

### Parameters

- **`path`**: Path template specifying parameter placeholders (e.g., `users/:id`).
- **`request`**: HTTP request object.
- **`response`**: HTTP response object.

### Usage Example

```javascript
const router = new Router(request, response);
router.route('users/:id').get(paramParser('users/:id'), ...controllers and middlewares);
// Other routing codes
```

### Implementation

```javascript
const CustomError = require("../../errors/CustomError");

/**
 * Middleware for extracting params from the request URL based on a given path template.
 * @param {String} path - Path template with parameter placeholders (e.g., 'users/:id').
 * @returns {Function} Middleware function.
 */
const paramParser = (path) => async (request, response) => {
    const placeholderPattern = /:(\w+)/g;
    const matches = [];
    let match;
    let matchesName = [];
    let params = [];

    while ((match = placeholderPattern.exec(path)) !== null) {
        matches.push(match[1]);
    }

    // Get positions of each match
    let paramsPos = matches.map(match => {
        const index = path.indexOf(match);
        const slashesBefore = path.slice(0, index).match(/\//g);
        const n = slashesBefore ? slashesBefore.length : 1;
        matchesName[n] = match;
        return n;
    });

    const extractedValues = paramsPos.map(position => {
        const parts = request.url.split('/');
        return parts[position];
    });

    paramsPos.forEach((match, index) => {
        params[matchesName[match]] = extractedValues[index];
    });

    request.params = params;
    return params;
};

module.exports = paramParser;
```

---

## bodyValidation

**Function Overview**  
Middleware for validating the request body based on a specified schema. It throws an error if any field in the body does not match the schema requirements.

### Parameters

- **`bodySchema`**: Object representing field validation rules.
- **`request`**: HTTP request object.
- **`response`**: HTTP response object.

### Usage Example

```javascript
const bodySchema = {
    id: {
        toMatch: /regex/,
        required: true
    },
    data: {
        toMatch: /regex/
    }
};

router.route('/users').post(bodyValidation(bodySchema), ...other middlewares and controller);
// Other routing codes
```

### Implementation

```javascript
const CustomError = require("../../errors/CustomError");

/**
 * Middleware for validating request body based on specified schema.
 * @param {object} bodySchema - Object representing field validation rules.
 * @returns {Function} Middleware function.
 */
const bodyValidation = (bodySchema) => async (request, response) => {
    if (Object.keys(bodySchema).length > 0) {
        validationBody(bodySchema, request.body);
    }
};

/**
 * Recursive function to validate nested objects in the request body.
 * @param {object} bodySchema - Object representing field validation rules.
 * @param {object} body - Request body object to validate.
 */
const validationBody = (bodySchema, body) => {
    if (body === undefined) {
        throw new CustomError(400, 'Body was not included');
    }

    Object.entries(bodySchema).forEach(([key, value]) => {
        if (Object.keys(value).length > 1) {
            validationBody(value, body[key]);
        } else if (Object.keys(value).length > 0) {
            if (!body[key] && value['required']) {
                throw new CustomError(400, `Include ${key} in body`);
            }

            if (!value['toMatch'].test(body[key]) && value['required']) {
                throw new CustomError(400, `The ${key} in body was not formatted correctly`);
            }
        }
    });
};

module.exports = bodyValidation;
```

---

## paramValidation

**Function Overview**  
Middleware for validating parameters in the request URL based on a specified schema. It throws an error if any parameter does not match the schema requirements.

### Parameters

- **`paramSchema`**: Object representing parameter validation rules.
- **`request`**: HTTP request object.
- **`response`**: HTTP response object.

### Usage Example

```javascript
const paramSchema = {
    id: {
        toMatch: /regex/,
        required: true
    }
};

router.route('somePath').get(..., paramValidation(paramSchema), ...);
// Other routing codes
```

### Implementation

```javascript
const CustomError = require("../../errors/CustomError");

/**
 * Middleware for validating parameters in the request URL based on specified schema.
 * @param {object} paramSchema - Object representing parameter validation rules.
 * @returns {Function} Middleware function.
 */
const paramValidation = (paramSchema) => async (request, response) => {
    const params = request.params;
    if (params === undefined && Object.keys(paramSchema).length !== 0) {
        throw new CustomError(400, 'Params were not included');
    }

    Object.entries(paramSchema).forEach(([key, value]) => {
        if (!params[key] && value['required']) {
            throw new CustomError(400, `Include ${key} in params`);
        }

        if (!value['toMatch'].test(params[key]) && value['required']) {
            throw new CustomError(400, `The ${key} in params was not formatted correctly`);
        }
    });
};

module.exports = paramValidation;
```

---

## customErrorHandler

**Function Overview**  
Custom error handler middleware for Router operations. Logs error stack traces and sends appropriate JSON responses with error messages and status codes.

### Parameters

- **`error`**: Error object to handle.
- **`response`**: HTTP response object.

### Usage Example

```javascript
const router = new Router(request, response);

// Other routing codes

router.exec(customErrorHandler);
```

### Implementation

```javascript
const CustomError = require("./CustomError");

/**
 * Custom error handler middleware for Router operations.
 * @param {Error} error - Error object to handle.
 * @param {Response} response - HTTP response object.
 */
const customErrorHandler = async (error, response) => {
    console.log(error.stack); // Log the error stack trace

    // Set response headers and handle different error scenarios
    response.setHeader('Content-Type', 'application/json');
    if (error instanceof CustomError) {
        response.statusCode = error.statusCode;
        response.end(JSON.stringify({ error: error.message }));
    } else if (error.message === 'Reached the max retries per request limit (which is 3). Refer to "maxRetriesPerRequest" option for details.') {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: 'Database connection error' }));
    } else {
        response.statusCode = 500;
        response.end(JSON.stringify({ error: 'Server error' }));
    }
};

module.exports = customErrorHandler;
```

---

## Notes

- Ensure middleware functions (`bodyParser`, `paramParser`, etc.) are appropriately used in conjunction with your Router class to handle request parsing, validation, and error handling seamlessly.
- Customize validation schemas (`bodySchema`, `paramSchema`) according to your application's specific requirements and data models.
- Adjust error handling in `customErrorHandler` as per your application's error types and logging preferences.

---

These middleware functions provide essential functionalities for enhancing the robustness and reliability of your Node.js API endpoints. Integrate them into your project to handle request data parsing, validation, and error management effectively.