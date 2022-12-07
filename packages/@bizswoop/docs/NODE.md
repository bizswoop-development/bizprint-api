## Print Backend API docs

**Available functionality**

*   Job creation
*   possibility to retrieve either one or a list of jobs/stations/printers

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

```javascript
// note: these are sample keys, and they are not valid for use
const client = new PrintClient({
    publicKey: 'c321430d35c6d425799db9f85a11d50b',
    secretKey: '321430d35c6d425799db9f85a11d50b0'
});
```

**Returns**

The newly created object, which corresponds to this type.

**Possible errors**

*   UnauthorizedError - can be throws in case of a wrong publickKey or secretKey.

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

```javascript
const createJob = async () => {
    const job = await client.Jobs.create({
        printerId: 1,
        description: 'Test job',
        url: 'https://localhost:8000/order/35'
    });
};
```

**Returns**

The newly created object, which corresponds to this type.

**Possible errors**

*   JobCreatingInvalidRequestError - can be thrown due to the missing of some required parameters, or due to some parameters being invalid.
*   JobCreatingPrintJobLimitError - can be thrown out as a result of exceeding the print limit.
*   JobCreatingInvalidPrinterError - can be thrown due to trying to create a job on printer that doesn't exist or that you don't have access to.

---

### Retrieve a Job

Retrieves a job with a given ID.

**Parameters**

*   id
    *   type: number
    *   required: true

```javascript
const getSingleJob = async () => {
    const job = await client.Jobs.retrieve(1);
};
```

**Returns**

Returns an object, which corresponds to this type.

**Possible errors**

*   NotFoundError - trying to retrieve a job that doesn't exist.
*   AccessForbiddenError - you are not authorized to access this job.

---

### List Jobs

Return a list of jobs.

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

We can get our list in two ways:

*   either await for jobs to return

```javascript
const getListOfJobs = await () => {
    const jobs = await client.Jobs.list({ perPage: 10, page: 3 });
};
```

*   or by using an async iterator

```javascript
const getListOfJobs = await () => {
    let allJobs = [];
    for await (let jobs of client.Jobs.list()) {
        allJobs = allJobs.concat(jobs.data);
    }
};
```

**Returns**

Returns an object with following properties:

*   data - contains a list of jobs.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   JobsListInvalidRequestError - occurs when wrong parameter gets passed.

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

**Parameters**

*   id
    *   type: number
    *   required: true

```javascript
const getSingleStation = async () => {
    const station = await client.Stations.retrieve(1);
};
```

**Returns**

Returns an object, which corresponds to this type.

**Possible errors**

*   NotFoundError - trying to retrieve a station that doesn't exist.
*   AccessForbiddenError - you are not authorized to access this station.

---

### List Stations

Return a list of stations.

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

We can get our list in two ways:

*   either await for stations to return

```javascript
const getListOfStations = await () => {
    const stations = await client.Stations.list({ perPage: 1 });
};
```

*   or by using an async iterator

```javascript
const getListOfStations = await () => {
    let allStations = [];
    for await (const stations of client.Stations.list()) {
        allStations = allStations.concat(stations.data);
    }
};
```

**Returns**

Returns an object with following properties:

*   data - contains a list of stations.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   StationsListInvalidRequestError - occurs when wrong parameter gets passed.

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

**Parameters**

*   id
    *   type: number
    *   required: true

```javascript
const getSinglePrinter = async () => {
    const printer = await client.Printers.retrieve(1);
};
```

**Returns**

Returns an object, which corresponds to this type.

**Possible errors**

*   NotFoundError - trying to retrieve a printer that doesn't exist.
*   AccessForbiddenError - you are not authorized to access this printer.

---

### List Printers

Return a list of printers.

**Query Parameters**

*   perPage
    *   type: number
    *   required: false
*   page
    *   type: number
    *   required: false

We can get our list in two ways:

*   either await for printers to return

```javascript
const getListOfPrinters = await () => {
    const printers = await client.Printers.list();
};
```

*   or by using an async iterator

```javascript
const getListOfPrinters = await () => {
    let allPrinters = [];
    for await (const printers of client.Printers.list()) {
        allPrinters = allPrinters.concat(printers.data);
    }
};
```

**Returns**

Returns an object with following properties:

*   data - contains a list of printers.
*   hasMore - boolean.
*   totalAll - number.
*   totalPages - number.

**Possible errors**

*   PrintersListInvalidRequestError - occurs when wrong parameter gets passed.

---

### General errors

Errors that may occur for any api request.

*   AccessForbiddenError - you don't have access to make this request.
*   SomethingWrongError - something went wrong.
*   UnauthorizedError - you are not authorized to make this request.
*   NotFoundError - there is no such request.