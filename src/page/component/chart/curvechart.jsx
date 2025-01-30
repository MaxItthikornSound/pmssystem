import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const Curvechart = () => {
  const chartContainer = useRef(null); // ใช้ useRef สำหรับ canvas
  const chartInstance = useRef(null);  // ใช้ useRef สำหรับเก็บ instance ของ chart

  useEffect(() => {
    if (chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');
      // สร้าง chart instance ถ้ายังไม่มี
      if (!chartInstance.current) {
        chartInstance.current = new Chart(ctx, {
          type: 'line', // ประเภทของกราฟ
          data: {
            labels: [1, 2, 3, 4, 5], // แกน X
            datasets: [
              {
                label: 'Sales Data', // ชื่อชุดข้อมูล
                data: [0, 3, 13, 2, 0], // ค่าของแต่ละจุดบนแกน Y
                borderColor: 'rgba(54, 162, 235, 1)', // สีเส้น
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // สีพื้นหลังของพื้นที่เส้น
                borderWidth: 2, // ความหนาของเส้น
                tension: 0.5, // ความโค้งของเส้น (0 = เส้นตรง, 1 = โค้งมาก)
                fill: false, // เติมสีพื้นที่ใต้กราฟ
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
                beginAtZero: true, // เริ่มแกน Y จาก 0
              },
            },
          },
        });
      }
    }

    return () => {
      // ลบกราฟเมื่อ component ถูก unmount
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // คืนค่า canvas เพื่อให้ ref ถูกเชื่อมต่อกับ DOM element
  return <canvas ref={chartContainer} className="curvechart"></canvas>;
};
