import { Request } from "../../framework/request";
import { expect } from "chai";
import * as faker from "faker"

describe ("User ", function(){
    it(" logged in info", async function(){
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );
        const userRegister = await new Request(
            "http://localhost:38021/users/register"
        )
            .method("POST")
            .body({
                username: faker.internet.userName(),
                email: email,
                password: email
            })
            .send();
        // console.log(userRegister.body)
        const userLoginResp = await new Request(
            "http://localhost:38021/users/login"
        )
            .method("POST")
            .body({
                email: email,
                password: email
            })
            .send();
        // console.log(userLoginResp.body)
        const userDetailsResp = await new Request(
            "http://localhost:38021/api/user"
        )
            .auth(userLoginResp.body.token)
            .send();
        // console.log(userDetailsResp.body)
        const usrDetails = userDetailsResp.body;
        expect(usrDetails, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys(
                "_id",
                "createdAt",
                "emails",
                "profile",
                "username",
                "authenticationMethod"
            );

        // console.log("USER", usrDetails);
        expect(usrDetails._id, usrDetails).to.be.a("string");
        expect(usrDetails.authenticationMethod, usrDetails).to.be.a("string").that.is.equal("password");
        expect(usrDetails.profile, usrDetails)
            .to.be.an("object");
        expect(usrDetails.emails, usrDetails).to.be.an("array").that.is.not
            .empty;
        expect(usrDetails.username, usrDetails).to.be.a("string").that.is.not
            .empty;
        expect(usrDetails.createdAt, usrDetails).to.be.a("string").that.is.not
            .empty;
    })

    it(" not logged in - info", async function(){
        const userDetailsResp = await new Request(
            "http://localhost:38021/api/user"
        )
            // .auth(userLoginResp.body.token)
            .send();

        expect(userDetailsResp.body).is.to.be.an('object')
            .that.has.keys("isClientSafe", "error", "reason", "message", "errorType", "statusCode");
        expect(userDetailsResp.body.statusCode).is.to.be.equal(401);
        expect(userDetailsResp.body).is.to.be.an('object')
            .that.is.not.empty;
        expect(userDetailsResp.body._id).to.be.undefined;
    })

})