# Kintone Chrome Extension Sample

It's a chrome extension that posts to Sean's Environment.

This uses:
 - Svelte
 - Tailwind CSS
 - Flowbite components
 - Language Locales

It sends your user message to a AWS Lambda, which then handles posting to the Kintone Database for you.
The Lambda is configured to only allow POST requests from this extension.
(Note: HTTP request origins **can** be spoofed. Consider more security for valuable information!)
The Lambda handles the database POST request, so your Kintone API keys are safe somewhere else.

## Install Steps

1. Clone the repo.
2. Run `npm install`
3. Run `npm run build` to build the extension.
4. Open up [Chrome Extension settings](chrome://extensions)
5. Enable Developer Mode in the Top Right
6. Click on **Load Unpacked** to load the extension.
7. Load the **public** folder that gets created when you build.
8. You should see a new extension installed!


## Resources

| File worth looking at                          | Description                                    |
| ---------------------------------------------- | ---------------------------------------------- |
| [/src](/src/)                                  | Src Folder containing all Code                 |
| [App.svelte](/src/App.svelte)                  | Main App content                               |
| [/src/components](/src/components/)            | An example component for use in Svelte         |
| [background.ts](/src/background/background.ts) | Tells Chrome to open the extension as a pop-up |
| [/src/_locales](/src/_locales/)                | Language Locales for the Extension live here   |
| [manifest.json](/src/manifest.json)            | Extension settings etc for the browser         |

Editing this example is simple as creating your own HTTP request endpoint / AWS Lambda for the fetch request to point to, and handling your own backend logic. We hope this helps!

For reference, our Lambda looks something like this:

```js
export const handler = async (event, context, callback) => {
    /* global fetch */
    const eventBody = await JSON.parse(event.body);
    console.log('event body')
    console.log(eventBody)
    var userMessage = eventBody.userMessage
    console.log("Message Received: ");
    console.log(userMessage)
    var operation;
    var origin;

    try {
        operation = event.httpMethod;
        origin = event.headers.origin;
    } catch (e) {
        console.log("ERROR")
        console.log(e)
    }

    var url = 'https://MY_SUBDOMAIN.kintone.com/k/v1/record.json';
    var apiToken = 'MY_API_TOKEN';
    let postToKintone = async () => {
        var requestBody = {
            'app': 102,
            'record': {
                'message': {
                    'value': userMessage
                }
            }
        }
        const options = {
            method: 'POST',
            headers: {
                'X-Cybozu-API-Token': apiToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        }
        const response = await fetch(url, options);
        const jsonResponse = await response.json();
        console.log(jsonResponse);
    }
    var response = false;
    if (operation == 'POST') {
      // Chrome Extension's ID
        if (origin == 'chrome-extension://mfpaoagdcefejdnlkdolplfaolibmial') {
            console.log("valid POST request from extension");
            let kintoneResponse = await postToKintone();
        }
        response = {
            statusCode: 200,
            body: '{"status":"Success", "origin":"' + origin + '", "message":"None"}',
        };
    }
    else {
        response = {
            statusCode: 404,
            body: '{"status":"Operation Failed @ ' + operation + '", "origin":"' + origin + '"}',
        };
    }
    return response;
};
```