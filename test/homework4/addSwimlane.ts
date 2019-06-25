import { Users } from "../../framework/service/controllers/user_controller";
import { Boards } from "../../framework/service/controllers/board_controller";
import { Swimlanes } from "../../framework/service/controllers/swimlane_controller";

import * as chai from "chai";
chai.use(require("chai-json-schema-ajv"));
const expect = chai.expect;

const swimlaneSchema = {
    type: "object",
    properties: {
        _id: {
            type: "string"
        },
        title: {
            type: "string"
        },
        boardId: {
            type: "string"
        },
        archived: {
            type: "boolean",
            default: false
        },
        createdAt: {
            type: "string"
        },
        type: {
            type: "string",
            default: "swimlane"
        },
        sort: {
            type: "number",
            default: 0
        },
        updatedAt: {
            type: "string"
        }
    },
    additionalProperties: false,
    required: ["_id", "title", "boardId"]
};

let createdBoard;

describe("Swimlane ", function(){
    before(async function(){
        try{
            const adminLoginResp = await new Users().loginUser(
                "test@test.com",
                "123456"
            )
            createdBoard = await new Boards(undefined, undefined, adminLoginResp.token).createBoard({
                title: "NEW board", 
                owner: adminLoginResp.id, 
                color: "nephritis",
                permission: "private"
            });
        } catch{
            throw new Error("NEW board is not created!");
        }     
    });
    
    it("new swimlane should be added", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add swimlane
        const resp = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .addSwimlane("NEW swimlane", createdBoard._id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("object")
            .that.has.key("_id");
        expect(resp._id, JSON.stringify(resp)).to.be.a("string").that.is.not.empty;
    })

    it("swimlanes list should be received", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        const resp = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .getSwimlanesList(createdBoard._id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("Array").that.is.not.empty;     
        for(let value of resp){
            expect(value).to.have.keys("_id", "title");
            expect(value._id).to.be.a("string").that.is.not.empty;
            expect(value.title).to.be.a("string").that.is.not.empty;
        }
    })

    it("get swimlane by ID", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add swimlane
        const newSwimlane = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .addSwimlane("Next swimlane", createdBoard._id);
        const resp = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .getSwimlaneByID(createdBoard._id, newSwimlane._id);
        console.log(resp)
        expect(resp).to.be.jsonSchema(swimlaneSchema);
    })

    it("swimlane should be deleted", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add swimlane
        const newSwimlane = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .addSwimlane("Delete swimlane", createdBoard._id);
        // delete swimlane
        const resp = await new Swimlanes(undefined, undefined, adminLoginResp.token)
            .deleteSwimlane(createdBoard._id, newSwimlane._id);
        console.log(resp)
        expect(resp).to.has.key("_id");
        expect(resp._id).to.be.a("string").that.is.not.empty;
    })
})