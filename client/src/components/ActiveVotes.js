
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import Vote from './Vote';
import { fetchData, postData } from '../Hooks/useAxiosGet';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';

const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function ActiveVotes() {
    const data = [
        {id: -1, description: "לכל הבניין שלך"},
        {id: -2, description: "רק לכניסה שלך"}
    ]

    const [הotes, setVotes] = useState(null);
    const [selectedOption, setSelectedOption] = useState(data[0]);


    const getVotes = async (url) => {
        const myData = await fetchData(url);
        console.log("votes", myData);
        if (myData)
            setVotes(myData);           
    }

    useEffect(() => {
        console.log(`vote/relevant?building_id=${tenant.building_id}&tenant_id=${tenant.id}`);
        if(selectedOption.id === -1)
            getVotes(`vote/relevant?building_id=${tenant.building_id}&tenant_id=${tenant.id}`);
        else if(selectedOption.id === -2)
            getVotes(`vote/relevant?entry_id=${tenant.entry_id}&tenant_id=${tenant.id}`);
    }, [ selectedOption ])

    return (
        <div className="card">
            <Card title="הצבעות" subTitle="נא לבחור את ההצבעה הרצויה" style={{ width: "45%", margin: "50px", marginLeft: "auto", marginRight: "auto" }}>
                נתן ללחוץ <Button
                    onClick={() => {
                        console.log(`vote/active?building_id=${tenant.building_id}&tenant_id=${tenant.id}`);
                        if(selectedOption.id === -1)
                            getVotes(`vote/active?building_id=${tenant.building_id}&tenant_id=${tenant.id}`)
                        else
                            getVotes(`vote/active?entry_id=${tenant.entry_id}&tenant_id=${tenant.id}`)
                    }                    
                }
                style={{ /*width: "3px", */height: "0.5px" }}
                >כאן</Button> לקבלת כל ההצבעות הפעילות עבורך<br/><br/>
                <div className="flex flex-column gap-3">
                            {data.map((option) => {
                                return (
                                    <div key={option.id} className="flex align-items-center">
                                        <RadioButton
                                            inputId={option.id}
                                            name="option"
                                            value={option}
                                            onChange={(e) => {
                                                setSelectedOption(e.value);
                                            }}
                                            checked={selectedOption.id === option.id}
                                        />
                                        <label htmlFor={option.id} className="ml-2">{`${option.description}`}</label>
                                    </div>
                                )
                            })}
                    </div>
                {
                    הotes?.length ?
                        <div className="flex flex-column gap-3">
                            {הotes.map((vote) => {
                                return (
                                    <div key={vote.id} className="flex align-items-center">
                                        <Vote key={vote.id} subject={vote.subject} allVote={vote} /><br /><br /><br /><br /><br />
                                    </div>
                                );
                            })}
                        </div> :<></>
                }
                {/* {
                    entryVotes?.length ?
                    <div className="flex flex-column gap-3">
                        {entryVotes.map((vote) => {
                            return (
                                <div key={vote.id} className="flex align-items-center">
                                    <Vote key={vote.id} subject={vote.subject} allVote={vote} /><br /><br /><br /><br /><br />
                                </div>
                            );
                        })}
                    </div> :<></>
                } */}
                    
                
                {/* <Vote subject={"מי בעד לצבוע את החניון"}/> */}
            </Card>
        </div>
    )
}
