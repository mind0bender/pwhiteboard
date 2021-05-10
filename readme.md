# pWhiteboard - collaboration made easy!

Hi! I'm your Markdown file in **pWhiteboard**. If you want to learn about pWhiteboard, you can read me. If you want to play with it, visit [**pWhiteboard**](https://pwhiteboard.herokuapp.com). Once you have finished with me, you can start a **local server** on your own device.

# Installation

You will require [**nodejs**](https://nodejs.org) for this project.

In Terminal, type

    git clone https://github.com/Mind0Bender/pwhiteboard.git

or, you can download the [**zip file**](https://github.com/Mind0Bender/pwhiteboard/archive/refs/heads/main.zip) and extract it.

After cloning, go to the **pwhiteboard** directory

    cd pwhiteboard

Install the required packages by executing

    npm install

After the installation, you need to make some changes in **public/sketch.js**

Open the file in a code Editor. I will be using VS code.
you can use any editor of your choice.

    code public/sketch.js

You need to find this line in the file.

    socket = io.connect("https://pwhiteboard.herokuapp.com/");

and replace it with

    socket = io.connect("http://localhost:8080");

You can change 8080 with any local PORT you want.

> Note : If you will change the PORT to anything else, then you will need to add environment variable PORT. See **[Changing PORT](#changing-port)** section to learn More.

Now you just need to **[Start the SERVER](#starting-the-server)**.

## Starting the server

Now that you have done the installation part successfully, you can start a local server hosting the pWhiteboard.

Open Terminal in the pwhiteboard directory.

Now run

    npm start

to start a local server.

That's it.

## Changing PORT

You might remember that i told you that you can change 8080 with any local PORT you want.

But for that you need to follow an extra step.

Don't worry its very simple :D

Lets say you don't wanna run it on

    localhost:8080

instead you want it on

    localhost:3000

To do that go to the pwhiteboard directory.
There you will find a **.env** file.

Yep that will help you in this.

Open that file and set the **PORT** variable to the port you want it to run on.

For Example

    PORT=3000

> Note: PORT must be in upper flat case

In this case it will be hosted on **localhost:3000**

Now save it and [start your Server](#starting-the-server).

It should be hosted on the port you set in the .env file.

## Found any Bug or Typo?

Feel free to [Create new Issue](https://github.com/Mind0Bender/pwhiteboard/issues).

## Want to contribute?

**Just do it.**
Create a better version of the project and submit it by [Creating a Pull Request](https://github.com/Mind0Bender/pwhiteboard/pulls).
