import React, {useState} from 'react';
import Compo from './Compo';
import ModalTwo from './ModalTwo';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';


function Research() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <div className='research'>
        <div className='research-flex d-flex'>
          <div className='users'>
            <Compo />
          </div>
          <div className='research-color'>
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

                <div className='nn'>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <ModalTwo />
                    </Modal.Body>
                  </Modal>

                  <Button variant='primary' onClick={handleShow}>
                    Open
                  </Button>
                </div>
              </div>
            </div>
            <div className='tablex'>
              <table className='table caption-top'>
                <thead>
                  <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>RI1</th>
                    <th scope='col'>RI2</th>
                    <th scope='col'>RI3</th>
                    <th scope='col'>RI4</th>
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
      </div>
    </div>
  );
}

export default Research