import * as requestPromise from "request-promise-native";
import * as fs from "fs";
let request = requestPromise.defaults({
    json: true
})

// get/post
// async function run() {
//     // let body = await request.get('https://httpbin.org/headers');
//     let body = await request.post('https://httpbin.org/post', {
//         json: true,
//         body: {
//             "Hello": "World"
//         }
//     });
//     console.log(body);
// }
// run();

// headers
// async function run() {
//     let resp = await request.get('https://httpbin.org/headers', {
//         json: true,
//         headers: {
//             test: "test",
//             test2: "test2"
//         }
//     });
//     console.log("Response", resp);
// }
// run();

// cookies
// async function run() {
//     let cookieJar = request.jar();
//     let requestWithCookies = request.defaults({
//         jar: cookieJar
//     });
//     let loginResp = await requestWithCookies.get('https://httpbin.org/cookies/set', {
//         qs: {
//             testCookie1: "first",
//             testCookie12: "second"
//         }
//     })
//     // console.log("cookie", cookieJar);
//     // console.log("login", loginResp);

//     let currentUser = await requestWithCookies.get('https://httpbin.org/cookies');
//     console.log(currentUser);
// }
// run();

//qs
// async function run(){
//     let resp = await request.get('https://httpbin.org/anything', {
//         qs: {
//             test3: "test3"
//         }
//     });
//     console.log("Response", resp);
// }
// run();

//authentification
// async function run() {
//     // login as admin
//     let loginResp = await request.post(
//         "http://ip-5236.sunline.net.ua:30020/users/login",
//         {
//             json: true,
//             body: {
//                 email: "test@test.com",
//                 password: "123456"
//             }
//         }
//     );
//     console.log(loginResp.headers);

//     let currentUser = await request.get(
//         "http://ip-5236.sunline.net.ua:30020/api/user",
//         {
//             // resolveWithFullResponse: true,
//             json: true,
//             auth: {
//                 bearer: loginResp.token
//             }
//         }
//     );
//         console.log(currentUser);
//     // console.log(currentUser.body, currentUser.headers, currentUser.statusCode);
// }
// run();

it("file upload and download", async function() {
    const formData = {
        my_file: fs.createReadStream(__dirname + "/cat.png")
    };
    let resp = await request.post("https://httpbin.org/anything", {
        formData: formData,
        json: false
    });
    fs.createWriteStream(__dirname + `/cat_new.txt`).write(resp);
    let parsed = JSON.parse(resp);
    var base64Data = parsed.files.my_file.replace(
        /^data:image\/png;base64,/,
        ""
    );
    fs.writeFile(__dirname + "/out.png", base64Data, "base64", () => {});
});