import { Request } from "../../framework/request";
import { expect } from "chai";
// import * as faker from "faker";

describe ("User list", function(){
    it(" should be received", async function(){
        const adminLogin = await new Request(
            "http://localhost:38021/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "Lfdbl2011"
            })
            .send();
        
        const userListResp = await new Request(
            "http://localhost:38021/api/users/"
        )
            .auth(adminLogin.body.token)
            .send();
        
        expect(userListResp.body).is.not.empty;
        for(let value of userListResp.body){       
            expect(value).to.have.keys("_id", "username");
            expect(value._id).to.be.a("string").that.is.not.empty;
            expect(value.username).to.be.a("string").that.is.not.empty;
            // console.log(userListResp.body)
        }
        
    });

    it(" should be received -- with query parameters", async function(){
        const adminLogin = await new Request(
            "http://localhost:38021/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "Lfdbl2011"
            })
            .send();
        
        const userListResp = await new Request(
            "http://localhost:38021/api/users/"
        )
            .auth(adminLogin.body.token)
            .queryParameters({
                username: 'test@test.com'
            })
            .send();
        // console.log(userListResp.body[0].username);
        for(let value of userListResp.body){
            // expect(value.username, userListResp).to.be.a("string").to.be.equal('test@test.com');
            expect(value, userListResp)
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
        }
    });
        
    it(" should not be received without token", async function(){
        const userListResp = await new Request(
            "http://localhost:38021/api/users/"
        )
            // .auth(adminLogin.body.token)
            .send();
        console.log(userListResp)
        
        expect(userListResp.body).is.to.be.an('object')
            .that.has.keys("isClientSafe", "error", "reason", "message", "errorType", "statusCode");
        expect(userListResp.body.statusCode).is.to.be.equal(401);
        expect(userListResp.body).is.not.empty;
    });
})
