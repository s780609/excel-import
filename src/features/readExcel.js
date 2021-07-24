import XLSX from "xlsx";

function ReadExcel(files) {
    return new Promise(resolve => {
        parseExcel(files[0]).then(excelData => {

            // verify data
            if (excelData[0].sheetData.length == 0) {
                alert("Excel Contains No Data");
            }

            var firstSheetRows = excelData[0].sheetData;

            var columns = getColumnsForTable(firstSheetRows);
            var data = getDataForTable(firstSheetRows);
            var entityNames = getEntityNames(firstSheetRows);
            var logicalNames = getColumnLogicalNames(firstSheetRows);
            var displayNames = getColumnDisplayNames(firstSheetRows);

            resolve({ columns, data, entityNames, logicalNames, displayNames });
        });
    });
}

function parseExcel(file) {
    return new Promise((resolve, reject) => {

        // [ { sheetName: "", sheetData: [] } ];
        var excelResults = [];

        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });

            // sheetName: "lux_quoterouteoprmaincostequipm"
            // sheetData: [
            // 0: (7) ["lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincostequipment", "lux_quoterouteoprmaincostequipment", "lux_quoterouteoprmaincostequipment"],
            // 1: (7) ["lux_lineitemnum", "lux_station", "lux_cycletime", "lux_op", "lux_equipmentid", "lux_qty", "lux_category"],
            // 2: (7) ["工站序号", "工站名称", "周期", "人数", "设备名称", "数量", "投资明细"],
            // 3: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-200929-0007", "1.00", "通用设备"],
            // 4: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-200929-0005", "1.00", "定制设备"],
            // 5: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-201016-0002", "1.00", "治具"],
            // 6: (7) ["2", "RF", "1.00", "2.00", "EF-201116-0004", "1.00", "通用设备"],
            // 7: (7) ["2", "RF", "1.00", "2.00", "EF-200929-0035", "1.00", "定制设备"],
            // 8: (7) ["2", "RF", "1.00", "2.00", "EF-200929-0020", "1.00", "治具"] ]
            workbook.SheetNames.forEach(function (sheetName) {
                var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { range: 0, header: 1 });
                // 刪掉 isrequired, datatype 那兩　Row
                sheetData.splice(3, 2);
                excelResults.push({ sheetName: sheetName, sheetData: sheetData });
            });

            resolve(excelResults);
        };

        reader.onerror = function (ex) {
            console.log(ex);
            reject(ex);
        };

        reader.readAsBinaryString(file);
    });
};

// 把 
//  2: (7) ["工站序号", "工站序号", "周期", "人数", "设备名称", "数量", "投资明细"],
// 轉成
// [ 
//  { title: "工站序号", visible: true }, 
//  { title: "工站序号", visible: true }, ... ]
function getColumnsForTable(firstSheetRows) {
    if (firstSheetRows[2] == null) {
        alert("錯誤的模板/WrongTemplate");
    }
    var columns = firstSheetRows[2].map(x => ({ title: x, visible: true }));
    return columns;
}

// ["lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincost", "lux_quoterouteoprmaincostequipment", ...]
function getEntityNames(firstSheetRows) {
    return firstSheetRows[0];
}

// ["lux_lineitemnum", "lux_station", "lux_cycletime", "lux_op", "lux_equipmentid", "lux_qty", "lux_category"]
function getColumnLogicalNames(firstSheetRows) {
    return firstSheetRows[1];
}

//  回傳 ["工站序号", "工站序号", "周期", "人数", "设备名称", "数量", "投资明细"],
function getColumnDisplayNames(firstSheetRows) {
    return firstSheetRows[2];
}

// 回傳
// 3: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-200929-0007", "1.00", "通用设备"],
// 4: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-200929-0005", "1.00", "定制设备"],
// 5: (7) ["1", "FEEDBAR UPLOAD", "3.80", "1.00", "EF-201016-0002", "1.00", "治具"],
// 6: (7) ["2", "RF", "1.00", "2.00", "EF-201116-0004", "1.00", "通用设备"],
// 7: (7) ["2", "RF", "1.00", "2.00", "EF-200929-0035", "1.00", "定制设备"],
// 8: (7) ["2", "RF", "1.00", "2.00", "EF-200929-0020", "1.00", "治具"] ]
function getDataForTable(firstSheetRows) {
    var dataForTable = [];
    var rowLength = 0;
    firstSheetRows.forEach((row, index) => {
        // skip first three rows
        if (index < 3) {
            // 用第一row的legnth當標準
            // 因為如果有空值，row的長度不一定滿15
            if (index == 1) {
                rowLength = row.length;
            }
            return;
        }

        // for (var i = 0; i < rowLength; i++) {
        //     var cell = row[i];
        //     if (cell === undefined) {
        //         row[i] = null;
        //     }
        //     if (cell != null && cell.length == 12 && !isNaN(Number(cell))) {
        //         row[i] = Math.round((Number(cell) + Number.EPSILON) * 10000) / 10000;
        //     }
        // }

        dataForTable.push(row);
    });

    return dataForTable;
}

export default ReadExcel;