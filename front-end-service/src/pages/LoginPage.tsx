import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO: Cognito 認証を実装（Issue #3）
    navigate('/announcements');
  };

  return (
    <div>
      <h1>ログイン</h1>
      <p>東深沢スポーツ・文化クラブ テニス部</p>
      <button onClick={handleLogin}>ログイン（仮）</button>
    </div>
  );
}

export default LoginPage;
