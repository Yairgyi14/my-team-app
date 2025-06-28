import React from 'react';

const AuthPage = ({
  loginEmail, setLoginEmail, loginPassword, setLoginPassword, handleLogin,
  registerEmail, setRegisterEmail, registerPassword, setRegisterPassword, registerDisplayName, setRegisterDisplayName, handleRegister,
  showPasswordReset, setShowPasswordReset, resetEmail, setResetEmail, handlePasswordReset,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          <i className="fas fa-sign-in-alt text-blue-600 mr-2"></i>
          အကောင့်ဝင်ရန် / အကောင့်ဖွင့်ရန်
        </h2>

        {/* Password Reset Form */}
        {showPasswordReset && (
          <div className="mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-100 animate-fade-in-down">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">လျှို့ဝှက်နံပါတ် ပြန်လည်သတ်မှတ်ရန်</h3>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resetEmail">
                  အီးမေးလ်:
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="သင့်အီးမေးလ်ရိုက်ထည့်ပါ"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-paper-plane mr-3"></i>}
                  ပို့မည်
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg flex items-center justify-center"
                >
                  <i className="fas fa-times-circle mr-3"></i> ဖျက်သိမ်းမည်
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Login Form */}
        {!showPasswordReset && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in-down">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">အကောင့်ဝင်ရန်</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginEmail">
                  အီးမေးလ်:
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="အီးမေးလ်ရိုက်ထည့်ပါ"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="loginPassword">
                  လျှို့ဝှက်နံပါတ်:
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-2 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="လျှို့ဝှက်နံပါတ်ရိုက်ထည့်ပါ"
                  required
                />
              </div>
              <div className="text-right mb-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 transition-colors duration-200"
                >
                  လျှို့ဝှက်နံပါတ် မေ့နေပါသလား။
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg"
                disabled={isLoading}
              >
                {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-sign-in-alt mr-3"></i>}
                အကောင့်ဝင်မည်
              </button>
            </form>
          </div>
        )}

        {/* Register Form */}
        {!showPasswordReset && (
          <div className="p-6 bg-green-50 rounded-lg border border-green-100 animate-fade-in-down">
            <h3 className="text-2xl font-bold text-green-800 mb-4">အကောင့်ဖွင့်ရန်</h3>
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registerDisplayName">
                  အမည်:
                </label>
                <input
                  type="text"
                  id="registerDisplayName"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  value={registerDisplayName}
                  onChange={(e) => setRegisterDisplayName(e.target.value)}
                  placeholder="သင်၏အမည်"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registerEmail">
                  အီးမေးလ်:
                </label>
                <input
                  type="email"
                  id="registerEmail"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="အီးမေးလ်ရိုက်ထည့်ပါ"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registerPassword">
                  လျှို့ဝှက်နံပါတ်:
                </label>
                <input
                  type="password"
                  id="registerPassword"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="လျှို့ဝှက်နံပါတ်ရိုက်ထည့်ပါ (အနည်းဆုံး ၆ လုံး)"
                  minLength="6"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-lg"
                disabled={isLoading}
              >
                {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-user-plus mr-3"></i>}
                အကောင့်ဖွင့်မည်
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
