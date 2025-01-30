import axios from 'axios';
import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DelProductModal from '../components/DelProductModal';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;
// modal input 預設值
const defaultModalState = {
  imageUrl: '',
  title: '',
  category: '',
  rate: '',
  unit: '',
  origin_price: '',
  price: '',
  description: '',
  content: '',
  is_enabled: 0,
  imagesUrl: [''],
};

function ProductPage() {
  const [products, setProducts] = useState([]);

  // 取得產品 GET API
  const getProducts = async (page = 1) => {
    try {
      const productsData = await axios.get(
        `${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`
      );
      setProducts(productsData.data.products);
      setPageInfo(productsData.data.pagination);
    } catch (error) {
      alert('取得產品失敗');
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // 確認Modal開關狀態
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  // 依照狀態調整modal呈現
  const [modalMode, setModalMode] = useState(null);

  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);
    switch (mode) {
      case 'create':
        setTempProduct(defaultModalState);
        break;
      case 'edit':
        setTempProduct(product);
        break;
    }

    setIsProductModalOpen(true);
  };

  const handleOpenDelProductModal = (product) => {
    setTempProduct(product);
    setIsDelProductModalOpen(true);
  };

  //分頁狀態
  const [pageInfo, setPageInfo] = useState({});
  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => handleOpenProductModal('create')}
                type="button"
                className="btn btn-primary"
              >
                新增產品
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() =>
                            handleOpenProductModal('edit', product)
                          }
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* 分頁元件 */}
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      {/* 新增 修改 modal */}
      <ProductModal
        modalMode={modalMode}
        tempProduct={tempProduct}
        getProducts={getProducts}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
      />

      {/* 刪除 modal */}
      <DelProductModal
        getProducts={getProducts}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        tempProduct={tempProduct}
      />
    </>
  );
}

export default ProductPage;
