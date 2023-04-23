# Boat Management Application

This is a simple web application that allows you to manage boats. The application consists of a frontend developed using Angular 15 and a RESTful API developed using .NET Core 6. The application uses JWT Bearer Tokens to authenticate users.

## Requirements

To run this application, you will need:

- An SQL server with a user that can create databases or you can create it manually and create a user with the proper rights to manage the database.
- [Visual Studio](https://visualstudio.microsoft.com/) is preferable to use for managing user secrets.
- [Node.js](https://nodejs.org/) version 18 or later installed on your system.
- [Angular CLI](https://angular.io/cli) installed on your system.

## BoatAppApi

To set up the API, follow these steps:

1. Use the secrets.json file to set up the connection string.
2. Right-click on the project from your Visual Studio and select "Manage user secrets".
3. Add the proper configuration to the secrets.json file:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "secret"
  }
}
```

4. Run the project.

## BoatAppUI

To run the frontend, follow these steps:

1. Open a terminal or command prompt in the project directory.
2. Run the following command to install the required dependencies:

```bash
npm install
```

3. Run the following command to start the Angular application:

```bash
ng serve -o
```

4. This will open the application in your default browser.

## Default User Credentials

The default user credentials for this application are:

- **Username**: admin@boatapp.com
- **Password**: P@ssw0rd!

If you encounter any issues or errors during the setup or running of the application, please refer to the following resources:

- The [Angular documentation](https://angular.io/docs)
- The [.NET Core documentation](https://docs.microsoft.com/en-us/dotnet/core/)
- The [Node.js documentation](https://nodejs.org/en/docs/)