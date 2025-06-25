import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';  // Correct path for AuthContext
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BASE_URL } from '../../Config';  // Correct path for Config

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}login`, {
        email,
        password
      }, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        }
      });

      console.log('Login Response:', response.data); 

      if (response.data.responseCode === "0000") {
        const userData = response.data.userDetails;

        sessionStorage.setItem('user', JSON.stringify({
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          userRole: userData.userRole,
        }));
        console.log('userRole :', userData.userRole);

        login(userData);

        // Ensure navigation is triggered after login
        setTimeout(() => {
          switch (userData.userRole) {
            case "AgentCRO":
              navigate('/Dashboard');
              break;
            case "InsuranceFront":
              navigate('/Dashboard');
              break;
            case "Claim_Head":
              navigate('/Dashboard');
              break;
            case "Key_Account_Manager":
              navigate('/Dashboard');
              break;
            case "Finance":
              navigate('/Dashboard');
              break;
            default:
              navigate('/');
          }
        }, 0); // This ensures navigation happens after state updates
      } else {
        alert('Login failed. Please check your credentials and try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="text-center mb-4">
              <img 
                src="https://healthclinic.webdoc.com.pk/assets/images/brand/feedback-logo.png" 
                alt="logo" 
                style={{ width: '185px' }} 
              />
              <h4 className="mt-3">Login to Your Account</h4>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i
                  className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 end-0 translate-middle-y pe-3 mt-3`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                ></i>
              </div>

              <div className="d-grid gap-2 my-4">
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
