# COMP 3111H Mobile App Project
*The Honors Club*



***NOTE:***

-   *Review the repository* ***tangoclinh1995/sample-ionic-project*** *to understand about the
    code structure*

-   *There are some files named* ***dummy** in some directories. They were created to help
    showcase the code structure. Just ignore it when doing development



# Set up the repository

-   Navigate into the directory of the repository (using **cd** command)

-   Run the following commands:
    
    ```
    npm install             # Install necessary NPM packages
    ionic state reset       # Install necessary ionic plugins, add Android & IOS platform
    ```



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