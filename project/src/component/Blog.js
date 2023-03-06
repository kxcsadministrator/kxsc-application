import React from 'react';
import Compo from './Compo';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';

function Blog() {
  return (
    <div>
      <div className='blog d-flex'>
        <div className='blogs'>
          <Compo />
        </div>
        <div class='research-color'>
          <div className='jj d-flex p-2'>
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
          <br />
          <div className='bloglist'>
            <div class='row'>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
            </div>
            <br />
            <div class='row'>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
            </div>
            <br />
            <div class='row'>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
              <div class='col'>
                <div className='blogOne'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
