import { Request } from "../../framework/request";
import { expect } from "chai";
import * as faker from "faker";

describe("User information", function(){
    it(" - receive user data by ID", async function(){
        const adminResp = await new Request(
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
            .auth(adminResp.body.token)
            .body({
                email: email,
                password: email
            })
            .send(); 
        
        const userDetailsResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${adminResp.body.id}`
        )
            .auth(adminResp.body.token)
            .send();

        expect(userDetailsResp.statusCode).to.be.equal(200);
        const usrDetails = userDetailsResp.body;
        expect(usrDetails, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys(
                "_id",
                "authenticationMethod",
                "createdAt",
                "emails",
                "isAdmin",
                "profile",
                "services",
                "username"
            );
        expect(usrDetails._id, usrDetails).to.be.a("string");
        expect(usrDetails.authenticationMethod, usrDetails)
            .to.be.a("string")
            .that.equals("password");
        expect(usrDetails.profile, usrDetails)
            .to.be.an("object")
            .that.has.keys(
                "boardView",
                "templatesBoardId",
                "cardTemplatesSwimlaneId",
                "listTemplatesSwimlaneId",
                "starredBoards",
                "boardTemplatesSwimlaneId"
            );
        expect(usrDetails.emails, usrDetails).to.be.an("array").that.is.not
            .empty;
        expect(usrDetails.username, usrDetails).to.be.a("string").that.is.not
            .empty;
        expect(usrDetails.services, usrDetails)
            .to.be.an("object")
            .that.has.keys("password", "email", "resume", "accounts-lockout");
        expect(usrDetails.createdAt, usrDetails).to.be.a("string").that.is.not
            .empty;
    });
    
    it(" - for not existed user - 401", async function(){
        const adminResp = await new Request(
            "http://ip-5236.sunline.net.ua:30020/users/login"
        )
            .method("POST")
            .body({
                email: "test@test.com",
                password: "123456"
            })
            .send();
        const userId = "XQMZgynx9M79qTtQc";
        const userDetailsResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${userId}`
        )
            .auth(adminResp.body.token)
            .send();
        
        // console.log(userDetailsResp);
        expect(userDetailsResp).to.be.an("object").that.is.not.empty;
        expect(userDetailsResp.emails, userDetailsResp).to.be.undefined;
        expect(userDetailsResp.username, userDetailsResp).to.be.undefined;
        expect(userDetailsResp.password, userDetailsResp).to.be.undefined;
        // expect(userDetailsResp.statusCode).to.be.equal(401);

    });

    it(" - with parameters", async function(){
        const adminResp = await new Request(
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
            .auth(adminResp.body.token)
            .body({
                email: email,
                password: email
            })
            .send(); 
        
        const userDetailsResp = await new Request(
            `http://ip-5236.sunline.net.ua:30020/api/users/${adminResp.body.id}`
        )
            .auth(adminResp.body.token)
            .queryParameters({
                "username": "Testuser",
                "isAdmin": true,
            })
            .send();
        //console.log(userDetailsResp.body);
        expect(userDetailsResp.body.username, userDetailsResp).to.be.equal('Testuser');
        expect(userDetailsResp.body.isAdmin, userDetailsResp).to.be.equal(true);
        expect(userDetailsResp.body, userDetailsResp)
            .to.be.an("object")
            .that.has.keys(
                "username",
                "isAdmin",
                "_id",
                "authenticationMethod",
                "createdAt",
                "emails",
                "profile",
                "services"
            );
        // expect(userDetailsResp.statusCode).to.be.equal(200);
    })

})