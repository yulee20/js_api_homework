import { expect } from "chai";
import { Users } from "../../framework/service/controllers/user_controller";
import { Boards } from "../../framework/service/controllers/board_controller";

describe("Board ", function(){
    it("new board should be created", async function(){
        // admin login
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        // create new board
        const resp = await new Boards(undefined, undefined, adminLoginResp.token).createBoard({
            title: "lyy board", 
            owner: adminLoginResp.id, 
            color: "pumpkin",
            permission: "private"
        });
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("object")
            .that.has.keys("_id", "defaultSwimlaneId");
        expect(resp._id, JSON.stringify(resp)).to.be.a("string").that.is.not.empty;
        expect(resp.defaultSwimlaneId, JSON.stringify(resp)).to.be.a("string").that.is.not.empty;
    })

    it("User boards list should be received", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        const resp = await new Boards(undefined, undefined, adminLoginResp.token).getBoardsList(adminLoginResp.id);
        console.log(resp)
        expect(resp, JSON.stringify(resp)).to.be.an("Array").that.is.not.empty;     
        for(let value of resp){
            expect(value).to.have.keys("_id", "title");
            expect(value._id).to.be.a("string").that.is.not.empty;
            expect(value.title).to.be.a("string").that.is.not.empty;
        } 
    })

    it.only("get board by ID", async function(){
        const adminLoginResp = await new Users().loginUser(
            "test@test.com",
            "123456"
        )
        const newBoard = await new Boards(undefined, undefined, adminLoginResp.token).createBoard({
            title: "test board", 
            owner: adminLoginResp.id, 
            color: "midnight",
            permission: "private"
        });

        const resp = await new Boards(undefined, undefined, adminLoginResp.token).getBoardByID(newBoard._id);
        console.log(resp);
        expect(resp).to.include.keys("_id", "title");
        expect(resp._id).to.be.a("string").that.is.not.empty;
        expect(resp.title).to.be.a("string").that.is.not.empty;
    })

})