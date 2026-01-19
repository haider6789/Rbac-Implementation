const http = require('http');

// Helper to make requests
function request(method, path, token, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: process.env.PORT || 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('Starting Manual Verification...');

    // 1. Register Admin
    console.log('\n--- Registering Admin ---');
    const adminReg = await request('POST', '/auth/register', null, {
        username: 'test_admin',
        password: 'password123',
        role: 'admin'
    });
    console.log('Admin Register:', adminReg.status, adminReg.body);

    // 2. Login Admin
    console.log('\n--- Logging in Admin ---');
    const adminLogin = await request('POST', '/auth/login', null, {
        username: 'test_admin',
        password: 'password123'
    });
    const adminToken = adminLogin.body.token;
    console.log('Admin Token:', adminToken ? 'Received' : 'Failed');

    if (!adminToken) return;

    // 3. Admin: Create Product (Should Succeed)
    console.log('\n--- Admin: Create Product (Expected: 201) ---');
    const createProd = await request('POST', '/products', adminToken, {
        product_name: 'Admin Product'
    });
    console.log('Create Product:', createProd.status, createProd.body);

    // 4. Admin: View Users (Should Succeed)
    console.log('\n--- Admin: View Users (Expected: 200) ---');
    const viewUsers = await request('GET', '/users', adminToken);
    console.log('View Users:', viewUsers.status, Array.isArray(viewUsers.body.users) ? 'Success (List)' : viewUsers.body);

    // 5. Register Regular User
    console.log('\n--- Registering User ---');
    const userReg = await request('POST', '/auth/register', null, {
        username: 'test_user',
        password: 'password123',
        role: 'user'
    });
    console.log('User Register:', userReg.status, userReg.body);

    // 6. Login User
    console.log('\n--- Logging in User ---');
    const userLogin = await request('POST', '/auth/login', null, {
        username: 'test_user',
        password: 'password123'
    });
    const userToken = userLogin.body.token;
    console.log('User Token:', userToken ? 'Received' : 'Failed');

    if (!userToken) return;

    // 7. User: Create Product (Should Fail - 403)
    console.log('\n--- User: Create Product (Expected: 403) ---');
    const userCreateProd = await request('POST', '/products', userToken, {
        product_name: 'User Product'
    });
    console.log('Create Product (User):', userCreateProd.status, userCreateProd.body);

    // 8. User: Delete User (Should Fail - 403)
    // First get a user ID to delete (test_user's own id or someone else)
    // We can't view users as user usually, so we'll just try random ID
    console.log('\n--- User: Delete User (Expected: 403) ---');
    const deleteReq = await request('DELETE', '/users/1', userToken);
    console.log('Delete User (User):', deleteReq.status, deleteReq.body);

}

// Wait for server? We assume server is running. 
// If not, this script fails.
runTests().catch(console.error);
