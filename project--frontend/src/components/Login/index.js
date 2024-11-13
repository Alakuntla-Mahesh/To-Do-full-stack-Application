import React, { Component } from "react";
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';
import './index.css'

class Login extends Component {
    state = {
        isLogin: true,
        username: '',
        email1: '',
        password1: '',
        email: '',
        password: '',
        redirectToHome: false,

    };

    navigateLogin = () => {
        this.setState((prevState) => ({ isLogin: !prevState.isLogin }));
    };

    onSubmitSuccess = (jwtToken, usernameFromBackend) => {
        Cookies.set('jwt_token', jwtToken, { expires: 30 });
        localStorage.setItem('username', usernameFromBackend);
        this.setState({ redirectToHome: true }); // Set flag for redirect
    };

    onChaneEmail = (event) => { this.setState({ email1: event.target.value }) }
    createUsername = (event) => { this.setState({ username: event.target.value }) }
    onChangePassword = (event) => { this.setState({ password1: event.target.value }) }
    emailFunction = (event) => { this.setState({ email: event.target.value }) }
    passwordFunction = (event) => { this.setState({ password: event.target.value }) }

    submitFormCreateAcc = async event => {
        event.preventDefault();
        const { email1, password1, username } = this.state;

        const response = await fetch('http://localhost:3100/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: uuidv4(), username: username, password: password1, email: email1 }),
        });

        if (response.ok) {
            this.setState({
                username: "", email1: "", password1: "", newPhoneNumber: "", isLogin: true
            });
        }
    }



    submitForm = async event => {
        event.preventDefault();
        const { email, password } = this.state;

        const response = await fetch('http://localhost:3100/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data)
        if (response.ok) {
            this.onSubmitSuccess(data.jwtToken, data.username);

        } else {
            console.log("error");
        }
    };

    loginPage = () => {
        const { email, password } = this.state;
        return (
            <div>
                <form className="Login-Page" onSubmit={this.submitForm}>
                    <h1>Login</h1>
                    <div className="label-input">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="mail" placeholder="Enter your email" onChange={this.emailFunction} value={email} />
                    </div>
                    <div className="label-input">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" onChange={this.passwordFunction} value={password} />
                    </div>
                    <button className="login-btn" type="submit">Login</button>
                    <p>Don't have an account? <button type="button" onClick={this.navigateLogin}>Create account</button></p>
                </form>
            </div>
        );
    };

    signUpPage = () => {
        const { email1, username, password1 } = this.state
        return (
            <form className="Login-Page signUp-Page" onSubmit={this.submitFormCreateAcc}>
                <h1>Create Account</h1>
                <div className="label-input">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" placeholder="Create your username" onChange={this.createUsername} value={username} />
                </div>
                <div className="label-input">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="mail" placeholder="Enter your email" onChange={this.onChaneEmail} value={email1} />
                </div>
                <div className="label-input">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" onChange={this.onChangePassword} value={password1} />
                </div>
                <button className="login-btn" type="submit">Sign Up</button>
                <p>Already have an account? <button id="btn" onClick={this.navigateLogin}>Login</button></p>
            </form>
        )
    }

    render() {
        const { isLogin, redirectToHome } = this.state;

        // Redirect to home page if redirectToHome is true
        if (redirectToHome) {
            return <Navigate to="/" replace />;
        }

        return (
            <div>
                {isLogin ? this.loginPage() : this.signUpPage()}
            </div>
        );
    }
}

export default Login;
