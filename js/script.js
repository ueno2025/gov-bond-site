// CSVファイルを読み込み、テーブルとグラフを作成
fetch("csv/kokusai5.csv")
    .then(response => response.text())
    .then(data => {

        const rows = data.trim().split("\n");

        const tableBody = document.getElementById("table-body");

        const labels = [];
        const baseRates = [];
        const taxBeforeRates = [];
        const taxAfterRates = [];

        // ヘッダーを除外
        rows.slice(1).forEach(row => {

            const columns = row.split(",");

            const yearMonth = columns[0];

            const baseRate = Number(columns[1]);
            const taxBeforeRate = Number(columns[2]);
            const taxAfterRate = Number(columns[3]);

            // グラフ用データ
            labels.push(yearMonth);
            baseRates.push(baseRate);
            taxBeforeRates.push(taxBeforeRate);
            taxAfterRates.push(taxAfterRate);


            // テーブル用
            const tr = document.createElement("tr");

            columns.forEach(column => {
                const td = document.createElement("td");
                td.textContent = column;
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });


        // グラフのデータ
        const datasets = [

            {
                label: "基準金利",
                data: baseRates,
                borderWidth: 2,
                tension: 0.1
            },

            {
                label: "利率（税引前）",
                data: taxBeforeRates,
                borderWidth: 2,
                tension: 0.1
            },

            {
                label: "利率（税引後）",
                data: taxAfterRates,
                borderWidth: 2,
                tension: 0.1
            }

        ];


        // グラフ作成
        const chart = new Chart(
            document.getElementById("interest-chart"),
            {
                type: "line",

                data: {
                    labels: labels,
                    datasets: datasets
                },

                options: {
                    scales: {

                        x: {
                            title: {
                                display: true,
                                text: "年月"
                            }
                        },

                        y: {
                            title: {
                                display: true,
                                text: "金利（%）"
                            }
                        }

                    }
                }
            }
        );


        // チェックボックスの変更を監視
        const checkboxes =
            document.querySelectorAll(".chart-options input");

        checkboxes.forEach(checkbox => {

            checkbox.addEventListener("change", () => {

                const index = {
                    baseRate: 0,
                    taxBefore: 1,
                    taxAfter: 2
                };

                const datasetIndex = index[checkbox.value];

                // 表示・非表示を切り替える
                chart.data.datasets[datasetIndex].hidden =
                    !checkbox.checked;

                chart.update();

            });

        });

    });