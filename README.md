# COMP 3111H Mobile App Project
*The Honors Club*



***NOTE:***

-   *Review the repository* ***[tangoclinh1995/sample-ionic-project](https://github.com/tangoclinh1995/sample-ionic-project)***
    *to understand about the code structure*

-   *There are some files named* ***dummy** *in some directories. They were created to help*
    *showcase the code structure. Just ignore it when doing development*



# Set up the repository

-   Navigate into the directory of the repository (using **cd** command)

-   Run the following commands:
    
    ```
    npm install             # Install necessary NPM packages
    ionic state reset       # Install necessary ionic plugins, add Android & IOS platform
    ```

-   Create a file named **firebase_init.js** in the **www** directory with the following content:

    ```
      firebase.initializeApp({
        apiKey: <YOUR_API_KEY>,
        authDomain: <YOUR_AUTH_DOMAIN>,
        databaseURL: <YOUR_DATABASE_URL>,
        storageBucket: <YOUR_STORAGE_BUCKET>,
        messagingSenderId: <YOUR_MESSAGE_SENDER_ID>
      });      
    ```

    For more information about what parameters should be used here, please visit
    team's **Slack** channel.

    ***NOTE**: This file is **ignored** by Git, so you need to create it by yourself. The purpose of*
    *this is to protect Firebase authentication information and speed up development time (as each*
    *developer can experiment their code differently on their OWN database)*  



# Start the developing process

-   Navigate into the directory of the repository (using **cd** command)

-   Run **Gulp Watch**:   

    ```
    ./node_modules/.bin/gulp watch     # Watch for files change and automatically rebuild the project
    ```

-   Open **Ionic live reload** in a terminal different from the one running Gulp Watch:

    ```
    ionic serve
    ```



# Run unit tests & Generate Coverage report

-   Navigate into the directory of the repository (using **cd** command)

-   Run Karma:

    ```
    karma start
    ```



# Write a Firebase-related unit test 

-   Create a new Firebase database **separated from this project's main Firebase database**.
    This database is going to be used for **TESTING PURPOSE ONLY**

-   Take a look at the file **unit_testing/firebase_test.js** in the sample project
    **[tangoclinh1995/sample-ionic-project](https://github.com/tangoclinh1995/sample-ionic-project)**
    for better understanding of the testing procedure.

