

const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");


/* メニューを開く */
menuButton.addEventListener("click", () => {

    sideMenu.classList.add("open");
    menuOverlay.classList.add("open");

});


/* 背景をクリックして閉じる */
menuOverlay.addEventListener("click", () => {

    sideMenu.classList.remove("open");
    menuOverlay.classList.remove("open");

});



// テーブル・グラフ処理

const type = document.body.dataset.kokusai;

const csvFile = `../csv/kokusai${type}.csv`;

// CSVファイルを読み込み、テーブルとグラフを作成
fetch(csvFile)
    .then(response => response.text())
    .then(data => {

        const rows = data.trim().split("\n");

        const tableBody = document.getElementById("table-body");

        const labels = [];
        const baseRates = [];
        const taxBeforeRates = [];
        const taxAfterRates = [];

        // テーブル用データを保持
        const tableData = [];


        // -------------------------
        // CSVデータを取得
        // -------------------------

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

            // テーブル用データ
            tableData.push(columns);

        });


        // -------------------------
        // テーブルを表示する関数
        // -------------------------

        function updateTable() {

            const startIndex = labels.indexOf(startDate.value);
            const endIndex = labels.indexOf(endDate.value);

            // 開始年月が終了年月より後の場合
            if (startIndex > endIndex) {
                return;
            }

            // 現在のテーブルを削除
            tableBody.innerHTML = "";

            // 指定期間のデータだけ表示
            const filteredTableData =
                tableData.slice(startIndex, endIndex + 1).reverse();

            filteredTableData.forEach(columns => {

                const tr = document.createElement("tr");

                columns.forEach(column => {

                    const td = document.createElement("td");

                    td.textContent = column;

                    tr.appendChild(td);
                });

                tableBody.appendChild(tr);

            });

        }


        // -------------------------
        // 開始・終了年月の選択肢を作成
        // -------------------------

        const startDate = document.getElementById("start-date");
        const endDate = document.getElementById("end-date");

        labels.forEach(label => {

            const startOption = document.createElement("option");
            startOption.value = label;
            startOption.textContent = label;

            startDate.appendChild(startOption);


            const endOption = document.createElement("option");
            endOption.value = label;
            endOption.textContent = label;

            endDate.appendChild(endOption);

        });


        // 初期値
        startDate.value = labels[0];
        endDate.value = labels[labels.length - 1];


        // 初期テーブル表示
        updateTable();


        // -------------------------
        // グラフ作成
        // -------------------------

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


        const chart = new Chart(
            document.getElementById("interest-chart"),
            {
                type: "line",

                data: {
                    labels: labels,
                    datasets: datasets
                },

                options: {

                    /* 画面サイズに合わせて自動調整 */
                    responsive: true,

                    /* CSSで指定した高さを使用 */
                    maintainAspectRatio: false,

                    /* グラフ全体 */
                    layout: {
                        padding: {
                            top: 10,
                            right: 10,
                            bottom: 10,
                            left: 10
                        }
                    },

                    /* 凡例 */
                    plugins: {
                        legend: {
                            position: "top",

                            labels: {
                                padding: 15,
                                boxWidth: 15,
                                font: {
                                    size: 13
                                }
                            }
                        }
                    },

                    scales: {

                        /* X軸 */
                        x: {
                            title: {
                                display: true,
                                text: "年月"
                            },

                            ticks: {
                                maxTicksLimit: 8,
                                maxRotation: 45,
                                minRotation: 0
                            }
                        },

                        /* Y軸 */
                        y: {
                            title: {
                                display: true,
                                text: "金利（%）"
                            },

                            beginAtZero: false
                        }

                    },

                    /* グラフ上のポイント */
                    elements: {
                        point: {
                            radius: 2,
                            hoverRadius: 5
                        },

                        line: {
                            borderWidth: 2,
                            tension: 0.1
                        }
                    }
                }
            }
        );


        // -------------------------
        // 金利の表示・非表示
        // -------------------------

        const checkboxes =
            document.querySelectorAll(".chart-options input[type='checkbox']");

        checkboxes.forEach(checkbox => {

            checkbox.addEventListener("change", () => {

                const index = {
                    baseRate: 0,
                    taxBefore: 1,
                    taxAfter: 2
                };

                const datasetIndex = index[checkbox.value];

                chart.data.datasets[datasetIndex].hidden =
                    !checkbox.checked;

                chart.update();

            });

        });


        // -------------------------
        // 期間変更
        // -------------------------

        function updateChart() {

            const startIndex = labels.indexOf(startDate.value);
            const endIndex = labels.indexOf(endDate.value);

            // 開始年月が終了年月より後の場合
            if (startIndex > endIndex) {
                return;
            }


            // 指定された期間だけ取得
            const filteredLabels =
                labels.slice(startIndex, endIndex + 1);

            const filteredBaseRates =
                baseRates.slice(startIndex, endIndex + 1);

            const filteredTaxBeforeRates =
                taxBeforeRates.slice(startIndex, endIndex + 1);

            const filteredTaxAfterRates =
                taxAfterRates.slice(startIndex, endIndex + 1);


            // グラフを更新
            chart.data.labels = filteredLabels;

            chart.data.datasets[0].data =
                filteredBaseRates;

            chart.data.datasets[1].data =
                filteredTaxBeforeRates;

            chart.data.datasets[2].data =
                filteredTaxAfterRates;

            chart.update();


            // テーブルも更新
            updateTable();

        }


        // -------------------------
        // 開始年月・終了年月が変更されたら更新
        // -------------------------

        startDate.addEventListener("change", updateChart);
        endDate.addEventListener("change", updateChart);

    });