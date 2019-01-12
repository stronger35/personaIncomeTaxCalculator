/**
 * 月收入固定-计算按钮
 */
function calculateIncomeTax_fixed() {
    var preTaxIncome = document.getElementById('preTaxIncome').value;
    var insurance = document.getElementById('insurance').value;
    var specialDeduction = document.getElementById('specialDeduction').value;

    if (!preTaxIncome || isNaN(preTaxIncome)) {
        alert('税前收入为空或非合法数字');
        return;
    }
    if (isNaN(insurance)) {
        alert('五险一金为非合法数字');
        return;
    }
    if (isNaN(specialDeduction)) {
        alert('专项扣除为非合法数字');
        return;
    }
    preTaxIncome = Number(preTaxIncome) || 0;
    insurance = Number(insurance) || 0;
    specialDeduction = Number(specialDeduction) || 0;
    var taxableIncome = preTaxIncome - insurance - specialDeduction - criticalLine;//应纳税所得额

    var incomeInfo = {
        "preTaxIncome" : preTaxIncome,
        "insurance" : insurance,
        "specialDeduction" : specialDeduction,
        "taxableIncome" : taxableIncome
    };

    clearList(document.getElementById('fixedIncome_tb'));

    //新政策个税
    calculateIncomeTax_fixed_new(incomeInfo, 'fixedIncome_tb');

    //旧政策个税
    calculateIncomeTax_fixed_old(incomeInfo, 'fixedIncome_tb');
}

/**
 *  旧政策个税-固定收入
 * @param incomeInfo 收入信息json对象
 */
function calculateIncomeTax_fixed_old(incomeInfo) {

    var incomeTaxPerMonth = calculateIncomeTaxCurrentMonth_oldRule(incomeInfo.taxableIncome);
    var afterTaxIncomeTaxPerMonth = incomeInfo.preTaxIncome - incomeInfo.insurance - incomeTaxPerMonth;

    var taxTds_oldRule = '<td>旧政策个税</td>';
    var afterTaxTds_oldRule = '<td>旧政策税后</td>';
    for (var i = 0; i < 12; i++) {
        taxTds_oldRule += '<td>' + incomeTaxPerMonth.toFixed(2) + '</td>';
        afterTaxTds_oldRule += '<td>' + afterTaxIncomeTaxPerMonth.toFixed(2) + '</td>';
    }
    taxTds_oldRule += '<td>' + (incomeTaxPerMonth * 12).toFixed(2) + '</td>';
    afterTaxTds_oldRule += '<td>' + (afterTaxIncomeTaxPerMonth * 12).toFixed(2) + '</td>';

    var taxTr_oldRule = document.createElement('tr');
    taxTr_oldRule.innerHTML = taxTds_oldRule;

    var afterTaxTr_oldRule = document.createElement('tr');
    afterTaxTr_oldRule.innerHTML = afterTaxTds_oldRule;

    var fixedIncome_tb = document.getElementById('fixedIncome_tb');
    fixedIncome_tb.appendChild(taxTr_oldRule);
    fixedIncome_tb.appendChild(afterTaxTr_oldRule);
}

/**
 * 新政策个税-固定收入
 * @param incomeInfo 收入信息json对象
 */
function calculateIncomeTax_fixed_new(incomeInfo) {
    var taxableIncomeTotal = 0;//累计年应纳税所得额
    var incomeTaxtotal = 0;//累计年缴纳个税
    var afterTaxIncomeTaxTotal = 0;//累计税后年收入

    var taxTds_newRule = '<td>新政策个税</td>';
    var afterTaxTds_newRule = '<td>新政策税后</td>';
    for (var i = 0; i < 12; i++) {
        taxableIncomeTotal += incomeInfo.taxableIncome;
        var incomeTaxCurrentMonth = calculateIncomeTaxCurrentMonth_newdRule(taxableIncomeTotal) - incomeTaxtotal;
        incomeTaxtotal += incomeTaxCurrentMonth;
        taxTds_newRule += '<td>' + incomeTaxCurrentMonth.toFixed(2) + '</td>';

        var afterTaxIncomeTaxCurrentMonth = incomeInfo.preTaxIncome - incomeInfo.insurance - incomeTaxCurrentMonth;
        afterTaxIncomeTaxTotal += afterTaxIncomeTaxCurrentMonth;
        afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxCurrentMonth.toFixed(2) + '</td>';
    }
    taxTds_newRule += '<td>' + incomeTaxtotal.toFixed(2) + '</td>';
    afterTaxTds_newRule += '<td>' + afterTaxIncomeTaxTotal.toFixed(2) + '</td>';


    var taxTr_newRule = document.createElement('tr');
    taxTr_newRule.innerHTML = taxTds_newRule;
    var afterTaxTr_newRule = document.createElement('tr');
    afterTaxTr_newRule.innerHTML = afterTaxTds_newRule;

    var fixedIncome_tb = document.getElementById('fixedIncome_tb');
    fixedIncome_tb.appendChild(taxTr_newRule);
    fixedIncome_tb.appendChild(afterTaxTr_newRule);
}

/**
 * 月收入固定-重置
 */
function resetIncomeTax_fixed(){
    var inputEle = document.getElementById('fixedIncome').getElementsByTagName('input');
    for (var i = 0; i < inputEle.length; i++) {
        inputEle[i].value = '';
    }

    clearList(document.getElementById('fixedIncome_tb'));
}

/**
 * 清除结果列表
 * @param tbEle
 */
function clearList(tbEle) {
    var trEle = tbEle.getElementsByTagName('tr');
    for (var i = trEle.length - 1; i >= 1; i--) {
        tbEle.removeChild(trEle[i]);
    }
}