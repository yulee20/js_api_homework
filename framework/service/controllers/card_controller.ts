import { Request } from "../../request"
import { Controller } from "./controller"
import { CookieJar } from "request"

export class Cards extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?: CookieJar, bearerToken?: string){
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async addCard(cardOptions: {
        boardID: string,
        listID: string,
        title: string,
        description: string,
        authorId: string,
        swimlaneId: string
    }
    ): Promise<{ _id: string }>  {
        // /api/boards/:boardId/lists/:listId/cards
        const resp = await new Request(`${this.BASE_URL}/api/boards/${cardOptions.boardID}/lists/${cardOptions.listID}/cards`)
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body(cardOptions)
            .send();
        return resp.body;
    }
    // /api/boards/:boardId/swimlanes/:swimlaneId/cards
    async getCardsBySwimlane(boardID: string, swimlaneID: string): Promise<{ 
        _id: string, 
        title: string,
        description: string,
        listId: string }[]> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/swimlanes/${swimlaneID}/cards`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    async getCardByID(boardID: string, listID: string, cardID: string){
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists/${listID}/cards/${cardID}`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }
    // /api/boards/:boardId/lists/:listId/cards/:cardId
    async deleteCard(boardID: string, listID: string, cardID: string): Promise<{ _id: string}> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists/${listID}/cards/${cardID}`)
            .method("DELETE")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    // /api/boards/:boardId/lists/:fromListId/cards/:cardId
    async updateCard(updateCardParams: {
        title: string,
        description: string
    },
        boardID: string, 
        listID: string, 
        cardID: string
    ): Promise<{ _id: string}> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists/${listID}/cards/${cardID}`)
            .method("PUT")
            .auth(this.bearerToken)
            .body(updateCardParams)
            .send();
        return resp.body;
    }
}