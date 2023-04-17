import React from 'react';
import { useNavigate } from "react-router-dom" 
import { Menubar } from 'primereact/menubar';



export default function ManagerToolBar() {
    const navigate = useNavigate();
    const items = [
        {
            label: ' ניהול הצבעות',
            icon: 'pi pi-fw pi-thumbs-up',
            items: [
                {
                    label: 'הצבעות פעילות',
                    icon: 'pi pi-fw pi-calendar',
                    command: ()=>{ navigate("/activeVotes") }
                },
                {
                    label: 'תוצאות הצבעות',
                    icon: 'pi pi-fw pi-list',
                    command: ()=>{ navigate("/votesResults") }
                },
                {
                    label: 'הוספת הצבעה',
                    icon: 'pi pi-fw pi-plus',
                    command: ()=>{ navigate("/addVote") }
                },
                {
                    label: 'הסרת הצבעה',
                    icon: 'pi pi-fw pi-trash'
                }
            ]
        },
        {
            label: 'גביה ותשלומים',
            icon: 'pi pi-fw pi-dollar',
            items: [
                {
                    label: 'תשלום דמי וועד בית באשראי',
                    icon: 'pi pi-fw pi-credit-card',
                    command: ()=>{ navigate("/payByCreditCard") }
                },
                {
                    label: 'עדכון על תשלום וועד בית במזומן ',
                    icon: 'pi pi-fw pi-dollar',
                    command: ()=> { navigate("/payByCash") }
                },
                {
                    label: 'הגדרות גבייה',
                    icon: 'pi pi-fw pi-cog'
                }
            ]
        },
        {
            label: 'הוצאות והכנסות',
            icon: 'pi pi-fw pi-bitcoin',
            items: [
                {
                    label: 'עדכון הוצאה',
                    icon: 'pi pi-fw pi-file-edit',
                    command: ()=> { navigate("/createExpense") }
                },
                {
                    label: 'צפייה בהוצאות',
                    icon: 'pi pi-fw pi-chart-line',
                    command: () => { navigate("/expensesTable") }
                },
                {
                    label: 'צפייה בהכנסות',
                    icon: 'pi pi-fw pi-eye',
                    command: () => { navigate("/incomesTable") }
                },
                {
                    label: 'צפייה במאזן',
                    icon: 'pi pi-fw pi-chart-bar',
                    command: () => { navigate("/balanceTable") }
                }
            ] 
        },
        {
            label: 'לוח מודעות',
            icon: 'pi pi-fw pi-envelope',
            items: [
                {
                    label: 'הוספת מודעה',
                    icon: 'pi pi-fw pi-plus',  
                },
                {
                    label: 'הסרת מודעה',
                    icon: 'pi pi-fw pi-minus'
                }
            ]
        },
        {
            label: 'ניהול שערי החניון',
            icon: 'pi pi-fw pi-car',
            items: [
                {
                    label: 'הוספת דייר/ים',
                    icon: 'pi pi-fw pi-user-plus',  
                    command: ()=>{ navigate("/addTenant") }
                },
                {
                    label: 'הסרת דייר/ים',
                    icon: 'pi pi-fw pi-user-minus'
                }
            ]
        },
        {
            label: 'מצלמות אבטחה',
            icon: 'pi pi-fw pi-camera',
            items: [
                {
                    label: 'צפייה',
                    icon: 'pi pi-fw pi-eye',  
                },
                {
                    label: 'איתור',
                    icon: 'pi pi-fw pi-search'
                }
            ]
        },
        {
            label: 'הגדרות',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'הגדרת רשימות ',
                    icon: 'pi pi-fw pi-list',  
                },
                {
                    label: 'פרטי בניין',
                    icon: 'pi pi-fw pi-building'
                },
                {
                    label: 'דירות',
                    icon: 'pi pi-fw pi-home',
                    items: [
                        {
                            label: 'הוספה',
                            icon: 'pi pi-fw pi-plus',  
                        },
                        {
                            label: 'הסרה',
                            icon: 'pi pi-fw pi-minus'
                        },
                        {
                            label: 'צפייה',
                            icon: 'pi pi-fw pi-eye',
                            command: ()=> { navigate("/viewingApartment") }
                        },
                    ]
                },
            ]
        }
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    // const end = <InputText placeholder="Search" type="text" className="w-full" />;

    return (
        <div className="card">
            <Menubar model={items} start={start} /*end={end}*/ />
        </div>
    )

}
