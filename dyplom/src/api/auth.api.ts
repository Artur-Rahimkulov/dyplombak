import { instance } from "./api.config";
let AuthService = {

    login(username: string, password: string){
        return instance.post("/api/auth/login", { username, password })
    },
    signup(username: string, password: string){
        return instance.post("/api/auth/signup", { username, password })
    },
    
    checkAuthorized(){
        return instance.get("/api/auth/checkAuthorized")
    },
    
    logout(){
        return
    }
}
export default AuthService