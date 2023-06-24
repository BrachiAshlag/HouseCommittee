import ManagerToolBar from "./components/ManagerToolBar";
import TenantToolBar from "./components/TenantToolBar";
import ActiveVotes from "./components/ActiveVotes";
import VotesResultsScreen from "./components/VotesResultsScreen";
import AddVote from "./components/AddVote";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import PaymentSettings from "./components/PaymentSettings";
import RemoveVote from "./components/RemoveVote";
import RemoveAd from "./components/RemoveAd";
import AddAd from "./components/AddAd";
import SignIn from "./components/SignIn";
import ChangePassword from "./components/ChangePassword";
import RemoveTenant from "./components/RemoveTenant";
import DetectionInCameras from "./components/DetectionInCameras";
import LookOnCameras from "./components/LookOnCameras";
import DefiningLists from "./components/DefiningLists";
import UpdateOneTenant from "./components/UpdateOneTenant";
import AddApartment from "./components/AddApartment";
import RemoveApartment from "./components/RemoveApartment";
import EditYourTenant from "./components/EditYourTenant";
import UpdateApartment from "./components/UpdateApartment";
import CreateBuilding from "./components/CreateBuilding";
import AddRemovePark from "./components/AddRemovePark";
import AddRemoveStorage from "./components/AddRemoveStorage";
import AppealToHouseCommittee from "./components/AppealToHouseCommittee";
import MessagesHouseCommittee from "./components/MessagesHouseCommittee";
import Home from "./components/Home";
import PDFView from "./components/PDFView";
import CreateEntry from "./components/CreateEntry";
import UserProvider from "./components/UserProvider";
import { useContext, useEffect, useState } from "react";
import UserContext from "./components/UserContext";

function App() {
  // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [tenantId, setTenantId] = useState(null);


  // useEffect(() => {
  //   const tenantFromLocalStorage = localStorage.getItem("tenant")
  //   if (!tenantFromLocalStorage) return;
  //   const parsedTenant = JSON.parse(tenantFromLocalStorage)
  //   setTenantId(parsedTenant.id)
  // }, []);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("tenant")) != null)
      setTenant(JSON.parse(localStorage.getItem("tenant")));
    else if (JSON.parse(localStorage.getItem("admin")))
      setAdmin(JSON.parse(localStorage.getItem("admin")));
  }, [tenantId])


  return (
    <>
      <div className="App" style={{ direction: "rtl" }}>
        {(tenant?.is_building_committee === true) && <ManagerToolBar setTenantIdCallback={setTenantId} />}
        {(tenant?.is_building_committee === false) && <TenantToolBar setTenantIdCallback={setTenantId} />}
        <br /><br />
        <Routes>
          {tenant && <>
            <Route path='/' element={<SignIn setTenantIdFunc={setTenantId} />} />
            <Route path='/home' element={<Home />} />
            <Route path='/createEntry' element={<CreateEntry />} />
            <Route path='/changePassword' element={<ChangePassword />} />
            <Route path='/addApartment' element={<AddApartment />} />
            <Route path='/updateApartment' element={<UpdateApartment />} />
            <Route path='/addTenant' element={<AddTenant />} />
            <Route path='/editYourTenant' element={<EditYourTenant />} />
            <Route path='/updateOneTenant' element={<UpdateOneTenant />} />
            <Route path='/votesResults' element={<VotesResultsScreen />} />
            <Route path='/activeVotes' element={<ActiveVotes />} />
            <Route path='/addVote' element={<AddVote />} />
            <Route path='/payByCreditCard' element={<CreditCardPayment />} />
            <Route path='/createBuilding' element={<CreateBuilding />} />
            <Route path='/expensesTable' element={<ExpensesTable />} />
            <Route path='/incomesTable' element={<IncomesTable />} />
            <Route path='/balanceTable' element={<BalanceTable />} />
            <Route path='/payByCash' element={<Cash />} />
            <Route path='/createExpense' element={<CreateExpense />} />
            <Route path='/viewingApartment' element={<ViewingApartment />} />
            <Route path='/searchByApartment' element={<SearchByApartment />} />
            <Route path='/searchByName' element={<SearchByName />} />
            <Route path='/searchByPark' element={< SearchByPark />} />
            <Route path='/searchByStorage' element={<SearchByStorage />} />
            <Route path='/searchByPhone' element={<SearchByPhone />} />
            <Route path='/searchByCarNum' element={<SearchByCarNum />} />
            <Route path='/paymentSettings' element={<PaymentSettings />} />
            <Route path='/removeVote' element={<RemoveVote />} />
            <Route path='/removeAd' element={<RemoveAd />} />
            <Route path='/removeApartment' element={<RemoveApartment />} />
            <Route path='/removeTenant' element={<RemoveTenant />} />
            <Route path='/addAd' element={<AddAd />} />
            <Route path='/detectionInCameras' element={<DetectionInCameras />} />
            <Route path='/LookOnCameras' element={<LookOnCameras />} />
            <Route path='/definingLists' element={<DefiningLists />} />
            <Route path='/addRemovePark' element={<AddRemovePark />} />
            <Route path='/addRemoveStorage' element={<AddRemoveStorage />} />
            <Route path='/appealToHouseCommittee' element={<AppealToHouseCommittee />} />
            <Route path='/messagesHouseCommittee' element={<MessagesHouseCommittee />} />
            <Route path='/pdfView' element={<PDFView />} />
            <Route path='/creditSuccess' element={<h4>התשלום בוצע בהצלחה</h4>} />{/*}<CreditSuccess />} />*/}
            <Route path='/creditCancel' element={<h4>התשלום נדחה</h4>} />{/*<CreditCancel />} />*/}
            <Route path='*' element={<h1> שגיאה 404 דף לא נמצא </h1>} />
          </>}
          {admin && <>
            <Route path='/' element={<SignIn setTenantIdFunc={setTenantId} />} />
            <Route path='/createEntry' element={<CreateEntry />} />
            <Route path='/addApartment' element={<AddApartment />} />
            <Route path='/addTenant' element={<AddTenant />} />
            <Route path='/createBuilding' element={<CreateBuilding />} />
            <Route path='/paymentSettings' element={<PaymentSettings />} />
            <Route path='/definingLists' element={<DefiningLists />} />
            <Route path='*' element={<h1> שגיאה 404 דף לא נמצא </h1>} />
          </>}
        </Routes>

        {!tenant && !admin && <SignIn setTenantIdFunc={setTenantId} />}
        {/* </UserProvider> */}
      </div>
    </>
  );
}

export default App;