## HTTP Print Backend API docs

---

### General request info:

When making **GET** or **DELETE** request, along the way we are passing next query parameters:

*   publicKey
*   time
*   hash

We are getting hash and time from next function:

```javascript
const hashData = (queryArgs, secretKey) => {
    return createHash('sha256').update(`${queryArgs.toString()}:${secretKey}`).digest('hex');
};

export const signGetData = (queryArgs, publicKey, secretKey) => {
    queryArgs = new URLSearchParams(queryArgs);
    const time = `${Math.floor(Date.now() / 1000)}`;

    queryArgs.set('publicKey', publicKey);
    queryArgs.set('time', time);

    const hash = hashData(queryArgs.toString(), secretKey);
    queryArgs.set('hash', hash);

    return queryArgs;
};
```

When making **PATCH**, **POST** or **PUT** request, along the way we are adding next body properties:

*   publicKey
*   time
*   hash

And it is also required to pass along in Header:

*   key: Content-Type
*   value: application/json

We are getting hash and time from next function:

```javascript
const hashData = (data, secretKey) => {
    const json = JSON.stringify(data);

    return createHash('sha256').update(`${json}:${secretKey}`).digest('hex');
};

export const signPostData = (data, publicKey, secretKey) => {
    const time = Math.floor(Date.now() / 1000);

    const dataToSign = {
        ...data,
        publicKey,
        time
    };
    const hash = hashData(dataToSign, secretKey);
    return { ...dataToSign, hash };
};
```

---

### Job object

**Properties**

*   id – number
*   description – string
*   status – ‘pending’ | ‘processing’ | ‘done’ | ‘failed’ | ‘connecting-to-printer’ | ‘archived’
*   url – string
*   printerId – number
*   createdAt – string
*   updatedAt – string

---

### Creating a job

Creates a job for a printer with passed parameters.

**HTTP Request**

```plaintext
POST https://print.bizswoop.app/api/connect-application/v1/jobs
```

**JSON Body**

An object with following properties: 

*   printerId
    *   type: number
    *   required: true
*   url
    *   type: string
    *   required: true
*   description:
    *   type: string
    *   required: true
*   printOption:
    *   type: object | string(JSON)
    *   required: false

**Returns**

Returns JSON object with following properties:

*   data – an object, which corresponds to this type.

**Possible errors**

ERR\_INVALID\_REQUEST:

*   status code: 400
*   response:
    *   errorCode: ‘ERR\_INVALID\_REQUEST’
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what field is incorrect and why. Example:

```javascript
{
	"errorCode": 'ERR_INVALID_REQUEST',
    "message": "Invalid request fields: url, description",
    "errors": {
        "url": ["Url must be a valid URL"],
        "description":["Description is a required field"]
    }
}
```

ERR\_JOB\_CREATING\_PRINT\_JOB\_LIMIT:

*   status code: 400
*   response:
    *   errorCode: ‘ERR\_JOB\_CREATING\_PRINT\_JOB\_LIMIT’
    *   message: ‘Reached print limit’

ERR\_JOB\_CREATING\_INVALID\_PRINTER\_ID:

*   status code: 403
*   response:
    *   errorCode: ‘ERR\_JOB\_CREATING\_INVALID\_PRINTER\_ID’
    *   message: ‘Invalid printer ID’

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’ 
    *   message: ‘Something wrong’

---

### Retrieve a Job

Retrieves a job with a given ID.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/jobs/${ID}
```

**Parameters**

*   id
    *   type: number
    *   required: true

**Returns**

Returns JSON object with following properties:

*   data – an object, which corresponds to this type.

**Possible errors**

ERR\_ACCESS\_FORBIDDEN:

*   status code: 403
*   response:
    *   errorCode: ‘ERR\_ACCESS\_FORBIDDEN’
    *   message: ‘You are not authorized to access this job’

ERR\_NOT\_FOUND:

*   status code: 404
*   response:
    *   errorCode: ‘ERR\_NOT\_FOUND’
    *   message: ‘Job not found’

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### List Jobs

Return a list of jobs.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/jobs?perPage=10&page=3
```

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

**Returns**

Returns JSON object with following properties:

*   data – contains a list of jobs.

In header we are passing as well next properties:

*   X-Biz-Has-More –  boolean value whether we have more jobs to return.
*   X-Biz-Total-All – total number of jobs that we have.
*   X-Biz-Total-Pages – total number of pages.

**Possible errors**

ERR\_INVALID\_REQUEST:

