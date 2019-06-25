import * as faker from "faker";
import { Users } from "../../framework/service/controllers/user_controller";

import * as chai from "chai";
chai.use(require("chai-json-schema-ajv"));
const expect = chai.expect;

const userSchema = {
    title: "User JSON Schema",
    description: "User for Wekan board",
    type: "object",
    properties: {
        token: {
            type: "string"
        },
        tokenExpires: {
            type: "string"
        },
        id: {
            type: "string"
        }
    },
    required: ["id"]
}

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
        expect(resp).to.be.jsonSchema(userSchema);
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
        expect(userCreateResp).to.be.jsonSchema({
            type: "object",
            properties: {
                _id: {
                    type: "string"
                }
            }
        });
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

        let usrDetailsSchema = require('../../framework/raml/user.json')
        expect(usrDetails).to.be.jsonSchema(usrDetailsSchema);
        
        expect(usrDetails.authenticationMethod, JSON.stringify(usrDetails))
            .to.be.a("string")
            .that.equals("password");
    });
});
