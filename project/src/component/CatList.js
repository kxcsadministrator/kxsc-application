import React from 'react';
import Compo from './Compo';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';


function CatList() {
  return (
    <div>
      <div className='list d-flex'>
        <div className='users'>
          <Compo />
        </div>
        <div className='pp'>
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
          <table class='table caption-top'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Name</th>
                <th scope='col'>Cat1</th>
                <th scope='col'>Cat2</th>
                <th scope='col'>Cat3</th>
                <th scope='col'>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope='row'>1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>000</td>
                <td>1234</td>
                <td>
                  <div className='actions d-flex gap-3'>
                    <div>
                      <input
                        class='btn btn-primary'
                        type='button'
                        value='Edit'
                      ></input>
                    </div>
                    <div>
                      <input
                        className='btn btn-danger'
                        type='button'
                        value='Delete'
                      ></input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope='row'>2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>000</td>
                <td>1234</td>
                <td>
                  <div className='actions d-flex gap-3'>
                    <div>
                      <input
                        className='btn btn-primary'
                        type='button'
                        value='Edit'
                      ></input>
                    </div>
                    <div>
                      <input
                        className='btn btn-danger'
                        type='button'
                        value='Delete'
                      ></input>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th scope='row'>3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>000</td>
                <td>1234</td>
                <td>
                  <div className='actions d-flex gap-3'>
                    <div>
                      <input
                        className='btn btn-primary'
                        type='button'
                        value='Edit'
                      ></input>
                    </div>
                    <div>
                      <input
                        className='btn btn-danger'
                        type='button'
                        value='Delete'
                      ></input>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CatList