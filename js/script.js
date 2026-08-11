
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