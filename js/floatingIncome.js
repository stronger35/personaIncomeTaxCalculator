window.onload = function () {
    var currentMonth = new Date().getMonth() + 1;
    document.getElementById('months').value = currentMonth;
    generateToolbarAndResultTable();
}

var preTaxIncomeArr = new Array();//税前收入数组
var insuranceArr = new Array();//五险一金数组
var specialDeductionArr = new Array();//专项扣除数组

/**
 *  选择要计算的前几个月，重新加载收入信息工具栏
 */
function changeToolbar() {
    var tbEle = document.getElementById('floatingIncomeInfo');
    tbEle.innerHTML = '';
    generateToolbarAndResultTable();
}

function generateToolbarAndResultTable() {
    var months = document.getElementById('months').value;
    var isFixedInsurance = document.getElementById('isFixedInsurance').value;
    var isFixedSpecialDeduction = document.getElementById('isFixedSpecialDeduction').value;

    var ths = '<th style="width: 4rem;"></th>';//标题行
    var tds_preTaxIncome = '<td>税前收入</td>';//税前收入行
    var tds_insurance = '<td>五险一金</td>';//五险一金行
    var tds_specialDeduction= '<td>专项扣除</td>';//专项扣除行
    var resultThs = '<th style="width: 5rem;">';//结果列表标题行

    for (var i = 1; i <= months; i++) {
        ths += '<th>' + i + '月</th>';
        tds_preTaxIncome += '<td><input id="month_' + i +'"/></td>';

        if (isFixedInsurance == '2') {
            tds_insurance += '<td><input/></td>';
        }
        if (isFixedSpecialDeduction == '2') {
            tds_specialDeduction += '<td><input/></td>';
        }

        resultThs += '<th>' + i + '月</th>';
    }
    resultThs += '<th>合计</th>';

    if (isFixedInsurance == '1') {
        tds_insurance += '<td colspan="' + months + '"><input/></td>';
    }
    if (isFixedSpecialDeduction == '1') {
        tds_specialDeduction += '<td colspan="' + months + '"><input/></td>';
    }

    var thead = document.createElement('tr');
    thead.innerHTML = ths;
    var tr_preTaxIncome = document.createElement('tr');
    tr_preTaxIncome.id = 'preTaxIncomeTrs';
    tr_preTaxIncome.innerHTML = tds_preTaxIncome;
    var tr_insurance = document.createElement('tr');
    tr_insurance.id = 'insuranceTrs';
    tr_insurance.innerHTML = tds_insurance;
    var tr_specialDeduction = document.createElement('tr');
    tr_specialDeduction.id = 'specialDeductionTrs';
    tr_specialDeduction.innerHTML = tds_specialDeduction;

    var tbEle = document.getElementById('floatingIncomeInfo');
    tbEle.appendChild(thead);
    tbEle.appendChild(tr_preTaxIncome);
    tbEle.appendChild(tr_insurance);
    tbEle.appendChild(tr_specialDeduction);

    var resultThead = document.createElement('tr');
    resultThead.innerHTML = resultThs;
    var resultTable = document.getElementById('floatingIncome_tb');
    resultTable.innerHTML = '';
    resultTable.appendChild(resultThead);
}

/**
 * 选择五险一金是否固定
 */
function changeToolbar_insurance() {
    var months = document.getElementById('months').value;
    var isFixedInsurance = document.getElementById('isFixedInsurance').value;

    var tds_insurance = '<td>五险一金</td>';//五险一金行
    if (isFixedInsurance == '1') {
        tds_insurance += '<td colspan="' + months + '"><input/></td>';
    } else if (isFixedInsurance == '2') {
        for (var i = 1; i <= months; i++) {
            tds_insurance += '<td><input/></td>';
        }
    }

    var insuranceTrsEle = document.getElementById('insuranceTrs');

    var tr_insurance = document.createElement('tr');
    tr_insurance.id = 'insuranceTrs';
    tr_insurance.innerHTML = tds_insurance;

    var tbEle = document.getElementById('floatingIncomeInfo');
    tbEle.replaceChild(tr_insurance, insuranceTrsEle);
}

/**
 * 选择专项扣除是否固定
 */
