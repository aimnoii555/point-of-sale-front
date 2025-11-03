import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Package } from './pages/Package';
import { createBrowserRouter, redirect, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Product from './pages/Product';
import User from './pages/User';
import Sale from './pages/Sale';
import LastBill from './pages/LastBill';
import ReportBillSale from './pages/ReportBillSale';
import SumSalePerDay from './pages/SumSalePerDay';
import Stock from './pages/Stock';
import ReportStock from './pages/ReportStock';
import ProtectedRoute from './middlewares/ProtectedRoute';


const router = createBrowserRouter([
  { path: '/', element: <Package /> },
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/products', element: <Product /> },
      { path: '/users', element: <User /> },
      { path: '/sales', element: <Sale /> },
      { path: '/list-bill', element: <LastBill /> },
      { path: '/report-bill-sale', element: <ReportBillSale /> },
      { path: '/sum-sale-per-day', element: <SumSalePerDay /> },
      { path: '/stock', element: <Stock /> },
      { path: '/report-stock', element: <ReportStock /> }
    ]
  }

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);


reportWebVitals();
