import React from 'react';

const EmployeeManagementPage = ({
  userRole, employees, newEmployeeName, setNewEmployeeName, newEmployeeEmail, setNewEmployeeEmail,
  newEmployeeSalary, setNewEmployeeSalary, editingEmployee, setEditingEmployee,
  handleAddUpdateEmployee, handleEditEmployee, handleDeleteEmployee, setCurrentPage, isLoading
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
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">ဝန်ထမ်းစီမံခန့်ခွဲမှု</h2>

      {/* Employee Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">{editingEmployee ? 'ဝန်ထမ်းအချက်အလက် ပြင်ဆင်ရန်' : 'ဝန်ထမ်းအသစ် ထည့်သွင်းရန်'}</h3>
        <div className="mb-4">
          <label htmlFor="employeeName" className="block text-gray-700 text-base font-semibold mb-2">အမည်:</label>
          <input
            type="text"
            id="employeeName"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            value={newEmployeeName}
            onChange={(e) => setNewEmployeeName(e.target.value)}
            placeholder="ဝန်ထမ်းအမည်"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="employeeEmail" className="block text-gray-700 text-base font-semibold mb-2">အီးမေးလ်:</label>
          <input
            type="email"
            id="employeeEmail"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            value={newEmployeeEmail}
            onChange={(e) => setNewEmployeeEmail(e.target.value)}
            placeholder="ဝန်ထမ်းအီးမေးလ်"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="employeeSalary" className="block text-gray-700 text-base font-semibold mb-2">လစဉ်လစာ:</label>
          <input
            type="number"
            id="employeeSalary"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            value={newEmployeeSalary}
            onChange={(e) => setNewEmployeeSalary(e.target.value)}
            placeholder="လစဉ်လစာ (ဥပမာ: 500000)"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddUpdateEmployee}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-save mr-3"></i>}
            {editingEmployee ? 'ပြင်ဆင်မည်' : 'ထည့်သွင်းမည်'}
          </button>
          {editingEmployee && (
            <button
              onClick={() => {
                setEditingEmployee(null);
                setNewEmployeeName('');
                setNewEmployeeEmail('');
                setNewEmployeeSalary('');
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center"
              disabled={isLoading}
            >
              <i className="fas fa-times-circle mr-3"></i> ဖျက်သိမ်းမည်
            </button>
          )}
        </div>
      </div>

      {/* Employees List */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">လက်ရှိ ဝန်ထမ်းများ</h3>
      {employees.length === 0 ? (
        <p className="text-gray-600 italic text-center py-8">ဝန်ထမ်းများ မရှိသေးပါ။</p>
      ) : (
        <div className="space-y-5">
          {employees.map((employee) => (
            <div key={employee.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h4 className="text-xl font-bold text-gray-800 mb-1">{employee.name}</h4>
              <p className="text-gray-600 text-base flex items-center mb-1">
                  <i className="fas fa-envelope mr-2 text-gray-500"></i> {employee.email}
              </p>
              <p className="text-gray-600 text-base flex items-center mb-3">
                  <i className="fas fa-money-bill-wave mr-2 text-gray-500"></i> လစာ: {employee.salary?.toLocaleString()} ကျပ်
              </p>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                  disabled={isLoading}
                >
                  <i className="fas fa-edit mr-2"></i> ပြင်ဆင်မည်
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
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

export default EmployeeManagementPage;