function changeToolbar_specialDeduction() {
    var months = document.getElementById('months').value;
    var isFixedSpecialDeduction = document.getElementById('isFixedSpecialDeduction').value;

    var tds_specialDeduction = '<td>专项扣除</td>';//专项扣除行
    if (isFixedSpecialDeduction == '1') {
        tds_specialDeduction += '<td colspan="' + months + '"><input/></td>';
    } else if (isFixedSpecialDeduction == '2') {
        for (var i = 1; i <= months; i++) {
            tds_specialDeduction += '<td><input/></td>';
        }
    }

    var specialDeductionTrsEle = document.getElementById('specialDeductionTrs');

    var tr_specialDeduction = document.createElement('tr');
    tr_specialDeduction.id = 'specialDeductionTrs';
    tr_specialDeduction.innerHTML = tds_specialDeduction;

    var tbEle = document.getElementById('floatingIncomeInfo');
    tbEle.replaceChild(tr_specialDeduction, specialDeductionTrsEle);
}

/**
 * 月收入非固定-重置
 */
function resetIncomeTax_floating() {
    var inputEle = document.getElementById('floatingIncomeInfo').getElementsByTagName('input');
    for (var i = 0; i < inputEle.length; i++) {
        inputEle[i].value = '';
    }

    clearList(document.getElementById('floatingIncome_tb'));
}

/**
 * 月收入非固定-计算按钮
 */
function calculateIncomeTax_floating() {
    preTaxIncomeArr.splice(0, preTaxIncomeArr.length);
    insuranceArr.splice(0, insuranceArr.length);
    specialDeductionArr.splice(0, specialDeductionArr.length);

    if (!checkFloatingIncomeParams()) {
        return;
    }

    var months = document.getElementById('months').value;
    var isFixedInsurance = document.getElementById('isFixedInsurance').value;
    var isFixedSpecialDeduction = document.getElementById('isFixedSpecialDeduction').value;

    clearList(document.getElementById('floatingIncome_tb'));

    //新政策个税
    calculateIncomeTax_floating_new(months, isFixedInsurance, isFixedSpecialDeduction);
    //旧政策个税
    calculateIncomeTax_floating_old(months, isFixedInsurance, isFixedSpecialDeduction);

}

/**
 * 月收入非固定-计算前检查输入参数
 * @returns {boolean}
 */
function checkFloatingIncomeParams() {
    var preTaxIncomeTrsEle = document.getElementById('preTaxIncomeTrs').getElementsByTagName('input');
    for (var i = 0; i < preTaxIncomeTrsEle.length; i++) {
        var preTaxIncome = preTaxIncomeTrsEle[i].value;
        if (!preTaxIncome || isNaN(preTaxIncome)) {
            alert('请检查税前收入栏是否填写完整且合法数字');
            return false;
        }

        preTaxIncome = Number(preTaxIncome) || 0;
        preTaxIncomeArr.push(preTaxIncome);
    }

    var insuranceTrsEle = document.getElementById('insuranceTrs').getElementsByTagName('input');
    for (var i = 0; i < insuranceTrsEle.length; i++) {
        var insurance = insuranceTrsEle[i].value;
        if (isNaN(insurance)) {
            alert('五险一金栏含有非合法数字');
            return false;
        }

        insurance = Number(insurance) || 0;
        insuranceArr.push(insurance);
    }

    var specialDeductionTrsEle = document.getElementById('specialDeductionTrs').getElementsByTagName('input');
    for (var i = 0; i < specialDeductionTrsEle.length; i++) {
        var specialDeduction = specialDeductionTrsEle[i].value;
        if (isNaN(specialDeduction)) {
            alert('专项扣除栏含有非合法数字');
            return false;
        }

        specialDeduction = Number(specialDeduction) || 0;
        specialDeductionArr.push(specialDeduction);
    }
    return true;
}

/**
 *  旧政策个税-非固定收入
 */
