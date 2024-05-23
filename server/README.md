# Create Mongo Express

[![npm version](https://badge.fury.io/js/create-mongo-express.svg)](https://badge.fury.io/js/create-mongo-express)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Create Mongo Express is a simple and powerful **_CLI_** tool that automates the setup of an Express.js application with MongoDB connection. With this tool, you can quickly generate a fully configured Express.js project, complete with `file` based preconfigured routes and seamless integration with MongoDB.

## Installation

To install the package, make sure you have Node.js and npm installed on your machine. Then, run the following command:

```bash
npx create-mongo-express project-name
```

<!-- ## Getting Started

You will be prompted to enter the project name. Provide a suitable name for your Express server:

```bash
Enter the project name (e.g., express-server):
``` -->

Next, you will be asked to provide the MongoDB URI.

```bash
Enter the MongoDB URI:
```

Ensure that your MongoDB URI is in the following format:

```bash
mongodb+srv://mongoDbUser:mongoDbUserPass@cluster0.s938843o0.mongodb.net/databaseName?retryWrites=true&w=majority
```

## Running the Server

After the setup is complete, navigate to the project folder:

```bash
cd project-name
```

Next, start the server by running the following command:

```bash
npm run dev
```

Your server will run on port 3500 by default.

If you wish to change the port, you can modify the `server.js` file located in the root folder.

## Creating a New Route

To create a new route in the api folder, follow these steps:

Inside the project folder, locate the **api** folder. This is where you can add your custom routes.

Create a new file with a descriptive name for your route. For example, if you want to create a route for managing products, you can create a file named `products.js` inside the **api** folder.

Open the newly created file and add the necessary code to define your route. Here's an example:

```javascript
const express = require('express');
const router = express.Router();
const Customer = require('../model/Customer');

// GET /api/customers
router.get('/', (req, res) => {
  res.send('This is the /customers route');
});

// GET /api/customers/:id
router.get('/:id', (req, res) => {
  console.log(req.params.id);
  res.send(`This is the /customers/${req.params.id} route`);
});

// POST /api/customers
router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;

  if (!email || !first_name || !last_name || !phone) {
    return res
      .status(400)
      .json({ message: 'Please fill out all the required fields' });
  }

  try {
    const duplicateCustomer = await Customer.findOne({ email }).exec();

    if (duplicateCustomer) {
      return res.status(409).json({
        message: `Another user with email ${email} already exists, login instead`,
      });
    }

    // Create and store new user
    const result = await Customer.create({
      first_name,
      last_name,
      email,
      phone,
    });

    return res.status(200).json({
      message: 'User created successfully',
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      phone: result.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

## Route exports

Make sure all your routes are exported properly like below, otherwise your it would show a 404 page.

```javascript
const express = require('express');
const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  res.send('This is the /products route');
});

module.exports = router;
```

Customize the route logic according to your requirements. You can retrieve data from the database, create new records, update existing records, or delete records based on the HTTP methods and route paths you define.

Save the file.

Your new route is now available in the Express server. You can access it using the route path you defined. For example, if you created a `products.js` route as shown above, you can access the route endpoints at `/api/products`, `/api/products/:id`, etc.

That's it! You have successfully created a new route in the api folder. Feel free to add more routes and customize them as per your application's needs.

## Mongoose models

You can add your own mongoose models in the model folder at the root level. Here's an example:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
});

module.exports = mongoose.model('Customer', customerSchema);
```
