import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ReportsPage from './components/ReportsPage';
import AttendancePage from './components/AttendancePage';
import NotesTasksPage from './components/NotesTasksPage';
import EmployeeManagementPage from './components/EmployeeManagementPage';
import PayrollManagementPage from './components/PayrollManagementPage';
import ConfirmModal from './components/ConfirmModal';
import React, { useState, useEffect, useCallback } from 'react';
import 'firebase/auth';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  query,
  where,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';

// User-provided Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA469uDzC-Udx66o_RaCqIgysj-XZi8BKY",
  authDomain: "team-fbf22.firebaseapp.com",
  projectId: "team-fbf22",
  storageBucket: "team-fbf22.firebasestorage.app",
  messagingSenderId: "420664229959",
  appId: "1:420664229959:web:ff30a8d6cfd687e1b7f162",
  measurementId: "G-L75Y9VR59J"
};

// Use the projectId from the provided config as the appId for collection paths
const appIdentifier = firebaseConfig.projectId;

// Initialize Firebase app and services (lazily to ensure config is available)
let appInstance;
let dbInstance;
let authInstance;

const getFirebase = () => {
  if (!appInstance) {
    appInstance = initializeApp(firebaseConfig);
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
  }
  return { app: appInstance, db: dbInstance, auth: authInstance };
};

// Import all separated components
// These imports assume your components are in src/components/
// Please ensure that you have created the 'components' folder inside 'src'
// and placed all the respective component files (AuthPage.js, Dashboard.js, etc.) there.



// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('employee'); // Default role
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // Start at login page

  // Login/Register States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerDisplayName, setRegisterDisplayName] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // App Features States
  const [reports, setReports] = useState([]);
  const [newReportTitle, setNewReportTitle] = useState('');
  const [newReportContent, setNewReportContent] = useState('');
  const [editingReport, setEditingReport] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState('Present');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

  const [notesTasks, setNotesTasks] = useState([]);
  const [newNoteTaskText, setNewNoteTaskText] = useState('');
  const [isNewNoteTaskATask, setIsNewNoteTaskATask] = useState(false);
  const [editingNoteTask, setEditingNoteTask] = useState(null);

  // Employee Management States (Admin only)
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Payroll Management States (Admin only)
  const [payrolls, setPayrolls] = useState([]);
  const [payrollMonth, setPayrollMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedPayrollMonth, setSelectedPayrollMonth] = useState(new Date().toISOString().slice(0, 7));

  // UI/Feedback States
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to show a temporary message
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Firestore path constants
  // Using template literals (backticks `` ` ``) for these paths
  const REPORTS_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/reports`;
  const ATTENDANCE_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/attendance`;
  const NOTES_TASKS_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/tasks_notes`;
  const EMPLOYEES_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/employees`;
  const PAYROLLS_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/payrolls`;
  const USER_ROLES_COLLECTION_PATH = `artifacts/${appIdentifier}/public/data/user_roles`;

  // --- Firebase Initialization and Auth Listener ---
  useEffect(() => {
    const { auth, db } = getFirebase();

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserId(currentUser.uid);
        setCurrentPage('dashboard');

        const userRoleDocRef = doc(db, USER_ROLES_COLLECTION_PATH, currentUser.uid);
        const userRoleSnap = await getDoc(userRoleDocRef);
        if (userRoleSnap.exists()) {
          setUserRole(userRoleSnap.data().role);
        } else {
          await setDoc(userRoleDocRef, { userId: currentUser.uid, role: 'employee', timestamp: serverTimestamp() }, { merge: true });
          setUserRole('employee');
        }
        showMessage('အကောင့်ဝင်ပြီးပါပြီ။', 'success');
      } else {
        setUser(null);
        setUserId(null);
        setUserRole('employee');
        setCurrentPage('login');
        showMessage('ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ။', 'info');
      }
      setIsAuthReady(true);
      setIsLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // --- Firestore Data Fetching (Listeners) ---
  useEffect(() => {
    if (!isAuthReady || !dbInstance || !userId) return;

    const unsubscribeReports = onSnapshot(collection(dbInstance, REPORTS_COLLECTION_PATH), (snapshot) => {
      const fetchedReports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedReports.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setReports(fetchedReports);
    }, (error) => {
      console.error("Error fetching reports:", error);
      showMessage(`Report များရယူရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
    });

    const unsubscribeAttendance = onSnapshot(collection(dbInstance, ATTENDANCE_COLLECTION_PATH), (snapshot) => {
      const fetchedAttendance = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedAttendance.sort((a, b) => (b.date?.toDate() || 0) - (a.date?.toDate() || 0));
      setAttendanceRecords(fetchedAttendance);
    }, (error) => {
      console.error("Error fetching attendance:", error);
      showMessage(`အတန်းတက်မှတ်တမ်းများရယူရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
    });

    const unsubscribeNotesTasks = onSnapshot(collection(dbInstance, NOTES_TASKS_COLLECTION_PATH), (snapshot) => {
      const fetchedNotesTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedNotesTasks.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
      setNotesTasks(fetchedNotesTasks);
    }, (error) => {
      console.error("Error fetching notes/tasks:", error);
      showMessage(`မှတ်စု/လုပ်ဆောင်စရာများရယူရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
    });

    let unsubscribeEmployees;
    if (userRole === 'admin') {
      unsubscribeEmployees = onSnapshot(collection(dbInstance, EMPLOYEES_COLLECTION_PATH), (snapshot) => {
        const fetchedEmployees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        fetchedEmployees.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        setEmployees(fetchedEmployees);
      }, (error) => {
        console.error("Error fetching employees:", error);
        showMessage(`ဝန်ထမ်းများရယူရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
      });
    }

    let unsubscribePayrolls;
    if (userRole === 'admin') {
        const payrollsQuery = query(
            collection(dbInstance, PAYROLLS_COLLECTION_PATH),
            where('month', '==', selectedPayrollMonth)
        );
        unsubscribePayrolls = onSnapshot(payrollsQuery, (snapshot) => {
            const fetchedPayrolls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            fetchedPayrolls.sort((a, b) => (a.employeeName || '').localeCompare(b.employeeName || ''));
            setPayrolls(fetchedPayrolls);
        }, (error) => {
            console.error("Error fetching payrolls:", error);
            showMessage(`လစာမှတ်တမ်းများရယူရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
        });
    }

    return () => {
      unsubscribeReports();
      unsubscribeAttendance();
      unsubscribeNotesTasks();
      if (unsubscribeEmployees) unsubscribeEmployees();
      if (unsubscribePayrolls) unsubscribePayrolls();
    };
  }, [isAuthReady, userId, userRole, selectedPayrollMonth]);

  // --- Authentication Functions (Passed to AuthPage) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { auth } = getFirebase();
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      console.error("Login failed:", error);
      let errorMessage = error.message;
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "မှားယွင်းသော အီးမေးလ် သို့မဟုတ် လျှို့ဝှက်နံပါတ်။ ပြန်စစ်ပါ။";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "အီးမေးလ်/လျှို့ဝှက်နံပါတ် authentication ကို Firebase project settings တွင် ဖွင့်ပေးရန်လိုအပ်ပါသည်။";
        console.error("FIX: Go to Firebase Console -> Authentication -> Sign-in method tab, and enable 'Email/Password' provider.");
      }
      showMessage(`အကောင့်ဝင်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { auth, db } = getFirebase();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: registerDisplayName });

      await setDoc(doc(db, USER_ROLES_COLLECTION_PATH, newUser.uid), {
        userId: newUser.uid,
        role: 'employee',
        timestamp: serverTimestamp(),
      }, { merge: true });
      showMessage('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ ကျေးဇူးပြု၍ အကောင့်ဝင်ပါ။', 'success');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterDisplayName('');
      setCurrentPage('login');
    } catch (error) {
      console.error("Registration failed:", error);
      let errorMessage = error.message;
      if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "အီးမေးလ်/လျှို့ဝှက်နံပါတ် authentication ကို Firebase project settings တွင် ဖွင့်ပေးရန်လိုအပ်ပါသည်။";
        console.error("FIX: Go to Firebase Console -> Authentication -> Sign-in method tab, and enable 'Email/Password' provider.");
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = "ဤအီးမေးလ်သည် ရှိနှင့်ပြီးသားဖြစ်သည်။ အခြားအီးမေးလ်တစ်ခု သုံးပါ သို့မဟုတ် အကောင့်ဝင်ပါ။";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "လျှို့ဝှက်နံပါတ် အားနည်းနေသည်။ အနည်းဆုံး ၆ လုံး ထည့်သွင်းပါ။";
      }
      showMessage(`အကောင့်ဖွင့်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const { auth } = getFirebase();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
      showMessage(`အကောင့်ထွက်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { auth } = getFirebase();
    const emailToReset = resetEmail;

    console.log(`${emailToReset} အတွက် Password Reset တောင်းဆိုနေပါသည်...`);

    try {
      await sendPasswordResetEmail(auth, emailToReset);
      console.log("Email ပို့ခြင်း အောင်မြင်ပါသည်။ User ရဲ့ Inbox ကို စစ်ဆေးခိုင်းပါ။");
      showMessage("လျှို့ဝှက်နံပါတ် ပြန်လည်သတ်မှတ်ရန် လင့်ခ်ကို သင့်အီးမေးလ်သို့ ပို့ပေးလိုက်ပါပြီ။", 'success');
      setResetEmail('');
      setShowPasswordReset(false);
    } catch (error) {
      console.error("PASSWORD RESET ERROR:", error.code, error.message);
      let errorMessage = error.message;

      if (error.code === 'auth/user-not-found') {
        errorMessage = "ဤအီးမေးလ်ဖြင့် အကောင့်ကို ရှာမတွေ့ပါ။";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "မမှန်ကန်သော အီးမေးလ်ပုံစံ။";
      } else {
        errorMessage = `အမှားတစ်ခု ဖြစ်ပေါ်ခဲ့သည်: ${error.message}`;
      }
      showMessage(`လျှို့ဝှက်နံပါတ် ပြန်လည်သတ်မှတ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Report Management Functions ---
  const handleAddReport = async () => {
    if (!newReportTitle.trim() || !newReportContent.trim()) { showMessage('ခေါင်းစဉ်နှင့် အကြောင်းအရာ ဖြည့်သွင်းပါ။', 'warning'); return; }
    if (!userId) { showMessage('အကောင့်ဝင်ထားသူသာ Report တင်နိုင်သည်။', 'error'); return; }
    setIsLoading(true); const { db } = getFirebase(); try {
      if (editingReport) { await updateDoc(doc(db, REPORTS_COLLECTION_PATH, editingReport.id), { title: newReportTitle, content: newReportContent, timestamp: serverTimestamp(), authorId: userId, authorName: user?.displayName || 'Unknown User' }); showMessage('Report အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။', 'success'); setEditingReport(null); }
      else { await addDoc(collection(db, REPORTS_COLLECTION_PATH), { title: newReportTitle, content: newReportContent, authorId: userId, authorName: user?.displayName || 'Unknown User', timestamp: serverTimestamp() }); showMessage('Report အောင်မြင်စွာ တင်သွင်းပြီးပါပြီ။', 'success'); }
      setNewReportTitle(''); setNewReportContent(''); } catch (e) { console.error("Error adding/updating report: ", e); showMessage(`Report ထည့်သွင်း/ပြင်ဆင်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };
  const handleEditReport = (report) => { setEditingReport(report); setNewReportTitle(report.title); setNewReportContent(report.content); setCurrentPage('reports'); };
  const handleDeleteReport = (reportId) => { setConfirmMessage('ဤ Report ကို ဖျက်ပစ်ရန် သေချာပါသလား။'); setConfirmAction(() => async () => { setIsLoading(true); const { db } = getFirebase(); try { await deleteDoc(doc(db, REPORTS_COLLECTION_PATH, reportId)); showMessage('Report အောင်မြင်စွာ ဖျက်ပစ်ပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error deleting report: ", e); showMessage(`Report ဖျက်ပစ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setShowConfirmModal(false); setConfirmAction(null); setIsLoading(false); } }); setShowConfirmModal(true); };

  // --- Attendance Management Functions ---
  const handleMarkAttendance = async () => {
    if (!userId) { showMessage('အကောင့်ဝင်ထားသူသာ အတန်းတက်မှတ်တမ်းတင်နိုင်သည်။', 'error'); return; }
    setIsLoading(true); const { db } = getFirebase(); try { const attendanceRef = collection(db, ATTENDANCE_COLLECTION_PATH); const q = query(attendanceRef, where('userId', '==', userId)); const querySnapshot = await getDocs(q); let existingRecord = null; querySnapshot.forEach(docSnap => { const data = docSnap.data(); if (data.date && data.date.toDate().toISOString().split('T')[0] === attendanceDate) { existingRecord = { id: docSnap.id, ...data }; } });
      if (existingRecord) { await updateDoc(doc(db, ATTENDANCE_COLLECTION_PATH, existingRecord.id), { status: attendanceStatus, timestamp: serverTimestamp(), userName: user?.displayName || 'Unknown User' }); showMessage('အတန်းတက်မှတ်တမ်း အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။', 'success'); }
      else { await addDoc(collection(db, ATTENDANCE_COLLECTION_PATH), { userId: userId, userName: user?.displayName || 'Unknown User', date: new Date(attendanceDate), status: attendanceStatus, timestamp: serverTimestamp() }); showMessage('အတန်းတက်မှတ်တမ်း အောင်မြင်စွာ မှတ်သားပြီးပါပြီ။', 'success'); }
    } catch (e) { console.error("Error marking/updating attendance: ", e); showMessage(`အတန်းတက်မှတ်တမ်းတင်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };
  const handleEditAttendance = (record) => { setAttendanceDate(record.date.toDate().toISOString().split('T')[0]); setAttendanceStatus(record.status); setCurrentPage('attendance'); showMessage('ရက်စွဲကိုပြောင်းလဲ၍ ပြင်ဆင်ပါ။', 'info'); };
  const handleDeleteAttendance = (recordId) => { setConfirmMessage('ဤအတန်းတက်မှတ်တမ်းကို ဖျက်ပစ်ရန် သေချာပါသလား။'); setConfirmAction(() => async () => { setIsLoading(true); const { db } = getFirebase(); try { await deleteDoc(doc(db, ATTENDANCE_COLLECTION_PATH, recordId)); showMessage('အတန်းတက်မှတ်တမ်း အောင်မြင်စွာ ဖျက်ပစ်ပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error deleting attendance: ", e); showMessage(`အတန်းတက်မှတ်တမ်း ဖျက်ပစ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setShowConfirmModal(false); setConfirmAction(null); setIsLoading(false); } }); setShowConfirmModal(true); };

  // --- Notes/Tasks Management Functions ---
  const handleAddNoteTask = async () => {
    if (!newNoteTaskText.trim()) { showMessage('မှတ်စု/လုပ်ဆောင်စရာ အကြောင်းအရာ ဖြည့်သွင်းပါ။', 'warning'); return; }
    if (!userId) { showMessage('အကောင့်ဝင်ထားသူသာ မှတ်စု/လုပ်ဆောင်စရာ ထည့်သွင်းနိုင်သည်။', 'error'); return; }
    setIsLoading(true); const { db } = getFirebase(); try {
      if (editingNoteTask) { await updateDoc(doc(db, NOTES_TASKS_COLLECTION_PATH, editingNoteTask.id), { text: newNoteTaskText, isTask: isNewNoteTaskATask, timestamp: serverTimestamp(), authorId: userId, authorName: user?.displayName || 'Unknown User' }); showMessage('မှတ်စု/လုပ်ဆောင်စရာ အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။', 'success'); setEditingNoteTask(null); }
      else { await addDoc(collection(db, NOTES_TASKS_COLLECTION_PATH), { text: newNoteTaskText, authorId: userId, authorName: user?.displayName || 'Unknown User', timestamp: serverTimestamp(), isTask: isNewNoteTaskATask, isCompleted: false }); showMessage('မှတ်စု/လုပ်ဆောင်စရာ အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ။', 'success'); }
      setNewNoteTaskText(''); setIsNewNoteTaskATask(false); } catch (e) { console.error("Error adding/updating note/task: ", e); showMessage(`မှတ်စု/လုပ်ဆောင်စရာ ထည့်သွင်း/ပြင်ဆင်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };
  const handleEditNoteTask = (item) => { setEditingNoteTask(item); setNewNoteTaskText(item.text); setIsNewNoteTaskATask(item.isTask || false); setCurrentPage('notes-tasks'); };
  const handleDeleteNoteTask = (itemId) => { setConfirmMessage('ဤမှတ်စု/လုပ်ဆောင်စရာကို ဖျက်ပစ်ရန် သေချာပါသလား။'); setConfirmAction(() => async () => { setIsLoading(true); const { db } = getFirebase(); try { await deleteDoc(doc(db, NOTES_TASKS_COLLECTION_PATH, itemId)); showMessage('မှတ်စု/လုပ်ဆောင်စရာ အောင်မြင်စွာ ဖျက်ပစ်ပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error deleting note/task: ", e); showMessage(`မှတ်စု/လုပ်ဆောင်စရာ ဖျက်ပစ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setShowConfirmModal(false); setConfirmAction(null); setIsLoading(false); } }); setShowConfirmModal(true); };
  const handleToggleTaskCompletion = async (item) => {
    if (!item.isTask || !userId) return; setIsLoading(true); const { db } = getFirebase(); try { await updateDoc(doc(db, NOTES_TASKS_COLLECTION_PATH, item.id), { isCompleted: !item.isCompleted, timestamp: serverTimestamp() }); showMessage('လုပ်ဆောင်စရာ အခြေအနေ ပြောင်းလဲပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error toggling task completion: ", e); showMessage(`လုပ်ဆောင်စရာ အခြေအနေ ပြောင်းလဲရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };

  // --- Employee Management Functions ---
  const handleAddUpdateEmployee = async () => {
    if (userRole !== 'admin') { showMessage('Admin သာ ဝန်ထမ်းစီမံခန့်ခွဲနိုင်သည်။', 'error'); return; }
    if (!newEmployeeName.trim() || !newEmployeeEmail.trim() || !newEmployeeSalary) { showMessage('ဝန်ထမ်းအမည်၊ အီးမေးလ်နှင့် လစာ ဖြည့်သွင်းပါ။', 'warning'); return; }
    if (isNaN(parseFloat(newEmployeeSalary)) || parseFloat(newEmployeeSalary) <= 0) { showMessage('လစာကို မှန်ကန်သော ကိန်းဂဏန်းအဖြစ် ထည့်သွင်းပါ။', 'warning'); return; }
    setIsLoading(true); const { db } = getFirebase(); try {
      if (editingEmployee) { await updateDoc(doc(db, EMPLOYEES_COLLECTION_PATH, editingEmployee.id), { name: newEmployeeName, email: newEmployeeEmail, salary: parseFloat(newEmployeeSalary), updatedAt: serverTimestamp() }); showMessage('ဝန်ထမ်းအချက်အလက် အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ။', 'success'); setEditingEmployee(null); }
      else { await addDoc(collection(db, EMPLOYEES_COLLECTION_PATH), { name: newEmployeeName, email: newEmployeeEmail, salary: parseFloat(newEmployeeSalary), createdAt: serverTimestamp() }); showMessage('ဝန်ထမ်းအသစ် အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ။', 'success'); }
      setNewEmployeeName(''); setNewEmployeeEmail(''); setNewEmployeeSalary(''); } catch (e) { console.error("Error adding/updating employee: ", e); showMessage(`ဝန်ထမ်းထည့်သွင်း/ပြင်ဆင်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };
  const handleEditEmployee = (employee) => { setEditingEmployee(employee); setNewEmployeeName(employee.name); setNewEmployeeEmail(employee.email); setNewEmployeeSalary(employee.salary.toString()); setCurrentPage('employee-management'); };
  const handleDeleteEmployee = (employeeId) => { setConfirmMessage('ဤဝန်ထမ်းကို ဖျက်ပစ်ရန် သေချာပါသလား။'); setConfirmAction(() => async () => { setIsLoading(true); const { db } = getFirebase(); try { await deleteDoc(doc(db, EMPLOYEES_COLLECTION_PATH, employeeId)); showMessage('ဝန်ထမ်းအချက်အလက် အောင်မြင်စွာ ဖျက်ပစ်ပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error deleting employee: ", e); showMessage(`ဝန်ထမ်းဖျက်ပစ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setShowConfirmModal(false); setConfirmAction(null); setIsLoading(false); } }); setShowConfirmModal(true); };

  // --- Payroll Management Functions ---
  const handleGeneratePayroll = async () => {
    if (userRole !== 'admin') { showMessage('Admin သာ လစာတွက်ချက်နိုင်သည်။', 'error'); return; }
    if (!payrollMonth) { showMessage('လစာတွက်ချက်ရန် လကို ရွေးချယ်ပါ။', 'warning'); return; }
    setIsLoading(true); const { db } = getFirebase(); try {
      const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION_PATH)); const employeesData = employeesSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      if (employeesData.length === 0) { showMessage('လစာတွက်ချက်ရန် ဝန်ထမ်းများ မရှိသေးပါ။', 'warning'); setIsLoading(false); return; }
      const existingPayrollQuery = query(collection(db, PAYROLLS_COLLECTION_PATH), where('month', '==', payrollMonth)); const existingPayrollSnapshot = await getDocs(existingPayrollQuery);
      if (!existingPayrollSnapshot.empty) { showMessage(`${payrollMonth} အတွက် လစာမှတ်တမ်း ရှိနှင့်ပြီးသား။ အသစ်ထပ်မံ တွက်ချက်၍ မရပါ။`, 'warning'); setIsLoading(false); return; }
      for (const employee of employeesData) { const grossSalary = employee.salary || 0; const deductions = 0; const netSalary = grossSalary - deductions;
        await addDoc(collection(db, PAYROLLS_COLLECTION_PATH), { employeeId: employee.id, employeeName: employee.name, month: payrollMonth, grossSalary: grossSalary, deductions: deductions, netSalary: netSalary, generatedBy: userId, generatedByName: user?.displayName || 'Unknown Admin', generatedAt: serverTimestamp() }); }
      showMessage(`${payrollMonth} အတွက် လစာမှတ်တမ်းများ အောင်မြင်စွာ တွက်ချက်ပြီးပါပြီ။`, 'success'); } catch (e) { console.error("Error generating payroll: ", e); showMessage(`လစာတွက်ချက်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setIsLoading(false); }
  };
  const handleDeletePayroll = (payrollId) => { setConfirmMessage('ဤလစာမှတ်တမ်းကို ဖျက်ပစ်ရန် သေချာပါသလား။'); setConfirmAction(() => async () => { setIsLoading(true); const { db } = getFirebase(); try { await deleteDoc(doc(db, PAYROLLS_COLLECTION_PATH, payrollId)); showMessage('လစာမှတ်တမ်း အောင်မြင်စွာ ဖျက်ပစ်ပြီးပါပြီ။', 'success'); } catch (e) { console.error("Error deleting payroll: ", e); showMessage(`လစာမှတ်တမ်း ဖျက်ပစ်ရာတွင် အမှားအယွင်းရှိခဲ့သည်။: ${e.message}`, 'error'); } finally { setShowConfirmModal(false); setConfirmAction(null); setIsLoading(false); } }); setShowConfirmModal(true); };


  const renderPage = useCallback(() => {
    if (!isAuthReady) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 min-h-[500px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="mt-4 text-xl font-semibold">စနစ်စတင်နေသည်။ ခဏစောင့်ပါ။...</p>
        </div>
      );
    }

    if (!user) {
      // If user is not logged in, render AuthPage
      return (
        <AuthPage
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
          registerEmail={registerEmail}
          setRegisterEmail={setRegisterEmail}
          registerPassword={registerPassword}
          setRegisterPassword={setRegisterPassword}
          registerDisplayName={registerDisplayName}
          setRegisterDisplayName={setRegisterDisplayName}
          handleRegister={handleRegister}
          showPasswordReset={showPasswordReset}
          setShowPasswordReset={setShowPasswordReset}
          resetEmail={resetEmail}
          setResetEmail={setResetEmail}
          handlePasswordReset={handlePasswordReset}
          isLoading={isLoading}
        />
      );
    }

    // Render appropriate page based on currentPage state
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            userId={userId}
            userRole={userRole}
            reports={reports}
            attendanceRecords={attendanceRecords}
            notesTasks={notesTasks}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            reports={reports}
            newReportTitle={newReportTitle}
            setNewReportTitle={setNewReportTitle}
            newReportContent={newReportContent}
            setNewReportContent={setNewReportContent}
            editingReport={editingReport}
            setEditingReport={setEditingReport}
            handleAddReport={handleAddReport}
            handleEditReport={handleEditReport}
            handleDeleteReport={handleDeleteReport}
            userId={userId}
            isLoading={isLoading}
          />
        );
      case 'attendance':
        return (
          <AttendancePage
            attendanceRecords={attendanceRecords}
            attendanceStatus={attendanceStatus}
            setAttendanceStatus={setAttendanceStatus}
            attendanceDate={attendanceDate}
            setAttendanceDate={setAttendanceDate}
            handleMarkAttendance={handleMarkAttendance}
            handleEditAttendance={handleEditAttendance}
            handleDeleteAttendance={handleDeleteAttendance}
            userId={userId}
            isLoading={isLoading}
          />
        );
      case 'notes-tasks':
        return (
          <NotesTasksPage
            notesTasks={notesTasks}
            newNoteTaskText={newNoteTaskText}
            setNewNoteTaskText={setNewNoteTaskText}
            isNewNoteTaskATask={isNewNoteTaskATask}
            setIsNewNoteTaskATask={setIsNewNoteTaskATask}
            editingNoteTask={editingNoteTask}
            setEditingNoteTask={setEditingNoteTask}
            handleAddNoteTask={handleAddNoteTask}
            handleEditNoteTask={handleEditNoteTask}
            handleDeleteNoteTask={handleDeleteNoteTask}
            handleToggleTaskCompletion={handleToggleTaskCompletion}
            userId={userId}
            isLoading={isLoading}
          />
        );
      case 'employee-management':
        return (
          <EmployeeManagementPage
            userRole={userRole}
            employees={employees}
            newEmployeeName={newEmployeeName}
            setNewEmployeeName={setNewEmployeeName}
            newEmployeeEmail={newEmployeeEmail}
            setNewEmployeeEmail={setNewEmployeeEmail}
            newEmployeeSalary={newEmployeeSalary}
            setNewEmployeeSalary={setNewEmployeeSalary}
            editingEmployee={editingEmployee}
            setEditingEmployee={setEditingEmployee}
            handleAddUpdateEmployee={handleAddUpdateEmployee}
            handleEditEmployee={handleEditEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
          />
        );
      case 'payroll-management':
        return (
          <PayrollManagementPage
            userRole={userRole}
            payrolls={payrolls}
            payrollMonth={payrollMonth}
            setPayrollMonth={setPayrollMonth}
            selectedPayrollMonth={selectedPayrollMonth}
            setSelectedPayrollMonth={setSelectedPayrollMonth}
            handleGeneratePayroll={handleGeneratePayroll}
            handleDeletePayroll={handleDeletePayroll}
            setCurrentPage={setCurrentPage}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-gray-600">
            <h2 className="text-xl font-semibold">စာမျက်နှာ ရှာမတွေ့ပါ။</h2>
          </div>
        );
    }
  }, [
    isAuthReady, user, userId, userRole, currentPage, reports, attendanceRecords, notesTasks,
    newReportTitle, newReportContent, editingReport, attendanceStatus, attendanceDate,
    newNoteTaskText, isNewNoteTaskATask, editingNoteTask, employees, newEmployeeName, newEmployeeEmail,
    newEmployeeSalary, editingEmployee, payrollMonth, payrolls, selectedPayrollMonth,
    isLoading, loginEmail, loginPassword, registerEmail, registerPassword, registerDisplayName,
    showPasswordReset, resetEmail,
    handleLogin, handleRegister, handleLogout, handlePasswordReset,
    handleAddReport, handleEditReport, handleDeleteReport,
    handleMarkAttendance, handleEditAttendance, handleDeleteAttendance,
    handleAddNoteTask, handleEditNoteTask, handleDeleteNoteTask, handleToggleTaskCompletion,
    handleAddUpdateEmployee, handleEditEmployee, handleDeleteEmployee,
    handleGeneratePayroll, handleDeletePayroll
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-inter text-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      {/* Tailwind CSS CDN and Font Awesome for icons */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
          body { font-family: 'Inter', sans-serif; }
          /* Custom scrollbar for better aesthetics */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb {
            background: #a8a8a8;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #888;
          }
          /* Fade-in-down animation for messages */
          @keyframes fade-in-down {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.5s ease-out forwards;
          }
        `}
      </style>

      {/* Header and Navigation */}
      <header className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-5 mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-center border-b-4 border-blue-600 z-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0 flex items-center">
          <i className="fas fa-users-cog text-blue-600 text-4xl mr-3"></i>
          လုပ်ငန်းအဖွဲ့ စီမံခန့်ခွဲမှု
        </h1>
        {user && (
          <nav className="flex flex-wrap justify-center sm:justify-end gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              ပင်မစာမျက်နှာ
            </button>
            <button
              onClick={() => setCurrentPage('reports')}
              className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'reports' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Report များ
            </button>
            <button
              onClick={() => setCurrentPage('attendance')}
              className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'attendance' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              အတန်းတက်
            </button>
            <button
              onClick={() => setCurrentPage('notes-tasks')}
              className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'notes-tasks' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              မှတ်စု/လုပ်ဆောင်စရာများ
            </button>
            {userRole === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentPage('employee-management')}
                  className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'employee-management' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  ဝန်ထမ်းစီမံခန့်ခွဲမှု
                </button>
                <button
                  onClick={() => setCurrentPage('payroll-management')}
                  className={`px-5 py-2 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${currentPage === 'payroll-management' ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  လစာစီမံခန့်ခွဲမှု
                </button>
              </>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full font-bold text-lg bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-sign-out-alt mr-2"></i>}
              အကောင့်ထွက်မည်
            </button>
          </nav>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl flex-grow bg-white rounded-xl shadow-lg relative min-h-[60vh]">
        {/* Message Display */}
        {message.text && (
          <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white z-50 flex items-center justify-center transform transition-all duration-300 ${message.type === 'success' ? 'bg-green-600' : message.type === 'error' ? 'bg-red-600' : message.type === 'warning' ? 'bg-orange-500' : 'bg-blue-600'} animate-fade-in-down`}
            style={{ minWidth: '250px' }}>
            {message.type === 'success' && <i className="fas fa-check-circle mr-3 text-2xl"></i>}
            {message.type === 'error' && <i className="fas fa-times-circle mr-3 text-2xl"></i>}
            {message.type === 'info' && <i className="fas fa-info-circle mr-3 text-2xl"></i>}
            {message.type === 'warning' && <i className="fas fa-exclamation-triangle mr-3 text-2xl"></i>}
            <span className="font-semibold text-lg">{message.text}</span>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-40 rounded-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-xl font-semibold text-gray-700">ဒေတာများ တင်နေသည်...</p>
            </div>
          </div>
        )}

        {renderPage()}
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        show={showConfirmModal}
        message={confirmMessage}
        onConfirm={() => confirmAction && confirmAction()}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};

export default App;
