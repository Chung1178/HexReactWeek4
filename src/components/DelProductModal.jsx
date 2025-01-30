import axios from 'axios';
import { useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function DelProductModal({ getProducts, isOpen, setIsOpen, tempProduct }) {
  const delProductModalRef = useRef(null);

  useEffect(() => {
    new Modal(delProductModalRef.current, {
      backdrop: false,
    });
  }, []);

  useEffect(() => {
    if(isOpen){
        const modalInstance = Modal.getInstance(delProductModalRef.current);
        modalInstance.show();
    }
  }, [isOpen])

  const handleCloseDelProductModal = () => {
    const modalInstance = Modal.getInstance(delProductModalRef.current);
    modalInstance.hide();
    setIsOpen(false);
  };

  // 串接刪除產品 DELETE API
  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`
      );
    } catch (error) {
      alert('刪除產品失敗');
    }
  };

  // 刪除modal刪除鍵操作
  const handleDeleteProduct = async () => {
    try {
      await deleteProduct();
      getProducts();
      handleCloseDelProductModal();
    } catch (error) {
      alert('刪除產品失敗');
    }
  };

  return (
    <div
      ref={delProductModalRef}
      className="modal fade"
      id="delProductModal"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">刪除產品</h1>
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            你是否要刪除
            <span className="text-danger fw-bold">{tempProduct.title}</span>
          </div>
          <div className="modal-footer">
            <button
              onClick={handleCloseDelProductModal}
              type="button"
              className="btn btn-secondary"
            >
              取消
            </button>
            <button
              onClick={handleDeleteProduct}
              type="button"
              className="btn btn-danger"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;
