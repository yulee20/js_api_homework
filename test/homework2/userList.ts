import { Request } from "../../framework/request";
import { expect } from "chai";
// import * as faker from "faker";

describe ("User list", function(){
    it(" should be received", async function(){
        const adminLogin = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
        
        const userListResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users/"
        )
            .auth(adminLogin.body.token)
            .send();
        console.log(userListResp.body)
        
        expect(userListResp.body).is.not.empty;
        // for(let value of userListResp.body){  //I think we need cycle here, right?      
            expect(userListResp.body).to.have.keys("_id", "username");
            expect(userListResp.body._id).to.be.a("string").that.is.not.empty;
            expect(userListResp.body.username).to.be.a("string").that.is.not.empty;
        // }
        
    });

    it(" should be received -- with query parameters", async function(){
        const adminLogin = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
        
        const userListResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users/"
        )
            .auth(adminLogin.body.token)
            .queryParameters({
                "isAdmin": false
            })
            .send();
        //console.log(userDetailsResp.body);
        expect(userListResp.body.isAdmin, userListResp).to.be.equal(false);
        expect(userListResp.body, userListResp)
            .to.be.an("object")
            .that.include.any.keys(
                "username",
                "isAdmin",
                "_id",
                "authenticationMethod",
                "createdAt",
                "emails",
                "profile",
                "services"
            );
    });
        
    it(" should not be received without token", async function(){
        // const adminLogin = await new Request(
        //     "http://ip-5236.sunline.net.ua:30020/users/login"
        // )
        //     .method("POST")
        //     .body({
        //         email: "test@test.com",
        //         password: "123456"
        //     })
        //     .send();
        
        const userListResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/api/users/"
        )
            // .auth(adminLogin.body.token)
            .send();
        console.log(userListResp.body)
        
        expect(userListResp.body).is.to.be.an('object')
            .that.has.keys("isClientSafe", "error", "reason", "message", "errorType", "statusCode");
        expect(userListResp.body.statusCode).is.to.be.equal(401);
        expect(userListResp.body).is.not.empty;
        expect(userListResp.body._id).is.to.be.a('string')
            .that.is.not.undefined;
    });
})
