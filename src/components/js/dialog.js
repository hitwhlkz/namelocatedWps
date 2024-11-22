import Util from "./util.js";

// 工具函数：判断字符串是否为中文姓名
// 规则：至少包含两个或以上的中文字符
function isChineseName(name) {
    const regex = /^[\u4e00-\u9fa5]{2,}$/;
    return regex.test(name);
}

// 工具函数：检查给定中文姓名的拼音首字母是否匹配输入的首字母
// 参数：chineseName - 中文姓名；initials - 用户输入的拼音首字母
function pinyinMatch(chineseName, initials) {
    const pinyin = Util.getPinyin(chineseName); // 调用 Util 模块的 getPinyin 方法
    const firstLetters = pinyin.map((p) => p.charAt(0).toLowerCase()).join(""); // 获取拼音首字母并拼接成字符串
    return firstLetters.startsWith(initials.toLowerCase()); // 比较用户输入和拼音首字母
}


// 参数：param - 附加参数
function onbuttonclick(param) {
    // alert(`参数: ${JSON.stringify(param)}`);
    if (!param) {
        alert("请输入拼音首字母");
        return;
    }

    let curSheet = window.Application.ActiveSheet;
    if (!curSheet) {
        alert("当前没有激活的工作表");
        return;
    }

    let rows = curSheet.UsedRange.Rows.Count; // 获取行数
    let cols = curSheet.UsedRange.Columns.Count; // 获取列数
    let matches = []; // 存储匹配项
    let currentMatchIndex = -1; // 当前匹配项的索引

    // 遍历所有单元格，查找匹配的姓名
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            let cellValue = curSheet.Cells.Item(r, c).Text; // 获取单元格内容

            // 判断是否为中文姓名，并匹配拼音首字母
            if (isChineseName(cellValue) && pinyinMatch(cellValue, param)) {
                // 检查是否已经匹配过这个单元格
                if (!matches.some(match => match.row === r && match.col === c)) {
                    matches.push({ row: r, col: c, name: cellValue }); // 存储匹配的姓名信息
                }
            }
        }
    }

    // 如果找到了匹配项，激活第一个匹配的单元格
    if (matches.length > 0) {
        currentMatchIndex = 0; // 定位到第一个匹配项
        let firstMatch = matches[0];
        curSheet.Cells.Item(firstMatch.row, firstMatch.col).Activate(); // 激活第一个匹配的单元格
        // alert(`找到 ${matches.length} 个匹配结果，已定位到第一个匹配：${firstMatch.name}`);
        // alert(`匹配结果为${JSON.stringify(matches)}`);

        // 返回匹配的数量和当前匹配项的索引
        return { count: matches.length, foundIndex: currentMatchIndex, matches: matches };
    } else {
        alert("未找到符合条件的姓名");
        return { count: 0, foundIndex: -1, matches: [] };
    }
}

// 定位下一个或上一个匹配项
function navigateMatch(param) {
    if (!param || typeof param !== "object" || !param.direction || !param.matches || param.currentMatchIndex === undefined) {
        alert("参数错误，无法定位匹配项");
        return;
    }

    let { direction, matches, currentMatchIndex } = param;

    // 根据方向 (上或下) 计算新的索引
    let newIndex = currentMatchIndex;

    if (direction === "next") {
        newIndex = (currentMatchIndex + 1) % matches.length; // 下一个匹配
    } else if (direction === "previous") {
        newIndex = (currentMatchIndex - 1 + matches.length) % matches.length; // 上一个匹配
    } else {
        alert("方向参数无效，必须是 'next' 或 'previous'");
        return;
    }

    // 激活新的匹配项
    let newMatch = matches[newIndex];
    let curSheet = window.Application.ActiveSheet;
    if (curSheet) {
        curSheet.Cells.Item(newMatch.row, newMatch.col).Activate(); // 定位到新的匹配单元格
        // alert(`已定位到第 ${newIndex + 1} 个匹配：${newMatch.name}`);
    }

    // 返回新的匹配项索引
    return { count: matches.length, foundIndex: newIndex };
}

function gradeLocated() {
    let curSheet = window.Application.ActiveSheet; // 获取当前激活的工作表
    if (!curSheet) {
        alert("当前没有激活的工作表");
        return null;
    }

    let rows = curSheet.UsedRange.Rows.Count; // 获取总行数
    let cols = curSheet.UsedRange.Columns.Count; // 获取总列数

    // 遍历表格中的每个单元格
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            let cellValue = curSheet.Cells.Item(r, c).Text; // 获取单元格内容
            if (cellValue && cellValue.includes("成绩")) {
                return c; // 立即返回第一个找到的列号
            }
        }
    }

    alert("未找到包含“成绩”的列");
    return null; // 未找到时返回 null
}

function gradesubmit(param) {
    if (!param ) {
        alert("参数无效，请传入行号和成绩数组");
        return;
    }

    let curSheet = window.Application.ActiveSheet; // 获取当前激活的工作表
    if (!curSheet) {
        alert("当前没有激活的工作表");
        return;
    }

    let gradeColumn = gradeLocated(); // 获取第一个包含“成绩”的列号
    if (!gradeColumn) {
        alert("未找到包含“成绩”的列，无法录入成绩");
        return;
    }
    let { row, grade } = param
    curSheet.Cells.Item(row, gradeColumn).Formula = grade;
    // for (let { row, grade } of param) {
    //     if (!row || typeof grade !== "number") {
    //         console.error(`无效参数：行号 ${row} 或成绩 ${grade}`);
    //         continue;
    //     }
    //     // 写入到对应单元格
    //     try {
    //         curSheet.Cells.Item(row, gradeColumn).Value = grade;
    //         console.log(`录入成绩：行 ${row}, 列 ${gradeColumn}, 成绩 ${grade}`);
    //     } catch (error) {
    //         console.error(`录入失败：行 ${row}, 列 ${gradeColumn}, 错误信息：${error}`);
    //     }
    // }
}


export default {
    onbuttonclick,
    navigateMatch,
    gradesubmit,
};
