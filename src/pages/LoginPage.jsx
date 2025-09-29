import Login from '../components/Login';

const LoginPage = ({ onNavigateToRegister, onLoginSuccess }) => {
  return (
    <Login 
      onNavigateToRegister={onNavigateToRegister}
      onLoginSuccess={onLoginSuccess}
    />
  );
};

export default LoginPage;