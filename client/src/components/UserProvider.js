// import axios from "axios";
// import { useState, useEffect } from "react";
// import { fetchData } from "../Hooks/useAxiosGet";
// import UserContext from './UserContext';

// const UserProvider = ({ children, tenantId }) => {

//     const [tenant, setTenant] = useState({});

//     useEffect(() => {
//         if (tenantId) {
//             axios.get(`http://localhost:8000/tenant/allTenant/${tenantId}`)
//                 .then(tenant => {
//                     setTenant(tenant);
//                     tenant && localStorage.setItem("tenant", JSON.stringify(tenant.data))
//                 });
//         }
//     }, [tenantId]);

//     return (
//         <UserContext.Provider value={tenant}>
//             {children}
//         </UserContext.Provider>
//     );
// }
// export default UserProvider;