*   status code: 400
*   response:
    *   errorCode: ‘ERR\_INVALID\_REQUEST’
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why. Example:

```javascript
{
    "errorCode": "ERR_INVALID_REQUEST",
    "message": "Invalid request fields: page, perPage",
    "errors": {
        "page": ["Page must be greater than or equal to 1"],
        "perPage":["Per Page must be less than or equal to 100"]
    }
}
```

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### Station object

**Properties**

*   id – number
*   name – string
*   createdAt – string
*   updatedAt – string

---

### Retrieve a Station

Retrieves a station with a given ID.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/stations/${ID}
```

**Parameters**

*   id
    *   type: number
    *   required: true

**Returns**

Returns JSON object with following properties:

*   data – an object, which corresponds to this type.

**Possible errors**

ERR\_ACCESS\_FORBIDDEN:

*   status code: 403
*   response:
    *   errorCode: ‘ERR\_ACCESS\_FORBIDDEN’
    *   message: ‘You are not authorized to access this printer’

ERR\_NOT\_FOUND:

*   status code: 404
*   response:
    *   errorCode: ‘ERR\_NOT\_FOUND’
    *   message: ‘Station not found’

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### List Stations

Return a list of stations.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/stations?perPage=1
```

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

**Returns**

Returns JSON object with following properties:

*   data – contains a list of stations.

In header we are passing as well next properties:

*   X-Biz-Has-More –  boolean value whether we have more stations to return.
*   X-Biz-Total-All – total number of stations that we have.
*   X-Biz-Total-Pages – total number of pages.

**Possible errors**

ERR\_INVALID\_REQUEST:

*   status code: 400
*   response:
    *   errorCode: ‘ERR\_INVALID\_REQUEST’
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why. Example:

```javascript
{
    "errorCode": "ERR_INVALID_REQUEST",
    "message": "Invalid request fields: page",
    "errors": {
        "page": ["Must be a number"]
    }
}
```

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### Printer object

**Properties**

*   id – number
*   name – string
*   key – string
*   status – ‘online’ | ‘offline’
*   station – object
    *   id – number
    *   name – string
*   createdAt – string
*   updatedAt – string

---

### Retrieve a Printer

Retrieves a printer with a given ID.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/printers/${ID}
```

**Parameters**

*   id
    *   type: number
    *   required: true

**Returns**

Returns JSON object with following properties:

*   data – an object, which corresponds to this type.

**Possible errors**

ERR\_ACCESS\_FORBIDDEN:

*   status code: 403
*   response:
    *   errorCode: ‘ERR\_ACCESS\_FORBIDDEN’
    *   message: ‘You are not authorized to access this printer’

ERR\_NOT\_FOUND:

*   status code: 404
*   response:
    *   errorCode: ‘ERR\_NOT\_FOUND’
    *   message: ‘Printer not found’

ERR\_SOMETHING\_WRONG:

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### List Printers

Return a list of printers.

**HTTP Request**

```plaintext
GET https://print.bizswoop.app/api/connect-application/v1/printers?perPage=5&page=1
```

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

**Returns**

Returns JSON object with following properties:

*   data – contains a list of printers.

In header we are passing as well next properties:

*   X-Biz-Has-More –  boolean value whether we have more printers to return.
*   X-Biz-Total-All – total number of printers that we have.
*   X-Biz-Total-Pages – total number of pages.

**Possible errors**

ERR\_INVALID\_REQUEST

*   status code: 400
*   response:
    *   errorCode: ‘ERR\_INVALID\_REQUEST’
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why. Example:

```javascript
{
    "errorCode": "ERR_INVALID_REQUEST",
    "message": "Invalid request fields: perPage",
    "errors": {
        "perPage": ["Must be a number"]
    }
}
```

ERR\_SOMETHING\_WRONG :

*   status code: 500
*   response:
    *   errorCode: ‘ERR\_SOMETHING\_WRONG’
    *   message: ‘Something wrong’

---

### General errors

Typical structure of any error response will be like following:

```javascript
interface BaseErrorResponse {
	errorCode: string;
	message: string;
}
```

Errors codes that might occur for any request:

*   ERR\_ACCESS\_FORBIDDEN – appears when you don't have access to make a specific request.
    *   status code: 403
*   ERR\_SOMETHING\_WRONG – means that something went wrong.
    *   status code: 500
*   ERR\_UNAUTHORIZED – appears when you are not authorized to make a specific request.
    *   status code: 401
*   ERR\_NOT\_FOUND – appears when there is no such request.
    *   status code: 404