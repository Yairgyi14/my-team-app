import React from 'react';

const ReportsPage = ({
  reports, newReportTitle, setNewReportTitle, newReportContent, setNewReportContent,
  editingReport, setEditingReport, handleAddReport, handleEditReport, handleDeleteReport,
  userId, isLoading
}) => {
  return (
    <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">Report စီမံခန့်ခွဲမှု</h2>

      {/* Report Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">{editingReport ? 'Report ပြင်ဆင်ရန်' : 'Report အသစ် ထည့်သွင်းရန်'}</h3>
        <div className="mb-4">
          <label htmlFor="reportTitle" className="block text-gray-700 text-base font-semibold mb-2">ခေါင်းစဉ်:</label>
          <input
            type="text"
            id="reportTitle"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={newReportTitle}
            onChange={(e) => setNewReportTitle(e.target.value)}
            placeholder="Report ခေါင်းစဉ် ထည့်ပါ..."
          />
        </div>
        <div className="mb-6">
          <label htmlFor="reportContent" className="block text-gray-700 text-base font-semibold mb-2">အကြောင်းအရာ:</label>
          <textarea
            id="reportContent"
            rows="6"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={newReportContent}
            onChange={(e) => setNewReportContent(e.target.value)}
            placeholder="Report အကြောင်းအရာ ရေးပါ..."
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddReport}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-paper-plane mr-3"></i>}
            {editingReport ? 'ပြင်ဆင်မည်' : 'တင်သွင်းမည်'}
          </button>
          {editingReport && (
            <button
              onClick={() => {
                setEditingReport(null);
                setNewReportTitle('');
                setNewReportContent('');
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
              disabled={isLoading}
            >
              <i className="fas fa-times-circle mr-3"></i> ဖျက်သိမ်းမည်
            </button>
          )}
        </div>
      </div>

      {/* Reports List */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">တင်သွင်းပြီးသော Report များ</h3>
      {reports.length === 0 ? (
        <p className="text-gray-600 italic text-center py-8">Report များ မရှိသေးပါ။</p>
      ) : (
        <div className="space-y-5">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{report.title}</h4>
              <p className="text-gray-600 text-sm mt-1 mb-3 flex items-center">
                <i className="fas fa-user text-gray-500 mr-2"></i>
                {report.authorId === userId ? 'သင်' : (report.authorName || `UserID: ${report.authorId}`)} မှ
                <i className="fas fa-clock text-gray-500 ml-4 mr-2"></i>
                <span className="font-mono text-xs text-gray-500">{new Date(report.timestamp?.toDate()).toLocaleString()}</span>
              </p>
              <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{report.content}</p>
              <div className="flex space-x-3">
                {report.authorId === userId && ( // Only allow owner to edit/delete
                  <>
                    <button
                      onClick={() => handleEditReport(report)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-edit mr-2"></i> ပြင်ဆင်မည်
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> ဖျက်ပစ်မည်
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
