import { Card } from 'primereact/card';
import VoteResult from "./VoteResult"
import React, { useEffect, useState } from "react";
import { fetchData } from '../Hooks/useAxiosGet';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';


const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function VotesResultsScreen(params) {
    const data = [
        { id: -1, description: "לכל הבניין שלך" },
        { id: -2, description: "רק לכניסה שלך" }
    ]

    const [votesWithData, setVotesWithData] = useState(null);
    const [startDate, setStartDate] = useState(null);//new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(null);//new Date().toISOString().slice(0, 10));
    const [selectedOption, setSelectedOption] = useState(data[0]);



    const getVotes = async (url) => {
        const votes = await fetchData(url);
        if (votes) {
            console.log("votes", votes);
            var allData = [];
            votes.forEach(async (element) => {
                const myData = await fetchData(`tenantVote/byVoteId/${element.id}`);
                if (myData) {
                    console.log("myData", myData);
                    allData.push(myData);
                }
            });
            console.log("allData", allData);
            setVotesWithData(allData);
        }
    }

    useEffect(() => { { console.log("votesWithData", votesWithData) } }, [votesWithData])
    useEffect(() => {
        if (selectedOption.id === -1)
            getVotes(`vote/last?building_id=${tenant.building_id}`);
        else if (selectedOption.id === -2)
            getVotes(`vote/last?&entry_id=${tenant.entry_id}`);

    }, [selectedOption])//  בפעם הראשונה ובכל פעם שלוחצים על הכפתור להחליף בין בניין לכניסה 

    useEffect(() => {
        if(startDate &&endDate){
            console.log(`vote/byDates?startDate=${startDate}&endDate=${endDate}`);
            if (selectedOption.id === -1)
                getVotes(`vote/byDates?startDate=${startDate}&endDate=${endDate}&building_id=${tenant.building_id}`);
            else if (selectedOption.id === -2)
                getVotes(`vote/byDates?startDate=${startDate}&endDate=${endDate}&entry_id=${tenant.entry_id}`);
        }
        
    }, [startDate, endDate]) // אם לוחצים על בין שני תאריכים

    return (
        <>
            <Card style={{ width: "70%", margin: "5%" }} title="תוצאות הצבעות" >
                <div style={{ padding: "3%" }}>
                    <div className="flex flex-column gap-3">
                        {data.map((option) => {
                            // debugger;
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
                    </div><br /><br />
                    <div className="card flex justify-content-center">
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value.toISOString().slice(0, 10))} showIcon style={{ direction: "ltr" }} />
                        <span>  </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate(e.value.toISOString().slice(0, 10))} showIcon style={{ direction: "ltr" }} />
                        <span>  </span>
                        {/* <Button type="submit" label="סנן" /> */}
                    </div>
                </div>
                <br /><br />
                {
                    votesWithData?.map(e => {
                        debugger;
                        console.log("e", e);
                        return <VoteResult key={e.id} subject={e.subject + " "} positive={{ description: e.positive, count: e.for }} negative={{ description: e.negative, count: e.against }} neutral={{ description: "נמנע", count: e.avoided }} style={{ margin: "5%" }}></VoteResult>
                    })
                }
            </Card>
        </>
    )
}