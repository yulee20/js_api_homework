import { Request } from "../../request"
import { Controller } from "./controller"
import { CookieJar } from "request"

export class Swimlanes extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?: CookieJar, bearerToken?: string){
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async addSwimlane(
        title: string,
        boardID: string
    ): Promise<{ _id: string, defaultSwimlaneId: string}>  {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/swimlanes`)
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body({
                title: title
            })
            .send();
        return resp.body;
    }

    async getSwimlanesList(boardID: string): Promise<{ _id: string, title: string }[]> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/swimlanes`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    async getSwimlaneByID(boardID: string, swimlaneID: string){
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/swimlanes/${swimlaneID}`)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }

    async deleteSwimlane(boardID: string, swimlaneID: string): Promise<{ _id: string}> {
        const resp = await new Request(`${this.BASE_URL}/api/boards/${boardID}/swimlanes/${swimlaneID}`)
            .method("DELETE")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .send();
        return resp.body;
    }
}