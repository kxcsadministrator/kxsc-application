import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  return (
    <div>
      <div className='sunny__register'>
        <div className='tw text-center text-primary p-3'>
          <h3>Welcome to KXC</h3>
          <p>Create Categories</p>
        </div>
        <div className='sun--reg'>
          <div class='form-floating mb-3'>
            <input
              type='name'
              class='form-control'
              id='floatingInput'
              placeholder='name@example.com'
            />
            <label for='floatingInput'>Categories</label>
          </div>
          <br />
          
          
          
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
