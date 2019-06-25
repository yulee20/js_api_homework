import { Users } from "../../framework/service/controllers/user_controller";
import { Boards } from "../../framework/service/controllers/board_controller";
import { Lists } from "../../framework/service/controllers/list_controller";

import * as chai from "chai";
chai.use(require("chai-json-schema-ajv"));
const expect = chai.expect;

const listSchema = {
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
        sort: {
            type: "number",
            default: 1
        },
        archived: {
            type: "boolean",
            default: false
        },
        swimlaneId: {
            type: "string"
        },
        createdAt: {
            type: "string"
        },
        wipLimit: {
            type: "object",
            properties: {
                value: {
                    type: "number",
                    default: 1
                },
                enabled: {
                    type: "boolean",
                    default: false
                },
                sort: {
                    type: "boolean",
                    default: false
                }
            }
        },
        type: {
            type: "string",
            default: "list"
        }        
    },
    additionalProperties: false,
    required: ["_id", "title", "boardId"]
};

let createdBoard;

describe("List ", function(){
    before(async function(){
        try{
            const adminLoginResp = await new Users().loginUser(
                "test@test.com",
                "123456"
            )
            createdBoard = await new Boards(undefined, undefined, adminLoginResp.token).createBoard({
                title: "NEW board for lists", 
                owner: adminLoginResp.id, 
                color: "wisteria",
                permission: "private"
            });
        } catch{
            throw new Error("NEW board is not created!");
        }     
    });
    
    it("new list should be added", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add list
        const resp = await new Lists(undefined, undefined, adminLoginResp.token)
            .addList("NEW list", createdBoard._id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("object")
            .that.has.key("_id");
        expect(resp._id, JSON.stringify(resp)).to.be.a("string").that.is.not.empty;
    })

    it("all lists should be received", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        const resp = await new Lists(undefined, undefined, adminLoginResp.token)
            .getLists(createdBoard._id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("Array").that.is.not.empty;     
        for(let value of resp){
            expect(value).to.have.keys("_id", "title");
            expect(value._id).to.be.a("string").that.is.not.empty;
            expect(value.title).to.be.a("string").that.is.not.empty;
        }
            
    })

    it("get list by ID", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add list
        const newList = await new Lists(undefined, undefined, adminLoginResp.token)
            .addList("NEW list", createdBoard._id);
        const resp = await new Lists(undefined, undefined, adminLoginResp.token)
            .getListByID(createdBoard._id, newList._id);
        console.log(resp)
        expect(resp).to.be.jsonSchema(listSchema);
    })

    it("list should be deleted", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add list
        const newList = await new Lists(undefined, undefined, adminLoginResp.token)
            .addList("NEW list", createdBoard._id);
        // delete list
        const resp = await new Lists(undefined, undefined, adminLoginResp.token)
            .deleteList(createdBoard._id, newList._id);
        console.log(resp)
        expect(resp).to.has.key("_id");
        expect(resp._id).to.be.a("string").that.is.not.empty;
    })
})