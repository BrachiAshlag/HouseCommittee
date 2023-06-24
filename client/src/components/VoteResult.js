
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';

export default function VoteResult(props) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [props.positive.description, props.neutral.description, props.negative.description],
            datasets: [
                {
                    data: [props.positive.count, props.neutral.count, props.negative.count],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--red-400')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--green-400'),
                        documentStyle.getPropertyValue('--yellow-400'),
                        documentStyle.getPropertyValue('--red-400')
                    ]
                }
            ]
        };
        const options = {
            cutout: '60%'
        };

        setChartData(data);
        setChartOptions(options);
    }, []);

    return (
        <>
            {
                (props.positive.count != 0 || props.negative.count != 0 || props.neutral.count != 0) &&
                <div className="card flex justify-content-center">
                    <Card style={{ width: "80%" }} className="card flex justify-content-center">
                        <div className="flex align-items-start justify-content-center" style={{ /*margin: "5%",*/ fontSize: "15pt" }}>{props.subject}</div><br />
                        <Chart className="flex align-items-start justify-content-center" /*style={{ width: "50%"}}*/ type="doughnut" data={chartData} options={chartOptions} />
                    </Card>
                </div>

            }
<br/><br/>
        </>
    )
}
