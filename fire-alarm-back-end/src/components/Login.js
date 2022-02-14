import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  return (
    <div className='loginPage'>
         <div id="login">
        <h3 class="text-center text-white pt-5">Fire ALert</h3>
        <div class="container">
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <form id="login-form" class="form" action="" method="post">
                            <h3 class="text-center text-info">Login</h3>
                            <div class="form-group">
                                <label for="username" class="text-info">Username:</label><br/>
                                <input type="text" name="username" id="username" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="password" class="text-info">Password:</label><br/>
                                <input type="text" name="password" id="password" class="form-control" />
                            </div>
                            <div class="form-group">
                                <label for="remember-me" class="text-info"><br/><span>Remember me</span><span><input id="remember-me" name="remember-me" type="checkbox"/></span></label><br/>
                                <input type="submit" name="submit" class="btn btn-info btn-md" value="submit"/>
                            </div>
                            <div id="register-link" class="text-right">
                                <Link to="/signup" class="text-info">Register here</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Login