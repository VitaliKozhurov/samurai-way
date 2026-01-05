const http = require("http");
const fs = require("fs");
const PORT = 5000;

const wait = (ms) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

const readFilePromisify = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const server = http.createServer(async (request, response) => {
  switch (request.url) {
    // BAD EXAMPLE block main thread
    // case "/home": {
    //   const start = new Date();

    //   while (new Date() - start < 5000) {
    //     console.log(`Delay: ${new Date() - start}`);
    //   }

    //   const data = "Data after long synchronous operation";

    //   response.write(data);
    //   response.end();
    //   break;
    // }

    // Example with timeout
    // case "/home": {
    //   setTimeout(() => {
    //     const data = "Data after timeout operation";

    //     response.write(data);
    //     response.end();
    //   }, 5000);

    //   break;
    // }

    // Bad approach with sync operation
    // case "/home": {
    //   const data = fs.readFileSync("./pages/home.html");
    //   response.write(data);
    //   break;
    // }

    // case "/about": {
    //   const data = fs.readFileSync("./pages/about.html");
    //   response.write(data);
    //   break;
    // }

    // Example with callback approach
    // case "/home": {
    //   fs.readFile("./pages/home.html", (err, data) => {
    //     if (err) {
    //       response.write("Some error occurred");
    //     } else {
    //       response.write(data);
    //     }
    //     response.end();
    //   });

    //   break;
    // }

    // case "/about": {
    //   fs.readFile("./pages/about.html", (err, data) => {
    //     if (err) {
    //       response.write("Some error occurred");
    //     } else {
    //       response.write(data);
    //     }
    //     response.end();
    //   });

    //   break;
    // }

    case "/home": {
      try {
        const data = await readFilePromisify("./pages/home.html");
        response.write(data);
      } catch (error) {
        response.write("Something went wrong");
      }

      response.end();

      break;
    }

    default: {
      response.write("404 not found");
      response.end();
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});
