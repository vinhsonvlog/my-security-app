// Debug script để kiểm tra authentication
const debugAuth = () => {
  console.log('🔍 Debugging Authentication...\n');

  // Check localStorage
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  console.log('📦 localStorage:');
  console.log('  Token:', token ? `${token.substring(0, 20)}...` : 'null');
  console.log('  User string:', userStr);

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      console.log('\n👤 Parsed user object:');
      console.log('  ID:', user._id);
      console.log('  Username:', user.username);
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);

      // Check isAdmin logic
      const isAdmin = user && user.role === 'admin';
      console.log('\n✅ isAdmin check:', isAdmin);

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

  console.log('\n💡 Tips:');
  console.log('1. Make sure you logged in with admin account');
  console.log('2. Check that login response includes role field');
  console.log('3. Try clearing localStorage and logging in again');
};

// Run debug
debugAuth();

// Also expose for browser console
window.debugAuth = debugAuth;

// Export for ESM imports
export { debugAuth };
