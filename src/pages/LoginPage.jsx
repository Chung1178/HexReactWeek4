import axios from 'axios';
import { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_BASE_URL;

function LoginPage({ setIsAuth }) {
  const [account, setAccount] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value,
    });
  };

  // 登入流程，若登入成功則將伺服器回傳的token資訊存入cookie，並預設axios套件header內Authorization的token
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
    } catch (error) {
      alert(`登入失敗，失敗原因:${error.response.data.message}`);
    }
  };

  // 驗證登入流程，如成功則載入產品資訊並渲染畫面
  const checkUserLogin = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  // 網頁開啟時，先執行一次驗證，判斷是否已登入、存有token，若有則直接跳轉產品頁，並預設axios套件header內Authorization的token
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common['Authorization'] = token;
    checkUserLogin();
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input
            name="username"
            type="email"
            className="form-control"
            id="username"
            placeholder="name@example.com"
            onChange={handleInputChange}
          />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input
            name="password"
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={handleInputChange}
          />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>
  );
}

export default LoginPage;
