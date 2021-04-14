import React, {useState, useEffect, useContext} from "react";
import {useHttp} from "../hooks/http.hook";
import {Warning} from "../components/Warning/Warning";
import {AuthContext} from "../context/AuthContext";

require("./AuthPage.css");


export const AuthPage = () => {
    const {loading, request, error} = useHttp();
    const auth = useContext(AuthContext);

    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [valid, setValid] = useState({
        emailValid: true,
        passwordValid: true
    })
    const [warning, setWarning] = useState(null)

    useEffect(() => {
        setWarning(error)
    }, [error]);

    const changeHandler = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        //validator

    let emailValid = Boolean( form.email.match(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g) );
    let passwordValid = form.password.trim().length>6;
    setValid({emailValid, passwordValid})
    if(!emailValid || !passwordValid) return;

    try {
        await request ("/api/auth/register", "POST", {...form});
    } catch (e) {}
    }

    const loginHandler = async() => {
        try {
            const data = await request("/api/auth/login", "POST", {...form});
            auth.login(data.token, data.userId);
        } catch (e) {}
    }
    return(
    <div className="authPage">
        <h1>Check your progress </h1>
        <div className="authCard">
            <span className="authCard_title">Авторизация</span>
            <div className="inputField">
                <input
                    type="email"
                    placeholder="введите email"
                    id="email"
                    name="email"
                    onChange={changeHandler}
                />
                <label htmlFor="email">Email</label>
                {!valid.emailValid? <div className={"warning"}>Некорреткный email</div> : ""}
            </div>
            <div className="inputField">
                <input
                    type="password"
                    placeholder="введите пароль"
                    id="password"
                    name="password"
                    onChange={changeHandler}
                />
                <label htmlFor="password">Пароль</label>
                {!valid.passwordValid? <div className={"warning"}>Пароль должен быть больше 6 знаков</div> : ""}
            </div>
            <div className="authCard_action">
                <button
                    id="authorization"
                    name="authorization"
                    onClick={loginHandler}
                    disabled={loading}
                >Войти</button>
                <button
                    id="registration"
                    name="registration"
                    onClick={registerHandler}
                    disabled={loading}
                >Регистрация</button>
            </div>
            <Warning text={warning}/>
        </div>
    </div>
    )
}