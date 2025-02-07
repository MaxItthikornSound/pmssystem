import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const Curvechart = ({ DepartmentID, Data }) => {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        const filteredData = Data.filter((item) => item.DepartmentID === DepartmentID); // กรองข้อมูลที่มี DepartmentID ตรงกับที่ส่งมา
        const part1Data = filteredData.map((data) => data.TotalPart1Manager); // นำค่า TotalPart1 และ TotalPart2 มาใช้
        const part2Data = filteredData.map((data) => data.TotalPart2Manager)
        const labels = Array.from({ length: filteredData.length }, (_, i) => i + 1); // สร้าง labels ตามจำนวนข้อมูล
        if (chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Part 1', // Part 1
                            data: part1Data, // ข้อมูลของ Part 1
                            borderColor: 'rgba(54, 162, 235, 1)', // สีน้ำเงิน
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                        },
                        {
                            label: 'Part 2', // Part 2
                            data: part2Data, // ข้อมูลของ Part 2
                            borderColor: 'rgba(255, 99, 132, 1)', // สีแดง
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    },
                    scales: {
                    y: {
                        beginAtZero: true, // เริ่ม Y ที่ 0
                        ticks: {
                            stepSize: 1, // ให้มี step ขึ้นทีละ 1
                        },
                        title: {
                            display: true,
                            text: 'คะแนน (1-5)',
                        },
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'จำนวนคน',
                        },
                    },
                    },
                },
            });
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [Data]);

    return <canvas ref={chartContainer} className="curvechart"></canvas>;
};
