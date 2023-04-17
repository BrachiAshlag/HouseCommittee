
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

export default function VoteResult(params) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
            labels: [params.positive.description, params.neutral.description, params.negative.description],
            datasets: [
                {
                    data: [params.positive.count, params.neutral.count, params.negative.count],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--blue-500'), 
                        documentStyle.getPropertyValue('--yellow-500'), 
                        documentStyle.getPropertyValue('--green-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--blue-400'), 
                        documentStyle.getPropertyValue('--yellow-400'), 
                        documentStyle.getPropertyValue('--green-400')
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
        <div className="card flex justify-content-center">
            <div style={{margin: "5%"}}>{params.subject}</div>
            <Chart style={{width: "30%", marginLeft: "30%"/*, marginRight: "auto"*/}} type="doughnut" data={chartData} options={chartOptions} />
            <br/>
        </div>
        
    )
}
        