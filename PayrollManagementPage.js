import React from 'react';

const PayrollManagementPage = ({
  userRole, payrolls, payrollMonth, setPayrollMonth, selectedPayrollMonth, setSelectedPayrollMonth,
  handleGeneratePayroll, handleDeletePayroll, setCurrentPage, isLoading
}) => {
  if (userRole !== 'admin') {
      return (
          <div className="p-8 text-center text-gray-600">
              <h2 className="text-2xl font-semibold text-red-500 mb-4">
                  <i className="fas fa-exclamation-triangle mr-2"></i> ဝင်ရောက်ခွင့် မရှိပါ။
              </h2>
              <p>ဤစာမျက်နှာကို Admin များသာ ဝင်ရောက်ကြည့်ရှုနိုင်သည်။</p>
              <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
              >
                  ပင်မစာမျက်နှာသို့ ပြန်သွားရန်
              </button>
          </div>
      );
  }
  return (
      <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg h-full overflow-y-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">လစာစီမံခန့်ခွဲမှု</h2>

          {/* Generate Payroll Form */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-5">လစာ တွက်ချက်ရန်</h3>
              <div className="mb-4">
                  <label htmlFor="payrollMonth" className="block text-gray-700 text-base font-semibold mb-2">လ:</label>
                  <input
                      type="month"
                      id="payrollMonth"
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      value={payrollMonth}
                      onChange={(e) => setPayrollMonth(e.target.value)}
                      required
                  />
              </div>
              <button
                  onClick={handleGeneratePayroll}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
                  disabled={isLoading}
              >
                  {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-calculator mr-3"></i>}
                  လစာတွက်မည်
              </button>
          </div>

          {/* View Payroll by Month */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-5">လစာမှတ်တမ်း ကြည့်ရန်</h3>
              <div className="mb-4">
                  <label htmlFor="selectPayrollMonth" className="block text-gray-700 text-base font-semibold mb-2">လ ရွေးချယ်ပါ:</label>
                  <input
                      type="month"
                      id="selectPayrollMonth"
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                      value={selectedPayrollMonth}
                      onChange={(e) => setSelectedPayrollMonth(e.target.value)}
                      required
                  />
              </div>
          </div>

          {/* Payroll Records List */}
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">
              {selectedPayrollMonth} လစာမှတ်တမ်းများ
          </h3>
          {payrolls.length === 0 ? (
              <p className="text-gray-600 italic text-center py-8">ဤလအတွက် လစာမှတ်တမ်းများ မရှိသေးပါ။</p>
          ) : (
              <div className="space-y-5">
                  {payrolls.map((payroll) => (
                      <div key={payroll.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
                          <h4 className="text-xl font-bold text-gray-800 mb-1 flex items-center">
                              <i className="fas fa-user-tag mr-2 text-gray-600"></i> {payroll.employeeName}
                          </h4>
                          <p className="text-gray-600 text-base flex items-center mb-1">
                              <i className="fas fa-calendar-alt mr-2 text-gray-500"></i> လ: <span className="font-mono ml-1">{payroll.month}</span>
                          </p>
                          <p className="text-gray-600 text-base flex items-center mb-1">
                              <i className="fas fa-sack-dollar mr-2 text-gray-500"></i> စုစုပေါင်းလစာ: <span className="font-bold text-green-700 ml-1">{payroll.grossSalary?.toLocaleString()} ကျပ်</span>
                          </p>
                          <p className="text-gray-600 text-base flex items-center mb-3">
                              <i className="fas fa-money-bill-transfer mr-2 text-gray-500"></i> နုတ်ယူမှုများ: <span className="font-bold text-red-700 ml-1">{payroll.deductions?.toLocaleString()} ကျပ်</span>
                          </p>
                          <p className="text-gray-800 text-lg font-bold flex items-center mb-4 border-t border-gray-200 pt-3">
                              <i className="fas fa-hand-holding-dollar mr-2 text-blue-700"></i> အသားတင်လစာ: <span className="font-extrabold text-blue-700 ml-1">{payroll.netSalary?.toLocaleString()} ကျပ်</span>
                          </p>
                          <p className="text-gray-500 text-xs flex items-center">
                              <i className="fas fa-info-circle mr-1"></i>
                              တွက်ချက်သူ: {payroll.generatedByName || `UserID: ${payroll.generatedBy}`} မှ <span className="font-mono ml-1">{new Date(payroll.generatedAt?.toDate()).toLocaleString()}</span>
                          </p>
                          <div className="flex space-x-3 mt-4">
                              <button
                                  onClick={() => handleDeletePayroll(payroll.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                                  disabled={isLoading}
                              >
                                  <i className="fas fa-trash-alt mr-2"></i> ဖျက်ပစ်မည်
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );
};

export default PayrollManagementPage;
