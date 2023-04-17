import ManagerToolBar from "./components/ManagerToolBar";
import TenantToolBar from "./components/TenantToolBar";
import ActiveVotes from "./components/ActiveVotes";
import VotesResultsScreen from "./components/VotesResultsScreen";
import AddVote from "./components/AddVote";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from "./components/Login";
import AddTenant from "./components/AddTenant";
import CreditCardPayment from "./components/CreditCardPayment";
import ExpensesTable from "./components/ExpensesTable";
import IncomesTable from "./components/IncomesTable";
import BalanceTable from "./components/BalanceTable";
import Cash from "./components/Cash";
import CreateExpense from "./components/CreateExpense";
import ForgetPassword from "./components/ForgetPassword";
import ViewingApartment from "./components/ViewingApartment";
import SearchByApartment from "./components/SearchByApartment";
import SearchByName from "./components/SearchByName";
import SearchByPark from "./components/SearchByPark";
import SearchByStorage from "./components/SearchByStorage";
import SearchByPhone from "./components/SearchByPhone";
import SearchByCarNum from "./components/SearchByCarNum";


function App() {
  const tenant = { isBuildingCommittee: true };
  return (
    <>
      <div className="App" style={{ direction: "rtl" }}>
        {tenant.isBuildingCommittee ? <ManagerToolBar /> : <TenantToolBar />}
        {/* loginהסרגל לא צריך להיות ב */}
        <br /><br /><br /><br /><br />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/addTenant' element={<AddTenant />} />
          <Route path='/votesResults' element={<VotesResultsScreen />} />
          <Route path='/activeVotes' element={<ActiveVotes />} />
          <Route path='/addVote' element={<AddVote />} />
          <Route path='/payByCreditCard' element={<CreditCardPayment />} />
          <Route path='/expensesTable' element={<ExpensesTable />} />
          <Route path='/incomesTable' element={<IncomesTable />} />
          <Route path='/balanceTable' element={<BalanceTable />} />
          <Route path='/payByCash' element={<Cash />} />
          <Route path='/createExpense' element={<CreateExpense />} />
          <Route path='/forgetPassword' element={<ForgetPassword />} />
          <Route path='/viewingApartment' element={<ViewingApartment />} />
          <Route path='/searchByApartment' element={<SearchByApartment />} />
          <Route path='/searchByName' element={<SearchByName />} />
          <Route path='/searchByPark' element={< SearchByPark/>} />
          <Route path='/searchByStorage' element={<SearchByStorage />} />
          <Route path='/searchByPhone' element={<SearchByPhone />} />
          <Route path='/searchByCarNum' element={<SearchByCarNum />} />
          <Route path='*' element={<h1> 404 Page not found</h1>} />
        </Routes>
        {/* <Try></Try> */}
      </div>
    </>
  );
}

export default App;