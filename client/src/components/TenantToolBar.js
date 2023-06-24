import React, { useContext, useEffect, useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../Hooks/useAxiosGet';
import { Avatar } from 'primereact/avatar';
import UserContext from './UserContext';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';

// const tenant = { building_id: 1, apartment_id: 1 }

export default function TenantToolBar(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [building, setBuilding] = useState([]);
    const [visible, setVisible] = useState(false);

    const getBuilding = async () => {
        const myData = await fetchData(`building/${tenant?.building_id}`);
        setBuilding(myData);
    }

    useEffect(() => {
        getBuilding();
    }, [])

    const navigate = useNavigate();
    const items = [
        {
            label: 'פנייה לוועד הבית',
            icon: 'pi pi-fw pi-send',
            command: () => { navigate("/appealToHouseCommittee") }
        },
        {
            label: ' ניהול הצבעות',
            icon: 'pi pi-fw pi-thumbs-up',
            items: [
                {
                    label: 'הצבעות פעילות',
                    icon: 'pi pi-fw pi-calendar',
                    command: () => { navigate("/activeVotes") }
                },
                {
                    label: 'תוצאות הצבעות',
                    icon: 'pi pi-fw pi-list',
                    command: () => { navigate("/votesResults") }
                }
            ]
        },
        {
            label: "ניהול הכספים",
            icon: "pi pi-dollar",
            items: [
                {
                    label: 'גבייה ותשלומים',
                    icon: 'pi pi-fw pi-dollar',
                    items: [
                        {
                            label: 'תשלום דמי וועד בית באשראי',
                            icon: 'pi pi-fw pi-credit-card',
                            command: () => { navigate("/payByCreditCard") },
                            disabled: !(building?.bank_account && building?.account_owner_name && building?.branch_num && building?.branch_address && building?.bank_name)
                        },
                        {
                            label: 'צפייה באישורי תשלום',
                            icon: 'pi pi-fw pi-file',
                            command: () => { navigate("/pdfView") }
                        }
                    ]
                },
                {
                    label: 'הוצאות והכנסות',
                    icon: 'pi pi-fw pi-bitcoin',
                    items: [
                        {
                            label: 'צפייה בהוצאות',
                            icon: 'pi pi-fw pi-chart-line',
                            command: () => { navigate("/expensesTable") }
                        },
                        {
                            label: 'צפייה בהכנסות',
                            icon: 'pi pi-fw pi-refresh',
                            command: () => { navigate("/incomesTable") }
                        },
                        {
                            label: 'צפייה במאזן',
                            icon: 'pi pi-fw pi-chart-bar',
                            command: () => { navigate("/balanceTable") }
                        }
                    ]
                },
            ]
        },
        {
            label: 'ניהול דיירים בדירה',
            icon: 'pi pi-users',
            items: [
                {
                    label: 'הוספת דייר',
                    icon: 'pi pi-fw pi-user-plus',
                    command: () => { navigate("/addTenant") }
                },
                {
                    label: 'הסרת דייר',
                    icon: 'pi pi-fw pi-user-minus',
                    command: () => { navigate("/removeTenant") }
                },
                {
                    label: 'עדכון דייר',
                    icon: 'pi pi-fw pi-user-edit',
                    command: () => { navigate("/updateOneTenant") }
                }
            ]
        },
        {
            label: 'צפייה בדירה',
            icon: 'pi pi-fw pi-home',
            command: () => navigate("/viewingApartment")
        },
        {
            label: 'ניהול מחסנים וחניות',
            icon: 'pi pi-fw pi-file-edit',
            items: [
                {
                    label: 'הוספת ו/או הסרת מחסן',
                    icon: 'pi pi-fw pi-home',
                    command: () => { navigate("/addRemoveStorage") }
                },
                {
                    label: 'הוספת ו/או הסרת חניה',
                    icon: 'pi pi-fw pi-user-edit',
                    command: () => { navigate("/addRemovePark") }
                }
            ]
        }
    ];

    const menuItems = [
        {
            label: 'פרטים אישיים',
            items: [
                {
                    label: 'צפייה בפרופיל',
                    icon: 'pi pi-user',
                    command: () => { setVisible(true) }
                },
                {
                    label: 'עדכון פרטי דייר',
                    icon: 'pi pi-user-edit',
                    command: () => { navigate("/editYourTenant") }
                },
                {
                    label: 'שינוי הסיסמא',
                    icon: 'pi pi-eye',
                    command: () => { navigate("/changePassword") }
                }
            ]
        },
        {
            label: 'פרטי הדירה',
            items: [
                {
                    label: 'עריכת פרטי הדירה שלך',
                    icon: 'pi pi-home',
                    command: () => { navigate("/updateApartment") }
                }
            ]
        },
        {
            label: 'פרטי הבניין',
            items: [
                {
                    label: 'צפייה בפרטי הבניין שלך',
                    icon: 'pi pi-building',
                    command: () => { navigate("/createBuilding") }
                }
            ]
        }, 
        {
            label: "התנתקות",
            icon: "pi pi-sign-out",
            command: ()=> {
                localStorage.clear(); 
                navigate("/");
            }
        }
    ];

    const menu = useRef(null);

    // const start = <img alt="logo" src=".\images\HouseCommittee.jpg" height="40" className="mr-2"></img>;
    const end = <div className='flex align-item-center'>
        <div style={{ margin: "3px" }}>
            <Dialog visible={visible} position='top-right' style={{ width: '220px', direction: "rtl" }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    <b>{tenant.name} <i className='pi pi-user'></i></b><br /><br />
                    {tenant.address}<br />
                    כניסה {tenant.entry_num} דירה {tenant.apartment_num}<br />
                    קוד בניין {tenant.building_id}<br />
                </p>
            </Dialog> 
            <Menu model={menuItems} popup ref={menu} />
            <Avatar icon="pi pi-user" size="large" shape="circle" style={{ cursor: "pointer", backgroundColor: '#6366F1', color: '#ffffff' }} onClick={(e) => { menu.current.toggle(e) }} /><br />
            <div style={{ fontSize: "8pt", textAlign: "center" }}>{tenant.name}</div>
        </div>
        <div style={{ margin: "3px" }}>
            <Avatar icon="pi pi-home" size="large" shape="circle" style={{ cursor: "pointer", backgroundColor: '#6366F1', color: '#ffffff' }} onClick={() => { navigate("/home") }} /><br />
        </div>
    </div>

    return (
        <div className="card">
            <Menubar model={items} /*start={start}*/ end={end} style={{ backgroundColor: "#e8e9fc", direction: "ltr" }} />
        </div>
    )

}
