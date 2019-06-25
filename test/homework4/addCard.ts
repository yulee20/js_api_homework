import { Users } from "../../framework/service/controllers/user_controller";
import { Boards } from "../../framework/service/controllers/board_controller";
import { Lists } from "../../framework/service/controllers/list_controller";
import { Cards } from "../../framework/service/controllers/card_controller";
import { Swimlanes } from "../../framework/service/controllers/swimlane_controller";

import * as chai from "chai";
chai.use(require("chai-json-schema-ajv"));
const expect = chai.expect;

let createdBoard;
let createdSwimlane;
let createdList;

describe("Card ", function(){
    before(async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        try{   
            createdBoard = await new Boards(undefined, undefined, adminLoginResp.token)
                .createBoard({
                    title: "NEW board for cards", 
                    owner: adminLoginResp.id, 
                    color: "pumpkin",
                    permission: "private"
                });
        } catch{
            throw new Error("NEW board is not created!");
        }     
        try{
            createdSwimlane = await new Swimlanes(undefined, undefined, adminLoginResp.token)
                .addSwimlane("NEW swimlane", createdBoard._id);
        } catch{
            throw new Error("NEW swimlane is not created!");
        }
        try{
            createdList = await new Lists(undefined, undefined, adminLoginResp.token)
                .addList("NEW list", createdBoard._id);
        }catch{
            throw new Error("NEW list is not created!");
        }     
    });
    
    it("new card should be added", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add card
        const resp = await new Cards(undefined, undefined, adminLoginResp.token)
            .addCard({
                boardID: createdBoard._id,
                listID: createdList._id,
                title: "NEW card",
                description: "It's a new card",
                authorId: adminLoginResp.id,
                swimlaneId: createdSwimlane._id
            });
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("object")
            .that.has.key("_id");
        expect(resp._id, JSON.stringify(resp)).to.be.a("string").that.is.not.empty;
    })

    it("all cards by Swimlane should be received", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        const resp = await new Cards(undefined, undefined, adminLoginResp.token)
            .getCardsBySwimlane(createdBoard._id, createdSwimlane._id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("Array").that.is.not.empty;     
        for(let value of resp){
            expect(value).to.have.keys("_id", "title", "description", "listId");
            expect(value._id).to.be.a("string").that.is.not.empty;
            expect(value.title).to.be.a("string").that.is.not.empty;
            expect(value.description).to.be.a("string").that.is.not.empty;
            expect(value.listId).to.be.a("string").that.is.not.empty;
        }
            
    })
    
    it("get card by ID", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add card
        const newCard = await new Cards(undefined, undefined, adminLoginResp.token)
            .addCard({
                boardID: createdBoard._id,
                listID: createdList._id,
                title: "Next NEW card",
                description: "It's a new card",
                authorId: adminLoginResp.id,
                swimlaneId: createdSwimlane._id
            });
        const resp = await new Cards(undefined, undefined, adminLoginResp.token)
            .getCardByID(createdBoard._id, createdList._id, newCard._id);
        console.log(resp)
        let usrDetailsSchema = require('../../framework/raml/card.json')
    })

    it("card should be deleted", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add card
        const newCard = await new Cards(undefined, undefined, adminLoginResp.token)
            .addCard({
                boardID: createdBoard._id,
                listID: createdList._id,
                title: "NEW card to be deleted",
                description: "It's a new card",
                authorId: adminLoginResp.id,
                swimlaneId: createdSwimlane._id
            });
        // delete card
        const resp = await new Cards(undefined, undefined, adminLoginResp.token)
            .deleteCard(createdBoard._id, createdList._id, newCard._id);
        console.log(resp)
        expect(resp).to.has.key("_id");
        expect(resp._id).to.be.a("string").that.is.not.empty;
    })

    it("card should be updated", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // add card
        const newCard = await new Cards(undefined, undefined, adminLoginResp.token)
            .addCard({
                boardID: createdBoard._id,
                listID: createdList._id,
                title: "NEW card to be updated",
                description: "It's a new card",
                authorId: adminLoginResp.id,
                swimlaneId: createdSwimlane._id
            });
        // update card
        const resp = await new Cards(undefined, undefined, adminLoginResp.token)
            .updateCard(
                { 
                    title: "new title", 
                    description: "new description" 
                }, createdBoard._id, createdList._id, newCard._id);
        console.log(resp)
        expect(resp).to.has.key("_id");
        expect(resp._id).to.be.a("string").that.is.not.empty;
    })
})