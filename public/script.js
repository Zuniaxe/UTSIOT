let lastIdx = Math.floor(Math.random() * 900) + 100; 

document.addEventListener('DOMContentLoaded', () => {
    const suhuSlider = document.getElementById('suhu-slider');
    const humidSlider = document.getElementById('humid-slider');
    const kecerahanSlider = document.getElementById('kecerahan-slider');

    const suhuValue = document.getElementById('suhu-value');
    const humidValue = document.getElementById('humid-value');
    const kecerahanValue = document.getElementById('kecerahan-value');

    const addDataBtn = document.getElementById('add-data-btn');

    window.updateSuhuValue = (value) => suhuValue.textContent = value;
    window.updateHumidValue = (value) => humidValue.textContent = value;
    window.updateKecerahanValue = (value) => kecerahanValue.textContent = value;

    addDataBtn.addEventListener('click', () => {
        const suhu = parseInt(suhuSlider.value);
        const humid = parseInt(humidSlider.value);
        const kecerahan = parseInt(kecerahanSlider.value);
        const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        lastIdx = Math.floor(Math.random() * 900) + 100;

        const newData = {
            idx: lastIdx,
            suhu: suhu,
            humid: humid,
            kecerahan: kecerahan,
            timestamp: timestamp
        };

        fetch('/add_suhu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                updateChartAndTable(newData); 
            } else {
                alert('Gagal menambahkan data');
            }
        })
        .catch(error => console.error('Error adding data:', error));
    });

    function updateChartAndTable(newData) {
        chart.data.datasets[0].data.push(newData.suhu);
        chart.data.datasets[1].data.push(newData.humid);
        chart.update();

        const tableBody = document.getElementById('data-table').querySelector('tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${newData.idx}</td>
            <td>${newData.suhu}</td>
            <td>${newData.humid}</td>
            <td>${newData.kecerahan}</td>
            <td>${newData.timestamp}</td>
        `;
        tableBody.appendChild(row);
    }

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const labels = data.nilai_suhu_max_humid_max.map(entry => entry.timestamp);
            const suhuData = data.nilai_suhu_max_humid_max.map(entry => entry.suhu);
            const humidData = data.nilai_suhu_max_humid_max.map(entry => entry.humid);
            const ctx = document.getElementById('myChart').getContext('2d');
            window.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Suhu',
                            data: suhuData,
                            borderColor: '#B735BC',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Kelembapan',
                            data: humidData,
                            borderColor: '#49BEDA',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Nilai'
                            }
                        }
                    }
                }
            });

            const tableBody = document.getElementById('data-table').querySelector('tbody');
            data.nilai_suhu_max_humid_max.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.idx}</td>
                    <td>${entry.suhu}</td>
                    <td>${entry.humid}</td>
                    <td>${entry.kecerahan}</td>
                    <td>${entry.timestamp}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
