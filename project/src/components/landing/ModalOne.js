import React from 'react'

function ModalOne() {
  return (
    <div>
      <div className='ModalOne'>
        <div className='box-shadow'>
          <div className='modal-text text-center pt-3'>
            <h5>Knowledge Exchange</h5>
            <p>Sign In</p>
            <p>Enter your email and password correctly</p>
          </div>
          <div className='si-gn'>
            <div className='sun--reg'>
              <div class='form-floating mb-3'>
                <input
                  type='name'
                  class='form-control'
                  id='floatingInput'
                  placeholder='name@example.com'
                />
                <label for='floatingInput'>Email</label>
              </div>
              <br />
              <div class='form-floating mb-3'>
                <input
                  type='email'
                  class='form-control'
                  id='floatingInput'
                  placeholder='name@example.com'
                />
                <label for='floatingInput'>Password</label>
              </div>
              <div className='mdl d-flex'>
                <div>
                  <h5>Remember me</h5>
                </div>
                <div>
                  <h5>Forgot password</h5>
                </div>
              </div>
              <div>
                <button className='si-btn'>Sign In</button>
              </div>
            </div>
            <div className='fmsti'>
              <h5>New to FMSTI kowledge Exchange Sign up</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalOne