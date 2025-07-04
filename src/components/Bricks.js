const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!registerNumber || !password) {
        setError('Please enter both registration number and password');
        return;
    }
    setLoading(true);
    try {
        const res = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                registrationNumber: registerNumber,
                password: password
            })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }
        
        // Handle successful login
        alert('Login successful!');
        // You can redirect or update app state here
        
    } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
        setLoading(false);
    }
};