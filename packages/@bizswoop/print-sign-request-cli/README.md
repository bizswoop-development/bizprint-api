# @bizswoop/print-sign-request-cli

Interactive CLI to sign and validate requests to the BizPrint Print Backend API.

- Signs GET query strings and POST JSON payloads with your keys
- Checks the signature of an existing request and shows the expected hash
- Runs on **Node.js ≥ 20.19**; uses the signing functions of [`@bizswoop/print-client`](https://www.npmjs.com/package/@bizswoop/print-client)

Useful for trying the [HTTP API](https://github.com/bizswoop-development/bizprint-api/blob/master/docs/HTTP.md) by hand and for debugging signature errors.

## Install

Run without installing:

```sh
npx @bizswoop/print-sign-request-cli
```

Or install globally:

```sh
npm install -g @bizswoop/print-sign-request-cli
print-sign-request-cli
```

## Quick start

To get your public and secret keys, see the [quick start guide](https://getbizprint.com/quick-start-guide/#step-4).

```
$ npx @bizswoop/print-sign-request-cli
? What do you want to do? Make a get request
? Public key <publicKey>
? Secret key <secretKey>
? Enter Request URL or query string perPage=10&page=1
? Update time? Yes
perPage=10&page=1&publicKey=<publicKey>&time=<time>&hash=<hash>
```

## Actions

| Action                  | Asks for                                          | Prints              |
| ----------------------- | ------------------------------------------------- | ------------------- |
| Make a get request      | Public key, secret key, URL or query string, time | Signed query string |
| Make a post request     | Public key, secret key, time, JSON payload        | Signed JSON payload |
| Validate a get request  | Secret key, URL or query string                   | Validation result   |
| Validate a post request | Secret key, JSON payload                          | Validation result   |

JSON payloads are entered in your default editor (`$VISUAL` / `$EDITOR`).

### Make a get request

Takes a full request URL or only its query string. `publicKey` and `hash` in it are replaced. Prints the signed query string, to append to the request URL.

### Make a post request

Takes a JSON payload. `publicKey` is set and `hash` is replaced. Prints the signed payload as one line of JSON (formatted here):

```json
{
	"printerId": 1,
	"description": "Order #1001",
	"url": "https://shop.example/order/1001",
	"publicKey": "<publicKey>",
	"time": 1700000000,
	"hash": "<hash>"
}
```

### Update time?

Both "make" actions ask it. `Yes` (default) sets `time` to the current Unix timestamp in seconds. `No` keeps the `time` of the request, and adds the current one only if it is missing.

### Validate a get request / Validate a post request

Takes a signed request and prints one of:

| Output                                          | When                                      |
| ----------------------------------------------- | ----------------------------------------- |
| `Valid`                                         | The hash matches.                         |
| `Invalid, missing arguments: ...`               | `time`, `publicKey` or `hash` is missing. |
| `Invalid (hash mismatch), expected ... got ...` | The hash does not match the secret key.   |

Only the hash is checked; `time` is not compared with the current time.

## License

[MIT](./LICENSE)