function calculateIncomeTax_floating_old(months, isFixedInsurance, isFixedSpecialDeduction) {
    var taxTds_oldRule = '<td>旧政策个税</td>';
    var afterTaxTds_oldRule = '<td>旧政策税后</td>';

    var incomeTaxTotal = 0;
    var afterTaxIncomeTaxTotal = 0;

    for (var i = 0; i < months; i++) {
        var preTaxIncome = preTaxIncomeArr[i];
        var insurance = (isFixedInsurance == '1') ? insuranceArr[0] : insuranceArr[i];
        var specialDeduction = (isFixedSpecialDeduction == '1') ?specialDeductionArr[0] :specialDeductionArr[i];
        var taxableIncome = preTaxIncome - insurance - specialDeduction - criticalLine;
        // console.log('preTaxIncome:' + preTaxIncomeArr[i] + '; insurance:' + insurance + '; specialDeduction:' + specialDeduction + '; taxableIncome:' + taxableIncome);

        var incomeTaxCurrentMonth = calculateIncomeTaxCurrentMonth_oldRule(taxableIncome);
        var afterTaxIncomeTaxCurrentMonth = preTaxIncome - insurance - incomeTaxCurrentMonth;
        incomeTaxTotal += incomeTaxCurrentMonth;
        afterTaxIncomeTaxTotal += afterTaxIncomeTaxCurrentMonth;

        taxTds_oldRule += '<td>' + incomeTaxCurrentMonth.toFixed(2) + '</td>';
        afterTaxTds_oldRule += '<td>' + afterTaxIncomeTaxCurrentMonth.toFixed(2) + '</td>';
    }
    taxTds_oldRule += '<td>' + incomeTaxTotal.toFixed(2) + '</td>';
    afterTaxTds_oldRule += '<td>' + afterTaxIncomeTaxTotal.toFixed(2) + '</td>';

    var taxTr_oldRule = document.createElement('tr');
    taxTr_oldRule.innerHTML = taxTds_oldRule;

    var afterTaxTr_oldRule = document.createElement('tr');
    afterTaxTr_oldRule.innerHTML = afterTaxTds_oldRule;

    var fixedIncome_tb = document.getElementById('floatingIncome_tb');
    fixedIncome_tb.appendChild(taxTr_oldRule);
    fixedIncome_tb.appendChild(afterTaxTr_oldRule);
}

/**
 * 新政策个税-非固定收入
 */
function calculateIncomeTax_floating_new(months, isFixedInsurance, isFixedSpecialDeduction) {
    var taxableIncomeTotal = 0;//累计年应纳税所得额
    var incomeTaxtotal = 0;//累计年缴纳个税
    var afterTaxIncomeTaxTotal = 0;//累计税后年收入

    var taxTds_newRule = '<td>新政策个税</td>';
    var afterTaxTds_newRule = '<td>新政策税后</td>';
    for (var i = 0; i < months; i++) {
        var preTaxIncome = preTaxIncomeArr[i];
        var insurance = (isFixedInsurance == '1') ? insuranceArr[0] : insuranceArr[i];
        var specialDeduction = (isFixedSpecialDeduction == '1') ?specialDeductionArr[0] :specialDeductionArr[i];
        var taxableIncome = preTaxIncome - insurance - specialDeduction - criticalLine;

        taxableIncomeTotal += taxableIncome;
        var incomeTaxCurrentMonth = calculateIncomeTaxCurrentMonth_newdRule(taxableIncomeTotal) - incomeTaxtotal;
        incomeTaxCurrentMonth = (incomeTaxCurrentMonth >= 0) ? incomeTaxCurrentMonth : 0;
        incomeTaxtotal += incomeTaxCurrentMonth;
        taxTds_newRule += '<td>' + incomeTaxCurrentMonth.toFixed(2) + '</td>';

        var afterTaxIncomeTaxCurrentMonth = preTaxIncome - insurance - incomeTaxCurrentMonth;
        afterTaxIncomeTaxTotal += afterTaxIncomeTaxCurrentMonth;
        afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxCurrentMonth.toFixed(2) + '</td>';
    }
    taxTds_newRule += '<td>' + incomeTaxtotal.toFixed(2) + '</td>';
    afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxTotal.toFixed(2) + '</td>';


    var taxTr_newRule = document.createElement('tr');
    taxTr_newRule.innerHTML = taxTds_newRule;
    var afterTaxTr_newRule = document.createElement('tr');
    afterTaxTr_newRule.innerHTML = afterTaxTds_newRule;

    var fixedIncome_tb = document.getElementById('floatingIncome_tb');
    fixedIncome_tb.appendChild(taxTr_newRule);
    fixedIncome_tb.appendChild(afterTaxTr_newRule);
}