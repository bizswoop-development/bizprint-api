## Print Backend API docs

**Available functionality**

*   Job creation
*   possibility to retrieve either one or a list of jobs/stations/printers

---

### General request info:

For requests that contain JSON body it is required to pass along in Header:

*   key: Content-Type
*   value: application/json

When making **GET** or **DELETE** request, along the way we are passing next query parameters:

*   publicKey
*   time
*   hash

We are getting hash and time from next function:

```javascript
const signGetData = (queryArgs: QueryArgs, secretKey): URLSearchParams => {
    queryArgs = new URLSearchParams(queryArgs);
    const time = `${Math.floor(Date.now() / 1000)}`;
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

We are getting hash and time from next function:

```javascript
export const signPostData = <T>(data: T, secretKey: string): T & { time: number; hash: string } => {
    const time = Math.floor(Date.now() / 1000);

    const dataWithTime = {
        ...data,
        time
    };
    const hash = hashData(dataWithTime, secretKey);
    return { ...dataWithTime, hash } as T & { time: number; hash: string };
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
    *   type: object
    *   required: false

**Returns**

Returns JSON object with following properties:

*   data – an object, which corresponds to this type.

**Possible errors**

*   ERR\_INVALID\_REQUEST
    *   status: 400
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what field is incorrect and why.
*   ERR\_JOB\_CREATING\_PRINT\_JOB\_LIMIT
    *   status: 400
    *   message: ‘Reached print limit’
*   ERR\_JOB\_CREATING\_INVALID\_PRINTER\_ID
    *   status: 403
    *   message: ‘Invalid printer ID’
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_ACCESS\_FORBIDDEN
    *   status: 403
    *   message: ‘You are not authorized to access this job’
*   ERR\_NOT\_FOUND
    *   status: 404
    *   message: ‘Job not found’
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_INVALID\_REQUEST
    *   status: 400
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why.
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_ACCESS\_FORBIDDEN
    *   status: 403
    *   message: ‘You are not authorized to access this printer’
*   ERR\_NOT\_FOUND
    *   status: 404
    *   message: ‘Station not found’
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_INVALID\_REQUEST
    *   status: 400
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why.
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_ACCESS\_FORBIDDEN
    *   status: 403
    *   message: ‘You are not authorized to access this printer’
*   ERR\_NOT\_FOUND
    *   status: 404
    *   message: ‘Printer not found’
*   ERR\_SOMETHING\_WRONG
    *   status: 500
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

*   ERR\_INVALID\_REQUEST
    *   status: 400
    *   message: ‘Invalid request fields: ${a list of invalid fields}’
    *   errors: In this errors object you will see what fields are incorrect and why.
*   ERR\_SOMETHING\_WRONG
    *   status: 500
    *   message: ‘Something wrong’