// Debug script để kiểm tra authentication
const debugAuth = () => {

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');


  if (userStr) {
    try {
      const user = JSON.parse(userStr);
  
      const isAdmin = user && user.role === 'admin';

      if (isAdmin) {
        console.log('🎉 User is admin - should access Dashboard');
      } else {
        console.log('❌ User is not admin - will be redirected');
      }
    } catch (e) {
      console.log('\n❌ Error parsing user data:', e.message);
    }
  } else {
    console.log('\n❌ No user data in localStorage');
  }

  };

// Run debug
debugAuth();

// Also expose for browser console
window.debugAuth = debugAuth;

// Export for ESM imports
export { debugAuth };
