import React from 'react';

function ModalTwo() {
  return (
    <div>
      <div className='SignUp'>
        <div className='signup-page'>
          <h5>Knowledge Exchange</h5>
          <p>Enjoy endless entertainment and Knowledge at your fingertips</p>
        </div>
        <div className='si-gn'>
          <div className='sun--reg'>
            <div class='form mb-2'>
              <label for='#'>Name</label>
              <input
                type='name'
                class='form-control'
                // id='floatingInput'
              />
            </div>
            <div class='form mb-2'>
              <label for='#'>Email</label>
              <input
                type='email'
                class='form-control'
                // id='floatingInput'
              />
            </div>
            <div class='form mb-2'>
              <label for='#'>Password (6 or more character)</label>
              <input
                type='password'
                class='form-control'
                // id='floatingInput'
              />
            </div>
            <div class='form mb-2'>
              <label for='#'>Confirm Password</label>
              <input
                type='password'
                class='form-control'
                // id='floatingInput'
              />
            </div>
            <div className='uspan'>
              <h5>By clicking Agree & Join, you agree to the FMSTI KXC <span className='uSpan text-success'>User Agreement, Privacy Policy</span> and <span className='uSpan text-success'>Cookie Policy</span></h5>
            </div>
            <div>
              <button className='uspan-btn'>Agree & Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalTwo;
