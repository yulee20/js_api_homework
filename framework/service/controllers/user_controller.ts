import { Request } from "../../request"
import { Controller } from "./controller"
import { CookieJar } from "request"
import { User } from "../models/user_model"
import { Login } from "../models/login_model"

export class Users extends Controller {
    bearerToken: string;

    constructor(BASE_URL?: string, cookieJar?: CookieJar, bearerToken?: string){
        super(BASE_URL, cookieJar);
        this.bearerToken = bearerToken;
    }

    async createUser(
        email: string,
        password: string,
        username: string
    ): Promise<{ _id: string }> {
        const resp = await new Request(this.BASE_URL + "/api/users")
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body({
                email: email,
                password: password,
                username: username
            })
            .send();
        
        return resp.body;
    }

    async registerUser(email: string, password: string): Promise<Login> { 
        const resp = await new Request(this.BASE_URL + "/users/register")
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body({
                email: email,
                password: password
            })
            .send();
        
        return resp.body;
    }

    async loginUser(email: string, password: string): Promise<Login> {
        const resp = await new Request(this.BASE_URL + "/users/login")
            .method("POST")
            .cookies(this.cookieJar)
            .auth(this.bearerToken)
            .body({
                email: email,
                password: password
            })
            .send();

        return resp.body;
    }

    async getUserDetailsById(id: string): Promise<User> {
        const resp = await new Request(`${this.BASE_URL}/api/users/${id}`)
            .auth(this.bearerToken)
            .send();

        return resp.body;
    }
}