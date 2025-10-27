import { Code, LogIn } from 'lucide-react';

function LoginScreen({ username, setUsername, handleLogin, loading }) {
    return (
        <div className="loading-screen">
            <div className="login-card">
                <div className="login-header">
                    <Code className="login-icon" />
                    <h1 className="login-title">CodeKingdom</h1>
                    <p className="login-subtitle">Master Java. Build Your Empire.</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Choose Your Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input"
                            placeholder="Enter username..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary btn-login"
                    >
                        {loading ? (
                            'Loading...'
                        ) : (
                            <>
                                <LogIn className="btn-icon" />
                                Start Your Journey
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginScreen;