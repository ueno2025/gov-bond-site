

// CSVファイルを読み込み。テーブルを作成
fetch("csv/kokusai5.csv")
    .then(response => response.text())
    .then(data => {

        const rows = data.trim().split("\n");
        const tableBody = document.getElementById("table-body");

        // 1行目（ヘッダー）を除外
        rows.slice(1).reverse().forEach(row => {

            const columns = row.split(",");

            const tr = document.createElement("tr");

            columns.forEach(column => {
                const td = document.createElement("td");
                td.textContent = column;
                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });
    });