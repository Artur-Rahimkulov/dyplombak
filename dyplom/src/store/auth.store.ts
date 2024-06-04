import { makeAutoObservable } from "mobx";
import AuthService from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

class AuthStore {
  // isAuth = true;
  // isLoadingAuth = true;
  isAuth = false;
  isLoadingAuth = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async login(user: string, password: string, redirect?: () => void) {
    this.isLoadingAuth = true;
    try {
      const resp = await AuthService.login(user, password);
      if (!resp.data.status){

        if (resp.data.message) {
          return message.error(resp.data.message);
        }
      }else{

        localStorage.setItem("token", resp.data.jwt);
        this.isAuth = true;
      }
      if (redirect)
        redirect()
    } catch (err) {
    } finally {
      this.isLoadingAuth = false;
      console.log(this.isAuth)
      console.log(this.isLoadingAuth)
    }
  }
  async signup(user: string, password: string, redirect?: () => void) {
    this.isLoadingAuth = true;
    try {
      const resp = await AuthService.signup(user, password);
      if (!resp.data.status) {

        if (resp.data.message)
          return message.error(resp.data.message);
      } else {

        localStorage.setItem("token", resp.data.jwt);
        this.isAuth = true;
      }
      if (redirect)
        redirect()
    } catch (err) {
    } finally {
      this.isLoadingAuth = false;
      console.log(this.isAuth)
      console.log(this.isLoadingAuth)
    }
  }

  async checkAuth() {
    this.isLoadingAuth = true;
    try {
      const resp = await AuthService.checkAuthorized();
      if (!resp.data.status)
        return this.logout()
      this.isAuth = true
    } catch (err) {
      console.log("login error");
    } finally {
      this.isLoadingAuth = false;
      console.log(this.isAuth)
      console.log(this.isLoadingAuth)
    }
  }

  async logout() {
    this.isLoadingAuth = true;
    try {
      await AuthService.logout();
      this.isAuth = false;
      localStorage.removeItem("token");
    } catch (err) {
      console.log("logout error");
    } finally {
      this.isLoadingAuth = false;
      console.log(this.isAuth)
      console.log(this.isLoadingAuth)
    }
  }

}

export default new AuthStore();