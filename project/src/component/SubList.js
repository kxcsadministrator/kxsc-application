import React from 'react';
import Compo from './Compo';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';


function SubList() {
  return (
    <div>
      <div className='sub d-flex'>
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
          <table className='table caption-top'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Sub1</th>
                <th scope='col'>Sub2</th>
                <th scope='col'>Sub3</th>
                <th scope='col'>Sub4</th>
                <th scope='col'>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope='row'>1</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
                <th scope='row'>2</th>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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

export default SubList