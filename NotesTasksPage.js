import React from 'react';

const NotesTasksPage = ({
  notesTasks, newNoteTaskText, setNewNoteTaskText, isNewNoteTaskATask, setIsNewNoteTaskATask,
  editingNoteTask, setEditingNoteTask, handleAddNoteTask, handleEditNoteTask, handleDeleteNoteTask,
  handleToggleTaskCompletion, userId, isLoading
}) => {
  return (
    <div className="p-4 md:p-8 bg-white rounded-xl shadow-lg h-full overflow-y-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-gray-200 pb-4">မှတ်စုနှင့် လုပ်ဆောင်စရာများ</h2>

      {/* Add Note/Task Form */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-5">{editingNoteTask ? 'မှတ်စု/လုပ်ဆောင်စရာ ပြင်ဆင်ရန်' : 'မှတ်စု/လုပ်ဆောင်စရာ အသစ် ထည့်သွင်းရန်'}</h3>
        <div className="mb-4">
          <label htmlFor="noteTaskText" className="block text-gray-700 text-base font-semibold mb-2">အကြောင်းအရာ:</label>
          <textarea
            id="noteTaskText"
            rows="4"
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            value={newNoteTaskText}
            onChange={(e) => setNewNoteTaskText(e.target.value)}
            placeholder="မှတ်စု သို့မဟုတ် လုပ်ဆောင်စရာ ရေးပါ..."
          ></textarea>
        </div>
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="isTask"
            className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded-md cursor-pointer"
            checked={isNewNoteTaskATask}
            onChange={(e) => setIsNewNoteTaskATask(e.target.checked)}
          />
          <label htmlFor="isTask" className="text-gray-700 text-base font-semibold cursor-pointer">လုပ်ဆောင်စရာလား။</label>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleAddNoteTask}
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-lg flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-plus-square mr-3"></i>}
            {editingNoteTask ? 'ပြင်ဆင်မည်' : 'ထည့်သွင်းမည်'}
          </button>
          {editingNoteTask && (
            <button
              onClick={() => {
                setEditingNoteTask(null);
                setNewNoteTaskText('');
                setIsNewNoteTaskATask(false);
              }}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center"
              disabled={isLoading}
            >
              <i className="fas fa-times-circle mr-3"></i> ဖျက်သိမ်းမည်
            </button>
          )}
        </div>
      </div>

      {/* Notes/Tasks List */}
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">လက်ရှိ မှတ်စုနှင့် လုပ်ဆောင်စရာများ</h3>
      {notesTasks.length === 0 ? (
        <p className="text-gray-600 italic text-center py-8">မှတ်စု/လုပ်ဆောင်စရာများ မရှိသေးပါ။</p>
      ) : (
        <div className="space-y-5">
          {notesTasks.map((item) => (
            <div key={item.id} className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 ${item.isTask && item.isCompleted ? 'opacity-70 line-through bg-gray-50' : ''}`}>
              <p className="text-gray-700 text-lg mb-2 whitespace-pre-wrap">{item.text}</p>
              <p className="text-gray-600 text-sm flex items-center mb-3">
                {item.isTask ? (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-3
                    ${item.isCompleted ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                    {item.isCompleted ? <><i className="fas fa-check-circle mr-1"></i> ပြီးစီးပြီ</> : <><i className="fas fa-hourglass-half mr-1"></i> လုပ်ဆောင်ဆဲ</>}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-3">
                    <i className="fas fa-lightbulb mr-1"></i> မှတ်စု
                  </span>
                )}
                <i className="fas fa-user text-gray-500 mr-2"></i>
                {item.authorId === userId ? 'သင်' : (item.authorName || `UserID: ${item.authorId}`)} မှ
                <i className="fas fa-clock text-gray-500 ml-4 mr-2"></i>
                <span className="font-mono text-xs text-gray-500">{new Date(item.timestamp?.toDate()).toLocaleString()}</span>
              </p>
              <div className="flex space-x-3 mt-4">
                {item.isTask && (
                  <button
                    onClick={() => handleToggleTaskCompletion(item)}
                    className={`px-4 py-2 text-base rounded-lg shadow-sm transition-colors duration-200 flex items-center ${item.isCompleted ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    disabled={isLoading}
                  >
                    {isLoading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                    {item.isCompleted ? <><i className="fas fa-undo mr-2"></i> မပြီးသေးပါ</> : <><i className="fas fa-check-double mr-2"></i> ပြီးစီးပြီ</>}
                  </button>
                )}
                {item.authorId === userId && (
                  <>
                    <button
                      onClick={() => handleEditNoteTask(item)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-base py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                    >
                      <i className="fas fa-edit mr-2"></i> ပြင်ဆင်မည်
                    </button>
                    <button
                      onClick={() => handleDeleteNoteTask(item.id)}
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

export default NotesTasksPage;
