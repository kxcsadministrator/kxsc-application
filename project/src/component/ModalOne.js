import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  return (
    <div>
      <div className='sunny_register'>
        <div className='tw text-center text-primary p-3'>
          <h3>Welcome to KXC</h3>
          <p>Create Users</p>
        </div>
        <div className='sun--reg'>
          <div class='form-floating mb-3'>
            <input
              type='name'
              class='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label for='floatingInput'>Name</label>
          </div>
          <br />
          <div class='form-floating mb-3'>
            <input
              type='email'
              class='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label for='floatingInput'>Email address</label>
          </div>
          <br />
          <div class='form-floating mb-3'>
            <input
              type='number'
              class='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label for='floatingInput'>Phone No.</label>
          </div>
          <br />
          <div class='form-floating mb-3'>
            <input
              type='password'
              class='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label for='floatingInput'>Password</label>
          </div>

          <div className='sun_regtext text-center text-secondary'>
            <h5>
              Already have account?{' '}
              <span>
                <Link className='t' to='/Log'>
                  Login
                </Link>
              </span>
            </h5>
          </div>

          <div className='b-tn'>
            <button className='btn btn-primary ' type='submit'>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
