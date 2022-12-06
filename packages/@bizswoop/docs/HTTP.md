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

We are getting hash and time from following function:

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

We are getting hash and time from following function:

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

### PrintClient object

**Properties**

*   Jobs - interface to access job
*   Printers - interface to access printer
*   Stations - interface to access station

---

### Creating an instance of PrintClient

Creates a new print client object with which you can manipulate and work with different Stations, Printers and Jobs instances.

Note: for instruction of how to get publicKey and secretKey, please visit next url: https://getbizprint.com/quick-start-guide/#step-4

**JSON Body**

*   publicKey
    *   type: string
    *   required: true
*   secretKey
    *   type: string
    *   required: true
*   baseUrl
    *   type: \`${'http' | 'https'}://${string}/api/connect-application/v1/\`
    *   default: ‘https://print.bizswoop.app/api/connect-application/v1/’
    *   required: false

**Returns**

The newly created object, which corresponds to this type.

**Possible errors**

*   ERR\_UNAUTHORIZED - can be throws in case of a wrong publickKey or secretKey.

---

### Jobs object

**Properties**

*   id - number
*   description - string
*   status - ‘pending’ | ‘processing’ | ‘done’ | ‘failed’ | ‘connecting-to-printer’ | ‘archived’
*   url - string
*   printerId - number
*   createdAt - string
*   updatedAt - string

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

The newly created object, which corresponds to this type.

**Possible errors**

*   ERR\_INVALID\_REQUEST - can be thrown due to the missing of some required parameters, or due to the url being invalid.
*   ERR\_JOB\_CREATING\_PRINT\_JOB\_LIMIT - can be thrown out as a result of exceeding the print limit.
*   ERR\_JOB\_CREATING\_INVALID\_PRINTER\_ID - can be thrown due to trying to create a job on printer that doesn't exist or that you don't have access to.

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

Returns an object, which corresponds to this type.

**Possible errors**

*   ERR\_NOT\_FOUND - trying to retrieve a job that doesn't exist.
*   ERR\_ACCESS\_FORBIDDEN - you are not authorized to access this job.

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

Returns an object with following properties:

*   data - contains a list of jobs.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   ERR\_INVALID\_REQUEST - occurs when wrong parameter gets passed.

---

### Stations object

**Properties**

*   id - number
*   name - string
*   createdAt - string
*   updatedAt - string

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

Returns an object, which corresponds to this type.

**Possible errors**

*   ERR\_NOT\_FOUND - trying to retrieve a station that doesn't exist.
*   ERR\_ACCESS\_FORBIDDEN - you are not authorized to access this station.

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

Returns an object with following properties:

*   data - contains a list of stations.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   ERR\_INVALID\_REQUEST - occurs when wrong parameter gets passed.

---

### Printers object

**Properties**

*   id - number
*   name - string
*   key - string
*   status - ‘online’ | ‘offline’
*   station - object
    *   id - number
    *   name - string
*   createdAt - string
*   updatedAt - string

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

Returns an object, which corresponds to this type.

**Possible errors**

*   ERR\_NOT\_FOUND - trying to retrieve a printer that doesn't exist.
*   ERR\_ACCESS\_FORBIDDEN - you are not authorized to access this printer.

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

Returns an object with following properties:

*   data - contains a list of printers.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   ERR\_INVALID\_REQUEST - occurs when wrong parameter gets passed.

---

### General errors

Errors that may occur for any api request.

*   ERR\_ACCESS\_FORBIDDEN - you don't have access to make this request.
*   ERR\_SOMETHING\_WRONG - something went wrong.
*   ERR\_UNAUTHORIZED - you are not authorized to make this request.
*   ERR\_NOT\_FOUND - there is no such request.