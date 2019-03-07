
# Getting set up

The easiest way to run the application locally for development
is to use Docker. This is especially highly recommended because
the local emulator for Firebase functions needs to run in Node 6, which is
quite old; the build tooling for the client-side application can happily run
in Node 10. With Docker, providing each service with the appropriate Node
version is quite painless.

If you don’t already have Docker, you can install it using [these instructions](https://docs.docker.com/install/). Look in the left sidebar for your OS; the instructions are a bit TL;DR.

Once Docker is installed, run this to bootstrap the containers:

```sh
$ docker-compose up --no-start
```

You will need to add your Firebase credentials to the local
project configuration. If you have not created a Firebase app to use for
development, [do that now](https://console.firebase.google.com/).

In your Firebase project, you will need to set up a few things:

* Enable Google authentication (navigate to **Authentication** &rarr; **Sign-in method** &rarr; **Google**)
* Create a Cloud Firestore database (navigate to **Database** and click **Create database** in the Cloud Firestore section); you can leave the permissions in **test mode**

Then run this and follow the prompts:

```sh
$ script/firebase-setup
```

Finally, you will need to set up an environment file containing various information and credentials. The file should be called `.env` and be located at the root of the project. The format is the familiar one for such files, with KEY=VALUE entries, one per line:

```sh
REACT_APP_MASTER_CURRICULUM_FOLDER_ID=1wEfbo0L404VKNFpiOtOyQvllfiTs7CnO
REACT_APP_BUGSNAG_API_KEY=14385c1ebd16bc84362e6ce4e3f14e92
```

Aside from the entries above, which you can use as-is, you will need the following:

* `REACT_APP_FIREBASE_API_KEY`: You can get this from the [Firebase console](https://console.firebase.google.com/), or by running `d/yarn.functions firebase setup:web`
* `REACT_APP_FIREBASE_PROJECT_ID` is the ID of the Firebase project you created earlier. You can find it by accessing **Project settings** from the gear icon in the project dashboard; note that you are looking for the **Project ID** not the project name.
* `REACT_APP_GOOGLE_CLIENT_ID` can be found at the [Google API Console](https://console.cloud.google.com/apis/credentials); there should be an entry under **OAuth 2.0 client IDs**, but if there isn’t, you can create one. Make sure that the client ID has `http://localhost:3000` in its **Authorized JavaScript origins**; if it doesn’t, you may need to create a new client ID and add that to the authorized origins when creating it.

To start the application for development, run this:

```sh
$ docker-compose up
```

This will start a live-reloading development server for the React frontend, served using [`create-react-app`](https://facebook.github.io/create-react-app/docs/getting-started) on http://localhost:3000 . It will also start a [Firebase functions emulator](https://firebase.google.com/docs/functions/local-emulator) on http://localhost:5000 .

# Deployment

The application is deployed to Firebase web hosting, using Travis CI to build and push the app. This all happens automatically any time code is merged into the `master` branch on GitHub.

The deployment process is configured in the `.travis.yml` file in the root of the project. Most deployment steps are run in Docker containers, minimizing the difference between the development environment and the build environment. Most environment variables used in production are configured in the project settings on travis-ci.com .

# Firebase Cloud Functions

The project contains scaffolding for [Firebase Cloud Functions](https://firebase.google.com/docs/functions/), including an emulator for local development, as well as deploying functions as part of the deployment process. However, the use case for Cloud Functions—integration with Slack—did not end up being part of the initial development of this app, so the current functions formation is merely a “hello world”. Doing anything useful with this will probably require some additional research; in particular, I am not sure how the (client-side) Firebase session is propagated to functions, particularly in an emulated scenario.
