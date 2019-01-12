//起征点
var criticalLine = 5000;

//税率第一级别
var FirstLevel = function () {};
FirstLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.03;
}

//税率第二级别
var SecondLevel = function () {};
SecondLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.1 - 210 * weight;
}

//税率第三级别
var ThirdLevel = function () {};
ThirdLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.2 - 1410 * weight;
}

//税率第四级别
var FourthLevel = function () {};
FourthLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.25 - 2260 * weight;
}

//税率第五级别
var FifthLevel = function () {};
FifthLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.3 - 4410 * weight;
}

//税率第六级别
var SixthLevel = function () {};
SixthLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.35 - 7160 * weight;
}

//税率第七级别
var SeventhLevel = function () {};
SeventhLevel.prototype.calculate = function(taxableIncome, weight) {
    return taxableIncome * 0.45 - 15160 * weight;
}

//个税类
var IncomeTax = function () {
    this.taxableIncome = 0;//应纳税所得额
    this.weight = 1;//速算扣除权重，新政策速算扣除*12
};
IncomeTax.prototype.setTaxableIncome = function (taxableIncome) {
    this.taxableIncome = taxableIncome;
};
IncomeTax.prototype.setWeight = function(weight) {
    this.weight = weight;
}
IncomeTax.prototype.calculateIncomeTax = function (levelObj) {
    return levelObj.calculate(this.taxableIncome, this.weight);
}

/**
 *  旧政策：计算当月应纳个税<br>
 *  本月个税=应纳税所得额*税率-速算扣除数
 * @param taxableIncome 应纳税所得额（税前-五险一金-专项扣除-5000）
 * @returns {number}
 */
function calculateIncomeTaxCurrentMonth_oldRule(taxableIncome) {
    if (taxableIncome <= 0) {
        return 0;
    }

    var incomeTax = new IncomeTax();
    incomeTax.setTaxableIncome(taxableIncome);

    if (taxableIncome < 3000) {
        return incomeTax.calculateIncomeTax(new FirstLevel());
    } else if (taxableIncome >= 3000 && taxableIncome < 12000) {
        return incomeTax.calculateIncomeTax(new SecondLevel());
    } else if (taxableIncome >= 12000 && taxableIncome < 25000) {
        return incomeTax.calculateIncomeTax(new ThirdLevel());
    } else if (taxableIncome >= 25000 && taxableIncome < 35000) {
        return incomeTax.calculateIncomeTax(new FourthLevel());
    } else if (taxableIncome >= 35000 && taxableIncome < 55000) {
        return incomeTax.calculateIncomeTax(new FifthLevel());
    } else if (taxableIncome >= 55000 && taxableIncome < 80000) {
        return incomeTax.calculateIncomeTax(new SixthLevel());
    } else {
        return incomeTax.calculateIncomeTax(new SeventhLevel());
    }
}

/**
 *  新政策：计算当月应纳个税<br>
 *  本月个税=本年累计应纳税所得额*税率-速算扣除数*12-本年累计已缴纳个税
 * @param totalTaxableIncome 本年累计应纳税所得额
 * @returns {number}
 */
function calculateIncomeTaxCurrentMonth_newdRule(totalTaxableIncome) {
    if (totalTaxableIncome <= 0) {
        return 0;
    }

    var incomeTax = new IncomeTax();
    incomeTax.setWeight(12)
    incomeTax.setTaxableIncome(totalTaxableIncome);

    if (totalTaxableIncome < 36000) {
        return incomeTax.calculateIncomeTax(new FirstLevel());
    } else if (totalTaxableIncome >= 36000 && totalTaxableIncome < 144000) {
        return incomeTax.calculateIncomeTax(new SecondLevel());
    } else if (totalTaxableIncome >= 144000 && totalTaxableIncome < 300000) {
        return incomeTax.calculateIncomeTax(new ThirdLevel());
    } else if (totalTaxableIncome >= 300000 && totalTaxableIncome < 420000) {
        return incomeTax.calculateIncomeTax(new FourthLevel());
    } else if (totalTaxableIncome >= 420000 && totalTaxableIncome < 660000) {
        return incomeTax.calculateIncomeTax(new FifthLevel());
    } else if (totalTaxableIncome >= 660000 && totalTaxableIncome < 960000) {
        return incomeTax.calculateIncomeTax(new SixthLevel());
    } else {
        return incomeTax.calculateIncomeTax(new SeventhLevel());
    }
}