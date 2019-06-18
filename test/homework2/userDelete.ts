import { Request } from "../../framework/request";
import * as faker from "faker";
import { expect } from "chai";

describe('User', function() {
    it('should be deleted successfully - return 200', async function(){
        // login as admin
        const adminLoginResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
        // console.log('admin id: ', adminLoginResp.body.id)
        // create new user
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        // console.log("email", email);
        const userCreateResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users"
        )
            .method("POST")
            .auth(adminLoginResp.body.token)
            .body({
                username: email,
                email: email,
                password: email
            })
            .send();
        // console.log("userId ", userCreateResp.body);
        const userId = userCreateResp.body._id;
        // console.log("userId: ", userId);
        const userDeleteResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${userId}`
        )
            .method("DELETE")
            .auth(adminLoginResp.body.token)
            .send();

        expect(userDeleteResp.statusCode).to.be.equal(200);
        const deletedUserDetails = userDeleteResp.body;
        expect(deletedUserDetails, JSON.stringify(deletedUserDetails))
            .to.be.an("object")
            .that.has.keys(
                "_id"
            )
        expect(deletedUserDetails._id, userDeleteResp).to.be.a("string").to.be.equal(userId);
    });

    it('will not be deleted if ID is not present - return 404', async function(){
        // login as admin
        const adminLoginResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
            
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
           
        const userCreateResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users"
        )
            .method("POST")
            .auth(adminLoginResp.body.token)
            .body({
                username: email, 
                email: email,
                password: email
            })
            .send();    
            
        const userId = userCreateResp.body._id;
        const userDeleteResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${userId}`
        )
            .method("DELETE")
            .auth(adminLoginResp.body.token)
            .send();
        console.log("first body ", userDeleteResp.body);
        
        const userDeleteAgain = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${userId}`
        )
            .method("DELETE")
            .auth(adminLoginResp.body.token)
            .send();
        console.log("second body ", userDeleteAgain.body);
        
        expect(userDeleteAgain.body).to.be.an("object").that.is.not.empty.that.is.to.be.equal(userId);
        // expect(userDeleteAgain.statusCode).to.be.equal(404);
    })
    
    it('will not be deleted without token - return 401', async function(){
        // login as admin
        const adminLoginResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
        
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        
        const userCreateResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users"
        )
            .method("POST")
            .auth(adminLoginResp.body.token)
            .body({
                username: email,
                email: email,
                password: email
            })
            .send();
        
        const userId = userCreateResp.body._id; 
        const userDeleteResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${userId}`
            )
            .method("DELETE")
            // .auth(adminLoginResp.body.token)
            .send();

        // console.log(userDeleteResp.body);
        expect(userDeleteResp.body).is.to.be.an('object')
            .that.has.keys("isClientSafe", "error", "reason", "message", "errorType", "statusCode");
        expect(userDeleteResp.body.statusCode).is.to.be.equal(401);
        expect(userCreateResp.body).is.to.be.an('object')
            .that.is.not.empty;
        expect(userCreateResp.body._id).is.to.be.a('string')
            .that.is.not.undefined;
    });
});