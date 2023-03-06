import React, {useState} from 'react';
import Compo from './Compo';
import ModalThree from './ModalThree';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FiUsers } from 'react-icons/fi';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';



function CreateSub() {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div>
      <div className=' d-flex'>
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

              <div className='nn p-1'>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton></Modal.Header>
                  <Modal.Body>
                    <ModalThree />
                  </Modal.Body>
                </Modal>

                <Button variant='primary' onClick={handleShow}>
                  Open
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSub