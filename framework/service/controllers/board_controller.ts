import { Request } from "../../request"
import { Controller } from "./controller"
import { CookieJar } from "request"

export class Boards extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?: CookieJar, bearerToken?: string){
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async createBoard(boardOptions: {
        title: string,
        owner: string,
        color: string,
        permission: string
    }): Promise<{ _id: string, defaultSwimlaneId: string}>  {
        const resp = await new Request(`${this.BASE_URL}/api/boards`)
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body(boardOptions)
            .send();
            console.log(resp.body)
        return resp.body;
    }

    // http://localhost:3000/api/users/XQMZgynx9M79qTtQc/boards
    async getBoardsList(userId: string): Promise<{ _id: string, title: string}[]> {
        const resp = await new Request(`${this.BASE_URL}/api/users/${userId}/boards`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    // b/ztiTPEhDBb5NNrJ6x/lyy-board
    async getBoardByID(boardID: string): Promise<{ _id: string, title: string }> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }
}