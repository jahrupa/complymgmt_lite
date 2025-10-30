import React, { useState } from 'react'
import { forgetPassword } from '../api/service';
import '../style/login.css'
import complyn_mgmt_logo from '../assets/complymgmt_logo.png'
import Snackbars from '../component/Snackbars';
import { useNavigate } from 'react-router-dom';
const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [issnackbarsOpen, setIsSnackbarsOpen] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
        message: '',
        severityType: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await forgetPassword(email);
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: response.message, severityType: 'success' });
        } catch (error) {
            setIsSnackbarsOpen({ ...issnackbarsOpen, open: true, message: error?.response?.data?.message, severityType: 'error' });
        }
    };

    return (
        <div className='centered-container ps-3 pe-3 page_bg'>
            <Snackbars issnackbarsOpen={issnackbarsOpen} setIsSnackbarsOpen={setIsSnackbarsOpen} />
            <div className=' mobil_view_login_form_col1_v2 pe-5'>
                <img src={complyn_mgmt_logo} alt="Avatar" className="avatar_v2" />
                <div className='ps-2 pe-2 mt-2'>Command the chaos. Lead with intelligence. Govern with integrity.
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
                                <div className='d-flex justify-content-center mb-3 mt-4'>
                                    <img src={complyn_mgmt_logo} alt="Avatar" style={{ width: '50%' }} />
                                </div>
                                <div className='mb-3 login_heading_text'>Forget Password</div>
                                <label htmlFor="email" className='info'>Enter your Email Address</label>
                                <input
                                    className='input_border_style'
                                    type="email"
                                    // placeholder="Enter Email address"
                                    name="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <div className='d-flex justify-content-between gap-3'>
                                    <button type="submit" className='login_btn_style_v2  mt-2 mb-2' onClick={() => navigate('/')}><span className='login_btn forgot_password'>Back to Login</span></button>

                                    <button type="submit" className='login_btn_style_v2  mt-2 mb-2'><span className='login_btn '>Submit</span></button>
                                </div>


                            </div>

                        </form>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default ForgetPassword