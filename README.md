# sapia-server

**TL;DR:**

This is a demo project for authentication API backed by NodeJs/ExpressJs/MongoDB/Docker

## Run the service with Docker

After cloning the project, enter the directory and start the service by running below command

```
docker compose up -d
```

The service is now up and listening on port 3000, and you can check the status of the server and database in Docker by below command

```
docker ps
```

## Signup, signin and retrieve data

### ENDPOINTS

Only the following end points can be accessed, otherwise, an error of 404 will be returned.

```
POST /user/signup
POST /user/signin
GET /user/:username
GET /
```

### GET /

`'Sapia Demo Project'`will be returned when send GET request to /, and no authentication is needed.

### POST /users/signup

when sending POST request to /users/signup with a json data `{username, password}`, the user will be registered and the response of the registration will be returned. This call will return an error if username or password is missing. An error will also be returned if the username already exists.

##### Request data:

**username**: _required_, the name of the user

**password**: _required_, the password of the user

---

##### Returns:

**username:** the name of the user

**signup:** result of signing up

---

##### Errors:

**HTTP response status code (400)**: invalid username/password

**HTTP response status code (409)**: user already exists

_Example Request:_

```
 curl -i -X POST 127.0.0.1:3000/users/signup -H "Content-Type: application/json" -d '{"username":"test", "password": "123"}'
```

_Example Response:_

```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 39
ETag: W/"27-Vd3W+dJLNhw9pZ1y8aNTYFe5mrA"
Date: Thu, 30 Jun 2022 12:42:41 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"username":"test","signup":"success"}
```

### POST /users/signin

when sending POST request to /users/signin with a json data `{username, password}`, a token will be returned if the user is able to login successfully. A user has a maximum of 3 attempts within 5 minutes, otherwise, the user will be locked. An error will be returned if the locked user want to sign in again. However, the user is allowed to retry after 1 hour.

##### Request data:

**username**: _required_,the username of the user

**password**: _required_,the password of the user

---

##### Returns:

**username:** the name of the user

**token:** a token for authentication

---

##### Errors:

**HTTP response status code (400)**: invalid username/password

**HTTP response status code (422)**: {username} not exist

**HTTP response status code (401)**: incorrect password

**HTTP response status code (401)**: blocked

_Example Request:_

```
curl -i -X POST 127.0.0.1:3000/users/signin -H "Content-Type: application/json" -d '{"username":"test", "password": "123"}'
```

_Example Response:_

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 182
ETag: W/"b6-t8kaWkNlmQtkdUbC6bFHZyn0gbc"
Date: Thu, 30 Jun 2022 13:02:07 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"username":"test","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NTY1OTQxMjcsImV4cCI6MTY1NjU5NzcyN30.PSfCvvTui1bhUYaw8VRnTfxlgXIb1Mp6KuDs99j1eQQ"}
```

### Get /users/:username

When sending GET request to /users/:username with valid token, the username and time when the user registed will be returned.

This call will return an error if no valid token is provided in the headers of the request.

##### Request headers:

**Authorization:** _required_, a valid token returned by the server before.

---

##### Returns:

**username:** the name of the user

**createdAt:** the time when user signed up (UTC time)

---

##### Errors:

**HTTP response status code (401)**: invalid token

**HTTP response status code (401)**: unauthorized access

_Example request:_

```
curl -iv 127.0.0.1:3000/users/test -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NTY1OTQxMjcsImV4cCI6MTY1NjU5NzcyN30.PSfCvvTui1bhUYaw8VRnTfxlgXIb1Mp6KuDs99j1eQQ"
```

_Example Response:_

```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 58
ETag: W/"3a-+aifIpnU1aEWc+DsImVICpiELCg"
Date: Thu, 30 Jun 2022 13:04:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"username":"test","createdAt":"2022-06-30T09:01:12.832Z"}
```

## How to test the project

The Jest, Supertest and MongoDB In-Memory Server are used for unit tests and integration tests. Before testing, setting the environment variables for specifying the correct version of mongodb binary needed for MongoDB In-Memory Server. The default behavior is that version `5.0.8` for your OS will be downloaded.

```
export MONGOMS_DOWNLOAD_URL=https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-5.0.0.tgz
export MONGOMS_VERSION=5.0.0
```

After cloning the repo , use `npm install` to install the dependencies. Run below command to test the project

```
npm run test
```

## Try the demo project hosted by Heroku and MongoDB Altas

The demo project can also be visited via https://lower-pylon-13345.herokuapp.com/.
