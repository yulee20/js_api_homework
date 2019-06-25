import { Request } from "../../request"
import { Controller } from "./controller"
import { CookieJar } from "request"

export class Lists extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?: CookieJar, bearerToken?: string){
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async addList(
        title: string,
        boardID: string
    ): Promise<{ _id: string }>  {
        // /api/boards/:boardId/lists
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists`)
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body({
                title: title
            })
            .send();
        return resp.body;
    }

    async getLists(boardID: string): Promise<{ _id: string, title: string }[]> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    async getListByID(boardID: string, listID: string){
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists/${listID}`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    async deleteList(boardID: string, listID: string): Promise<{ _id: string}> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/lists/${listID}`)
            .method("DELETE")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }
}