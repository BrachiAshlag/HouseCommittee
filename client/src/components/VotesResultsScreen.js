import { Card } from 'primereact/card';
import VoteResult from "./VoteResult"
import React, { useContext, useEffect, useState } from "react";
import { fetchData } from '../Hooks/useAxiosGet';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import UserContext from './UserContext';


// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function VotesResultsScreen(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const data = [
        { id: -1, description: "הצבעות עבור דיירי כל הבניין שלך" },
        { id: -2, description: "הצבעות עבור דיירי הכניסה שלך בלבד" }
    ]

    const [votesWithData, setVotesWithData] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selectedOption, setSelectedOption] = useState(data[0]);



    const getVotes = async (url) => {

        const votes = await fetchData(url);
        if (votes) {
            var allData = [];
            for (let index = 0; index < votes.length; index++) {
                const myData = await fetchData(`tenantVote/byVoteId/${votes[index].id}`);
                if (myData) {
                    allData.push(myData);
                }
            }
            setVotesWithData(allData);
        }
    }

    useEffect(() => {
        setStartDate(null);
        setEndDate(null);

        if (selectedOption.id === -1)
            getVotes(`vote/last?building_id=${tenant?.building_id}`);
        else if (selectedOption.id === -2)
            getVotes(`vote/last?&entry_id=${tenant?.entry_id}`);
    }, [selectedOption])

    useEffect(() => {
        if (startDate && endDate) {
            if (selectedOption.id === -1)
                getVotes(`vote/byDates?startDate=${startDate}&endDate=${endDate}&building_id=${tenant?.building_id}`);
            else if (selectedOption.id === -2)
                getVotes(`vote/byDates?startDate=${startDate}&endDate=${endDate}&entry_id=${tenant?.entry_id}`);
        }

    }, [startDate, endDate])

    return (
        <>
            <div className="card flex justify-content-center">
                <Card style={{ width: "800px" }} title="תוצאות הצבעות" >
                    <div style={{ padding: "3%" }}>
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
                        <br />
                        <h4>נתן להזין את טווח התאריכים הרצוי להצבעות</h4>
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span>  </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span>  </span>
                    </div>

                    {
                        votesWithData?.map(e => {
                            return <VoteResult key={e.id} subject={e.subject + " "} positive={{ description: e.positive, count: e.for }} negative={{ description: e.negative, count: e.against }} neutral={{ description: "נמנע", count: e.avoided }} style={{ margin: "5%" }}></VoteResult>
                        })
                    }
                </Card>
            </div>
        </>
    )
}