import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';

export default function TenantToolBar() {
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
                }
            ]
        },
        {
            label: 'תשלום דמי וועד בית באשראי',
            icon: 'pi pi-fw pi-credit-card'
        },
        {
            label: 'הוצאות והכנסות',
            icon: 'pi pi-fw pi-bitcoin',
            items: [
                {
                    label: 'צפייה בהוצאות',
                    icon: 'pi pi-fw pi-chart-line'
                },
                {
                    label: 'צפייה בהכנסות',
                    icon: 'pi pi-fw pi-eye',
                },
                {
                    label: 'צפייה במאזן',
                    icon: 'pi pi-fw pi-chart-bar',
                }
            ] 
        },
        {
            label: 'פנייה לוועד הבית',
            icon: 'pi pi-fw pi-envelope',
        },
        {
            label: 'ניהול דיירים בדירה',
            icon: 'pi pi-fw pi-cog',
            items: [
                {
                    label: 'הוספת דייר',
                    icon: 'pi pi-fw pi-user-plus',  
                },
                {
                    label: 'הסרת דייר',
                    icon: 'pi pi-fw pi-user-minus'
                },
                {
                    label: 'עדכון דייר',
                    icon: 'pi pi-fw pi-user-edit'
                }
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
