# ~ The project repo ~
## Test Users
All of the following test accounts have firstLogin set to true in seedTestDB.js.
You will encounter the "Secure Your Account" page on each accounts first login.  
if you dont want to deal with that for every account, you can go in and change the value of "firstLogin" to false for each user account in seedTestDB.js.

### Admin One
Username: admin1  
Password: password123  
Role: admin  

### Editor One
Username: editor1  
Password: password123  
Role: content editor  

### Manager One
Username: manager1
Password: password123  
Role: marketing manager  

### Viewer One
Username: viewer1  
Password: password123  
Role: viewer

## How to use seedTestDB.js
1. run npm install to get the node modules
2. make sure mongosh is successfully running on the default port: 27017
3. run ```node seedTestDB.js```
