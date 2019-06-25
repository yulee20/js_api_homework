// import { Request } from "../../framework/request";
import * as faker from "faker";
import { expect } from "chai";
import { Users } from "../../framework/service/controllers/user_controller";

describe("User", function () {
    it("self register should be successful", async function () {
        // Generating random email
        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );

        // Register
        const resp = await new Users().registerUser(email, email);

        expect(resp, JSON.stringify(resp))
            .to.be.an("object")
            .that.has.all.keys("token", "tokenExpires", "id");
            expect(resp.token, JSON.stringify(resp)).to.be.a("string").that.is.not
            .empty;
        expect(resp.tokenExpires, JSON.stringify(resp)).to.be.a("string").that
            .is.not.empty;
        expect(resp.id, JSON.stringify(resp)).to.be.a("string").that.is.not
            .empty;
    });

    it("creating new user should be successful", async function () {
        // login as admin
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )

        const email = faker.internet.email(
            undefined,
            undefined,
            "ip-5236.sunline.net.ua"
        );

        const adminUserController = new Users(
            undefined,
            undefined,
            adminLoginResp.token
        )

        const userCreateResp = await adminUserController.createUser(
            email,
            email,
            faker.internet.userName()
        )
        expect(userCreateResp, JSON.stringify(userCreateResp))
            .to.be.an("object")
            .that.has.key("_id");
        expect(typeof userCreateResp._id, JSON.stringify(userCreateResp)).to.equal(
            "string"
        );
    });

    it("receiving information about user by id should be successful", async function () {
        this.timeout(5000)
        // login as admin
        const unloggedinUsersController = new Users()
        const loginAdmin = await unloggedinUsersController.loginUser(
            "test@test.com",
            "123456"
        );
        const adminUsersController = new Users(
            undefined,
            undefined,
            loginAdmin.token
        );

        const usrDetails = await adminUsersController.getUserDetailsById(
            loginAdmin.id
        );
        
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

        // console.log("USER", usrDetails);
        expect(usrDetails._id, JSON.stringify(usrDetails)).to.be.a("string");
        expect(usrDetails.authenticationMethod, JSON.stringify(usrDetails))
            .to.be.a("string")
            .that.equals("password");
        expect(usrDetails.profile, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.has.keys(
                "boardView",
                "templatesBoardId",
                "cardTemplatesSwimlaneId",
                "listTemplatesSwimlaneId",
                "boardTemplatesSwimlaneId",
                "starredBoards"
            );
        expect(usrDetails.emails, JSON.stringify(usrDetails)).to.be.an("array").that.is.not
            .empty;
        expect(usrDetails.username, JSON.stringify(usrDetails)).to.be.a("string").that.is.not
            .empty;
        expect(usrDetails.services, JSON.stringify(usrDetails))
            .to.be.an("object")
            .that.include.keys("password", "email", "resume");
        expect(usrDetails.createdAt, JSON.stringify(usrDetails)).to.be.a("string").that.is.not
            .empty;
    });
});
