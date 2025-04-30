import React, { useState } from 'react';
import '../style/login.css'
import login_logo from '../assets/wp-smooth-unscreen.gif'
import { useNavigate } from 'react-router-dom';
import complyn_mgmt_logo from '../assets/complyn_mgmt_logo.png'
import API from '../api/axios'; // your axios instance


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const navigate = useNavigate();


    // const createPost = async () => {
    //     try {
    //       const response = await API.post('/api/auth/login', {
            
    //       });
    //       console.log('Post Created:', response.data);
    //     } catch (error) {
    //       console.error('Post failed:', error);
    //     }
    //   };
      
    //   createPost();
    const createPost = async () => {
        try {
          const response = await API.post('/posts', {
            title: 'My New Post',
            body: 'This is the body of the post',
            userId: '',
          });
          console.log('Post Created:', response.data);
        } catch (error) {
          console.error('Post failed:', error);
        }
      };
      
      createPost();
      
      
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login submitted:', { username, password, rememberMe });

        navigate('/dashboard'); // Change this to your desired path
    };


    return (
        <div className='centered-container ps-3 pe-3 page_bg'>
            <div className=' mobil_view_login_form_col1_v2 pe-5 ps-5'>
                <img src={complyn_mgmt_logo} alt="Avatar" className="avatar_v2" />
                <div className='ps-2 pe-2'>Command the chaos. Lead with intelligence. Govern with integr-ity.
                </div>
            </div>
            <div className=''>
                <div className='d-flex justify-content-center pb-3 pt-3 desk_top_hide'>
                    <img src={complyn_mgmt_logo} alt="Avatar" className="avatar_v2 w-75" />
                </div>
                <div className='d-lg-flex d-md-flex login_form_v2'>

                    <div className=''>

                        <form onSubmit={handleSubmit}>


                            <div className="container login_form_container">

                                <div className='mb-3 login_heading_text'>Log in</div>
                                <label htmlFor="uname">Email address</label>
                                <input
                                    className='input_border_style'
                                    type="text"
                                    // placeholder="Enter Email address"
                                    name="uname"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />

                                <label htmlFor="psw">Password</label>
                                <input
                                    className='input_border_style'
                                    type="password"
                                    // placeholder="Enter Password"
                                    name="psw"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className='mt-2 mb-2'>Forgot password?
                                    {/* <a href="#">password?</a> */}
                                </div>

                                <button type="submit" className='login_btn_style_v2  mt-2 mb-2'><span className='login_btn'>Log in</span></button>
                                {/* <div className="container" style={{ backgroundColor: '#f1f1f1' }}> */}
                                {/* </div> */}
                                <div className='karma-logon-text_v2'>New to ComplyMgmt?<span className='karma_logo_text_span_v2'> Create account</span></div>

                            </div>

                        </form>
                    </div>

                </div>

            </div>

        </div>

    );
};

export default Login;
