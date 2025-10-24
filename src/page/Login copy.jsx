import React, { useState } from 'react';
import '../style/login.css'
import login_logo from '../assets/wp-smooth-unscreen.gif'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
         console.log('Login submitted:', { username, password, rememberMe });

        navigate('/dashboard'); // Change this to your desired path
    };


    return (
        <div className='centered-container ps-3 pe-3 page_bg'>
            <div className='login_form'>
                <div className='d-lg-flex d-md-flex'>
                    <div className='login_col_4 mobil_view_login_form_col1'>
                        <img src={login_logo} alt="Avatar" className="avatar pt-2" />
                    </div>
                    <div className=''>
                        <form onSubmit={handleSubmit}>


                            <div className="container login_form_container p-5">
                                <label htmlFor="uname"><b>Username</b></label>
                                <input
                                    className='input_border_style'
                                    type="text"
                                    placeholder="Enter Username"
                                    name="uname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />

                                <label htmlFor="psw"><b>Password</b></label>
                                <input
                                    className='input_border_style'
                                    type="password"
                                    placeholder="Enter Password"
                                    name="psw"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button type="submit" className='login_btn_style  mt-2 mb-2'><span className='login_btn'>Login</span></button>
                                {/* <div className="container" style={{ backgroundColor: '#f1f1f1' }}> */}
                                <div className='mt-2 mb-2 forgate_password_container'>Forgot <a href="#">password?</a></div>
                                {/* </div> */}
                                <div className='karma-logon-text'>Designed & Developed By <b>KARMA GLOBAL TECH MANAGEMENT LLC</b></div>

                            </div>

                        </form>
                    </div>

                </div>

            </div>
        </div>

    );
};

export default Login;
