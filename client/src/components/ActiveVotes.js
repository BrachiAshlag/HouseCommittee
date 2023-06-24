
import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import Vote from './Vote';
import { fetchData } from '../Hooks/useAxiosGet';
// import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import UserContext from './UserContext';
import { Button } from 'primereact/button';

// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function ActiveVotes() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));

    const data = [
        { id: -1, description: "הצבעות עבור דיירי כל הבניין שלך" },
        { id: -2, description: "הצבעות עבור דיירי הכניסה שלך בלבד" }
    ]

    const [votes, setVotes] = useState(null);
    const [selectedOption, setSelectedOption] = useState(data[0]);

    const getVoteType = async (url) => {
        const data = await fetchData(url);
        if (data)
            return data;
    }

    const getVotes = async (url) => {

        const myData = await fetchData(url);
        var allData = []
        if (myData) {
            for (let i = 0; i < myData.length; i++) {
                var element = myData[i];
                const vote_type = await getVoteType(`voteType/${element.vote_type_id}`);
                if (vote_type) {
                    element.negative = vote_type.negative;
                    element.positive = vote_type.positive;
                    allData = [...allData, element];
                }
            }
            setVotes(allData);
        }
    }

    useEffect(() => {
        // if(tenant?.id!=null){
        if (selectedOption.id === -1) {
            getVotes(`vote/relevant?building_id=${tenant?.building_id}&tenant_id=${tenant?.id}`);
        }
        else if (selectedOption.id === -2) {
            getVotes(`vote/relevant?entry_id=${tenant?.entry_id}&tenant_id=${tenant?.id}`);
            // }
        }
    }, [selectedOption, tenant])

    return (
        <div className="card flex justify-content-center">
            <Card title="הצבעות" style={{ width: "600px" }}>
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
                    <br />
                </div>
                <div>נתן ללחוץ <Button
                    text
                    onClick={() => {

                        if (selectedOption.id === -1) {
                            getVotes(`vote/active?building_id=${tenant?.building_id}&tenant_id=${tenant?.id}`)
                        }
                        else {
                            getVotes(`vote/active?entry_id=${tenant?.entry_id}&tenant_id=${tenant?.id}`)
                        }
                    }}
                    style={{ height: "20px"/* , width: "25px"*/, fontSize: "1.2rem" }}
                >כאן</Button> לקבלת כל ההצבעות הפעילות בקטגוריה שבחרת</div><br />
                {
                    <div className="flex flex-column gap-3">
                        {votes?.map((vote) => {
                            return (
                                <div key={vote.id} className="flex align-items-center">
                                    <Vote key={vote.id} subject={vote.subject} positive={vote.positive} negative={vote.negative} allVote={vote} end_date={vote.end_date} /><br /><br /><br />
                                </div>
                            );
                        })}
                    </div>
                }
            </Card>
        </div>
    )
}
