import React from 'react';

const AttendancePage = ({
  attendanceRecords, attendanceStatus, setAttendanceStatus, attendanceDate, setAttendanceDate,
  handleMarkAttendance, handleEditAttendance, handleDeleteAttendance, userId, isLoading
}) => {
  return (
    <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">အတန်းတက်မှတ်တမ်း</h2>

      {/* Mark Attendance Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">အတန်းတက် မှတ်သားရန်</h3>
        <div className="mb-4">
          <label htmlFor="attendanceDate" className="block text-gray-700 text-base font-semibold mb-2">ရက်စွဲ:</label>
          <input
            type="date"
            id="attendanceDate"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="attendanceStatus" className="block text-gray-700 text-base font-semibold mb-2">အခြေအနေ:</label>
          <select
            id="attendanceStatus"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            value={attendanceStatus}
            onChange={(e) => setAttendanceStatus(e.target.value)}
          >
            <option value="Present">ရောက်ရှိ</option>
            <option value="Absent">ပျက်ကွက်</option>
            <option value="Leave">ခွင့်ယူ</option>
          </select>
        </div>
        <button
          onClick={handleMarkAttendance}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-check-circle mr-3"></i>}
          အတန်းတက် မှတ်သားမည်
        </button>
      </div>

      {/* Attendance Records List */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">အတန်းတက်မှတ်တမ်းများ</h3>
      {attendanceRecords.length === 0 ? (
        <p className="text-gray-600 italic text-center py-8">အတန်းတက်မှတ်တမ်းများ မရှိသေးပါ။</p>
      ) : (
        <div className="space-y-5">
          {attendanceRecords.map((record) => (
            <div key={record.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <p className="text-gray-800 font-semibold text-lg flex items-center mb-2">
                <i className="fas fa-user-circle text-gray-500 mr-2"></i>
                {record.userId === userId ? 'သင်' : (record.userName || `UserID: ${record.userId}`)}
                <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium
                  ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                  record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'}`}>
                  {record.status === 'Present' ? 'ရောက်ရှိ' :
                   record.status === 'Absent' ? 'ပျက်ကွက်' :
                   'ခွင့်ယူ'}
                </span>
              </p>
              <p className="text-gray-600 text-base mt-1 flex items-center">
                <i className="fas fa-calendar-alt text-gray-500 mr-2"></i>
                ရက်စွဲ: <span className="font-mono ml-1">{new Date(record.date?.toDate()).toLocaleDateString()}</span>
              </p>
              <p className="text-gray-600 text-base flex items-center">
                <i className="fas fa-clock text-gray-500 mr-2"></i>
                မှတ်သားချိန်: <span className="font-mono text-xs ml-1">{new Date(record.timestamp?.toDate()).toLocaleTimeString()}</span>
              </p>
              {record.userId === userId && ( // Allow user to edit/delete their own attendance
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleEditAttendance(record)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                  >
                    <i className="fas fa-edit mr-2"></i> ပြင်ဆင်မည်
                  </button>
                  <button
                    onClick={() => handleDeleteAttendance(record.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                  >
                    <i className="fas fa-trash-alt mr-2"></i> ဖျက်ပစ်မည်
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
