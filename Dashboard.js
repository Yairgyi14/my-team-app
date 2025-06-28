import React from 'react';

const Dashboard = ({ user, userId, userRole, reports, attendanceRecords, notesTasks, setCurrentPage }) => {
  return (
    <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">ပင်မစာမျက်နှာ</h2>
      <p className="text-gray-600 mb-8 text-lg">
        မင်္ဂလာပါ၊ <span className="font-semibold text-blue-700">{user?.displayName || 'ဧည့်သည်'}</span>!
        <span className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {userRole.toUpperCase()}
        </span>
        <br/>
        သင့်၏ User ID: <span className="font-mono text-sm break-all bg-gray-100 p-1 rounded-md">{userId}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reports Summary */}
        <div
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          onClick={() => setCurrentPage('reports')}
        >
          <i className="fas fa-file-alt text-blue-600 text-6xl mb-4 group-hover:scale-110 transition-transform"></i>
          <h3 className="text-2xl font-bold text-blue-800 mb-2">Report များ</h3>
          <p className="text-blue-700 text-xl font-semibold">{reports.length} ခု</p>
        </div>

        {/* Attendance Summary */}
        <div
          className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-md border border-green-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          onClick={() => setCurrentPage('attendance')}
        >
          <i className="fas fa-calendar-check text-green-600 text-6xl mb-4 group-hover:scale-110 transition-transform"></i>
          <h3 className="text-2xl font-bold text-green-800 mb-2">အတန်းတက်မှတ်တမ်း</h3>
          <p className="text-green-700 text-xl font-semibold">{attendanceRecords.length} ခု</p>
        </div>

        {/* Notes/Tasks Summary */}
        <div
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-md border border-purple-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          onClick={() => setCurrentPage('notes-tasks')}
        >
          <i className="fas fa-tasks text-purple-600 text-6xl mb-4 group-hover:scale-110 transition-transform"></i>
          <h3 className="text-2xl font-bold text-purple-800 mb-2">မှတ်စုနှင့် လုပ်ဆောင်စရာများ</h3>
          <p className="text-purple-700 text-xl font-semibold">{notesTasks.length} ခု</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-12 bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">အမြန်လုပ်ဆောင်ချက်များ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={() => setCurrentPage('reports')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
          >
            <i className="fas fa-plus-circle mr-3 text-2xl"></i>
            Report အသစ် ထည့်သွင်းရန်
          </button>
          <button
            onClick={() => setCurrentPage('attendance')}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
          >
            <i className="fas fa-check-circle mr-3 text-2xl"></i>
            အတန်းတက် မှတ်သားရန်
          </button>
          <button
            onClick={() => setCurrentPage('notes-tasks')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
          >
            <i className="fas fa-sticky-note mr-3 text-2xl"></i>
            မှတ်စု/လုပ်ဆောင်စရာ ထည့်သွင်းရန်
          </button>
          {userRole === 'admin' && (
              <>
                  <button
                    onClick={() => setCurrentPage('employee-management')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
                  >
                    <i className="fas fa-user-tie mr-3 text-2xl"></i>
                    ဝန်ထမ်း စီမံခန့်ခွဲရန်
                  </button>
                  <button
                    onClick={() => setCurrentPage('payroll-management')}
                    className="bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
                  >
                    <i className="fas fa-money-check-alt mr-3 text-2xl"></i>
                    လစာ တွက်ချက်ရန်
                  </button>
              </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
