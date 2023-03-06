import React from 'react';
import Compo from './Compo';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';



function Register() {

  return (
    <div>
      <div className='signUp-page d-flex'>
        <div className='signup-panel'>
          <Compo />
        </div>
        <div className='sign-nav'>
          <div className='signnav-color'>
            <div className='jj d-flex'>
              <div>
                <IoIosSearch />
              </div>
              <div className='panel-icons d-flex '>
                <div>
                  <FiUsers />
                </div>
                <div>
                  <IoIosNotificationsOutline />
                </div>
                <div className='panel-image'>
                  {/* <img src={image} alt='' /> */}
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
