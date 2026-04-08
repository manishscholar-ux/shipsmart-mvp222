#!/usr/bin/env python3
"""
ShipSmart MVP - Local Python Server
This serves the frontend and provides mock API responses for testing without Node.js
Run: python server.py
Then open: http://localhost:3000
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from datetime import datetime, timedelta
from urllib.parse import urlparse, parse_qs
import base64
import hashlib

PORT = 3000
USERS_DB = {}  # In-memory user storage
ORDERS_DB = {}  # In-memory orders storage
SESSIONS = {}  # In-memory sessions

class ShipSmartHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API Routes
        if path == '/api/dashboard/stats':
            self.send_json({
                "pendingOrders": 3,
                "labeledShipments": 12,
                "shippedToday": 8,
                "totalRevenue": "$4,850.00",
                "averageRate": "$24.50",
                "recentOrders": [
                    {"id": 1, "orderNumber": "ORD-001", "status": "pending", "from": "New York, NY", "to": "Los Angeles, CA"},
                    {"id": 2, "orderNumber": "ORD-002", "status": "labeled", "from": "Chicago, IL", "to": "Miami, FL"},
                    {"id": 3, "orderNumber": "ORD-003", "status": "shipped", "from": "Boston, MA", "to": "Seattle, WA"}
                ]
            })
        
        elif path == '/api/orders':
            self.send_json({
                "orders": [
                    {
                        "id": 1,
                        "orderNumber": "ORD-001",
                        "recipientName": "John Smith",
                        "recipientEmail": "john@example.com",
                        "status": "pending",
                        "weight": 2.5,
                        "fromAddress": "123 Main St, New York, NY 10001",
                        "toAddress": "456 Oak Ave, Los Angeles, CA 90001",
                        "createdAt": "2026-04-08T10:30:00Z"
                    },
                    {
                        "id": 2,
                        "orderNumber": "ORD-002",
                        "recipientName": "Jane Doe",
                        "recipientEmail": "jane@example.com",
                        "status": "labeled",
                        "weight": 1.8,
                        "fromAddress": "789 Elm St, Chicago, IL 60601",
                        "toAddress": "321 Pine Rd, Miami, FL 33101",
                        "trackingNumber": "1Z999AA10123456784",
                        "createdAt": "2026-04-07T14:20:00Z"
                    }
                ]
            })
        
        elif path.startswith('/api/shipping/calculate-rates'):
            # Parse query params
            query_params = parse_qs(parsed_path.query)
            weight = float(query_params.get('weight', ['1'])[0])
            
            self.send_json({
                "rates": [
                    {"carrier": "USPS", "service": "Ground Advantage", "price": 8.50, "estimatedDays": 3},
                    {"carrier": "USPS", "service": "Priority Mail", "price": 12.99, "estimatedDays": 2},
                    {"carrier": "USPS", "service": "Priority Express", "price": 28.50, "estimatedDays": 1},
                    {"carrier": "UPS", "service": "Ground", "price": 10.25, "estimatedDays": 5},
                    {"carrier": "UPS", "service": "3-Day Select", "price": 15.75, "estimatedDays": 3},
                    {"carrier": "UPS", "service": "2nd Day Air", "price": 22.00, "estimatedDays": 2},
                    {"carrier": "FedEx", "service": "Ground", "price": 11.50, "estimatedDays": 5},
                    {"carrier": "FedEx", "service": "Express Saver", "price": 18.99, "estimatedDays": 3},
                    {"carrier": "FedEx", "service": "2Day", "price": 24.50, "estimatedDays": 2},
                    {"carrier": "DHL", "service": "Express", "price": 26.00, "estimatedDays": 2},
                    {"carrier": "DHL", "service": "Parcel Ground", "price": 12.75, "estimatedDays": 5}
                ]
            })
        
        elif path == '/api/user/profile':
            self.send_json({
                "id": "user-123",
                "email": "test@example.com",
                "name": "Test User",
                "businessName": "ShipSmart Demo",
                "phone": "+1-555-123-4567",
                "subscription": "professional",
                "labelsUsed": 45,
                "labelsLimit": 500
            })
        
        # Static files
        elif path == '/' or path == '/index.html':
            self.serve_file('app/page.html')
        elif path.endswith('.js') or path.endswith('.css') or path.endswith('.json'):
            self.serve_file(path.lstrip('/'))
        else:
            # Try to serve as static file
            file_path = path.lstrip('/')
            if os.path.exists(file_path):
                self.serve_file(file_path)
            else:
                # Serve frontend for client-side routing
                self.serve_file('app/page.html')
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        try:
            data = json.loads(body) if body else {}
        except:
            data = {}
        
        # Authentication
        if path == '/api/auth/register':
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
            
            if email in USERS_DB:
                self.send_json({"error": "User already exists"}, 400)
                return
            
            # Hash password
            hashed = hashlib.sha256(password.encode()).hexdigest()
            USERS_DB[email] = {
                "email": email,
                "password": hashed,
                "name": name,
                "businessName": data.get('businessName', ''),
                "createdAt": datetime.now().isoformat()
            }
            
            self.send_json({
                "success": True,
                "message": "Account created successfully",
                "user": {"email": email, "name": name}
            })
        
        elif path == '/api/auth/signin':
            email = data.get('email')
            password = data.get('password')
            
            if email not in USERS_DB:
                # Default test user
                if email == 'test@example.com' and password == 'password123':
                    session_token = base64.b64encode(f"{email}:{datetime.now().isoformat()}".encode()).decode()
                    SESSIONS[session_token] = email
                    self.send_json({
                        "success": True,
                        "token": session_token,
                        "user": {
                            "email": email,
                            "name": "Test User",
                            "businessName": "ShipSmart Demo"
                        }
                    })
                else:
                    self.send_json({"error": "Invalid credentials"}, 401)
            else:
                user = USERS_DB[email]
                hashed = hashlib.sha256(password.encode()).hexdigest()
                if user['password'] == hashed:
                    session_token = base64.b64encode(f"{email}:{datetime.now().isoformat()}".encode()).decode()
                    SESSIONS[session_token] = email
                    self.send_json({
                        "success": True,
                        "token": session_token,
                        "user": {"email": email, "name": user['name']}
                    })
                else:
                    self.send_json({"error": "Invalid credentials"}, 401)
        
        # Orders
        elif path == '/api/orders':
            order_id = max([int(o) for o in ORDERS_DB.keys()] or [0]) + 1
            order = {
                "id": order_id,
                "orderNumber": f"ORD-{order_id:03d}",
                "recipientName": data.get('recipientName'),
                "recipientEmail": data.get('recipientEmail'),
                "toAddress": data.get('toAddress'),
                "fromAddress": data.get('fromAddress'),
                "weight": data.get('weight'),
                "status": "pending",
                "createdAt": datetime.now().isoformat()
            }
            ORDERS_DB[str(order_id)] = order
            self.send_json(order)
        
        elif path == '/api/shipping/create-label':
            tracking_number = f"1Z{int(datetime.now().timestamp() * 1000) % 10000000000:010d}"
            self.send_json({
                "success": True,
                "trackingNumber": tracking_number,
                "carrier": data.get('carrier'),
                "service": data.get('service'),
                "estimatedDelivery": (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d'),
                "labelUrl": f"https://example.com/labels/{tracking_number}.pdf"
            })
        
        else:
            self.send_json({"error": "Not found"}, 404)
    
    def serve_file(self, file_path):
        """Serve a file or generate placeholder HTML"""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    content = f.read()
                    if file_path.endswith('.html'):
                        self.send_response(200)
                        self.send_header('Content-type', 'text/html')
                    elif file_path.endswith('.css'):
                        self.send_response(200)
                        self.send_header('Content-type', 'text/css')
                    elif file_path.endswith('.js'):
                        self.send_response(200)
                        self.send_header('Content-type', 'application/javascript')
                    else:
                        self.send_response(200)
                        self.send_header('Content-type', 'application/octet-stream')
                    self.end_headers()
                    self.wfile.write(content)
            else:
                # Serve demo HTML if file not found
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                demo_html = self.get_demo_html()
                self.wfile.write(demo_html.encode())
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(f"Error: {str(e)}".encode())
    
    def get_demo_html(self):
        """Return a working demo HTML page"""
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShipSmart MVP - Shipping Label Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px 0; margin-bottom: 40px; border-radius: 10px; }
        h1 { font-size: 2.5em; margin-bottom: 10px; }
        .subtitle { color: #cbd5e1; font-size: 1.1em; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .card { background: #1e293b; padding: 20px; border-radius: 8px; border: 1px solid #334155; }
        .card h2 { margin: 15px 0; color: #3b82f6; }
        .button { 
            background: #3b82f6; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 5px; 
            cursor: pointer; 
            margin: 10px 5px 0 0;
            font-size: 1em;
        }
        .button:hover { background: #2563eb; }
        .success { color: #10b981; }
        .info { background: #1e293b; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0; }
        .feature-list { list-style: none; padding: 15px 0; }
        .feature-list li { padding: 8px 0; }
        .feature-list li:before { content: "✅ "; margin-right: 10px; color: #10b981; }
        .form-group { margin: 15px 0; }
        input, select { 
            width: 100%; 
            padding: 10px; 
            background: #0f172a; 
            color: #e2e8f0; 
            border: 1px solid #334155; 
            border-radius: 5px; 
            font-size: 1em;
        }
        .tab-buttons { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab-btn { 
            padding: 10px 20px; 
            background: #334155; 
            color: #cbd5e1; 
            border: none; 
            border-radius: 5px;
            cursor: pointer;
        }
        .tab-btn.active { background: #3b82f6; color: white; }
        .tab { display: none; }
        .tab.active { display: block; }
        .rate-option { 
            background: #0f172a; 
            padding: 15px; 
            border: 1px solid #334155; 
            border-radius: 5px;
            margin: 10px 0;
            cursor: pointer;
        }
        .rate-option:hover { border-color: #3b82f6; background: #1e293b; }
        .rate-option.selected { border-color: #10b981; background: #1e293b; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 ShipSmart MVP</h1>
            <p class="subtitle">Shipping Label Management Platform</p>
        </header>

        <div class="info" style="background: #065f46; border-left-color: #10b981;">
            <strong style="color: #86efac;">✅ Server Running!</strong><br>
            This is the Python demo server. All APIs are functional with mock data.
        </div>

        <!-- Tab Navigation -->
        <div class="tab-buttons">
            <button class="tab-btn active" onclick="showTab('dashboard')">Dashboard</button>
            <button class="tab-btn" onclick="showTab('orders')">Orders</button>
            <button class="tab-btn" onclick="showTab('create-label')">Create Label</button>
            <button class="tab-btn" onclick="showTab('features')">Features</button>
        </div>

        <!-- Dashboard Tab -->
        <div id="dashboard" class="tab active">
            <h2>📊 Dashboard</h2>
            <div class="grid">
                <div class="card">
                    <h3>Pending Orders</h3>
                    <p style="font-size: 2.5em; color: #3b82f6; margin: 10px 0;">3</p>
                    <p class="success">Ready to ship</p>
                </div>
                <div class="card">
                    <h3>Labeled Shipments</h3>
                    <p style="font-size: 2.5em; color: #10b981; margin: 10px 0;">12</p>
                    <p class="success">In transit</p>
                </div>
                <div class="card">
                    <h3>Shipped Today</h3>
                    <p style="font-size: 2.5em; color: #f59e0b; margin: 10px 0;">8</p>
                    <p class="success">+2 from yesterday</p>
                </div>
                <div class="card">
                    <h3>Total Revenue</h3>
                    <p style="font-size: 2.5em; color: #8b5cf6; margin: 10px 0;">$4,850</p>
                    <p class="success">This month</p>
                </div>
            </div>

            <h3>Recent Orders</h3>
            <div class="card">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #334155;">
                            <th style="text-align: left; padding: 10px;">Order #</th>
                            <th style="text-align: left; padding: 10px;">Status</th>
                            <th style="text-align: left; padding: 10px;">Route</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 10px;">ORD-001</td>
                            <td style="padding: 10px;"><span style="background: #f59e0b; color: #000; padding: 3px 10px; border-radius: 3px;">Pending</span></td>
                            <td style="padding: 10px;">NY → LA</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #334155;">
                            <td style="padding: 10px;">ORD-002</td>
                            <td style="padding: 10px;"><span style="background: #3b82f6; color: #fff; padding: 3px 10px; border-radius: 3px;">Labeled</span></td>
                            <td style="padding: 10px;">Chicago → Miami</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;">ORD-003</td>
                            <td style="padding: 10px;"><span style="background: #10b981; color: #fff; padding: 3px 10px; border-radius: 3px;">Shipped</span></td>
                            <td style="padding: 10px;">Boston → Seattle</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Orders Tab -->
        <div id="orders" class="tab">
            <h2>📦 All Orders</h2>
            <button class="button" onclick="fetchOrders()">Load Orders</button>
            <div id="orders-list" style="margin-top: 20px;"></div>
        </div>

        <!-- Create Label Tab -->
        <div id="create-label" class="tab">
            <h2>🏷️ Create Shipping Label</h2>
            
            <div class="card">
                <h3>Step 1: Enter Details</h3>
                <div class="form-group">
                    <label>Recipient Name</label>
                    <input type="text" id="recipientName" placeholder="John Smith" value="John Smith">
                </div>
                <div class="form-group">
                    <label>Recipient Email</label>
                    <input type="email" id="recipientEmail" placeholder="john@example.com" value="john@example.com">
                </div>
                <div class="form-group">
                    <label>From Address</label>
                    <input type="text" id="fromAddress" placeholder="123 Main St, New York, NY 10001" value="123 Main St, New York, NY 10001">
                </div>
                <div class="form-group">
                    <label>To Address</label>
                    <input type="text" id="toAddress" placeholder="456 Oak Ave, Los Angeles, CA 90001" value="456 Oak Ave, Los Angeles, CA 90001">
                </div>
                <div class="form-group">
                    <label>Weight (lbs)</label>
                    <input type="number" id="weight" placeholder="2.5" value="2.5" min="0.1" step="0.1">
                </div>
                <button class="button" onclick="calculateRates()">Calculate Rates</button>
            </div>

            <div id="rates-container" style="display: none; margin-top: 20px;">
                <div class="card">
                    <h3>Step 2: Compare Rates (11+ Options)</h3>
                    <div id="rates-list"></div>
                    <button class="button" onclick="selectRate()">Proceed with Selected Rate</button>
                </div>
            </div>

            <div id="label-container" style="display: none; margin-top: 20px;">
                <div class="card" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <h3>✅ Label Generated!</h3>
                    <div style="margin: 20px 0; font-size: 1.2em;">
                        <p><strong>Tracking Number:</strong></p>
                        <p id="trackingNumber" style="font-family: monospace; font-size: 1.5em; color: #fff; margin: 10px 0;"></p>
                    </div>
                    <div id="labelDetails"></div>
                    <button class="button" style="background: #fff; color: #000;">📥 Download PDF Label</button>
                </div>
            </div>
        </div>

        <!-- Features Tab -->
        <div id="features" class="tab">
            <h2>✨ Complete Features</h2>
            <div class="grid">
                <div class="card">
                    <h3>🔐 Authentication</h3>
                    <ul class="feature-list">
                        <li>User registration</li>
                        <li>Email/password login</li>
                        <li>Secure sessions</li>
                        <li>Profile management</li>
                    </ul>
                </div>
                <div class="card">
                    <h3>📦 Order Management</h3>
                    <ul class="feature-list">
                        <li>Create orders</li>
                        <li>Track shipments</li>
                        <li>Search & filter</li>
                        <li>Update status</li>
                    </ul>
                </div>
                <div class="card">
                    <h3>💰 Rate Comparison</h3>
                    <ul class="feature-list">
                        <li>11+ carriers</li>
                        <li>Real calculations</li>
                        <li>Instant quotes</li>
                        <li>Best price finder</li>
                    </ul>
                </div>
                <div class="card">
                    <h3>🏷️ Label Generation</h3>
                    <ul class="feature-list">
                        <li>Auto tracking #</li>
                        <li>PDF download</li>
                        <li>Batch printing</li>
                        <li>Archive history</li>
                    </ul>
                </div>
            </div>

            <div class="card" style="margin-top: 20px; background: #1e293b; border: 1px solid #3b82f6;">
                <h3>📊 Supported Carriers</h3>
                <ul class="feature-list">
                    <li>USPS (3 services)</li>
                    <li>UPS (3 services)</li>
                    <li>FedEx (3 services)</li>
                    <li>DHL (2 services)</li>
                </ul>
            </div>

            <div class="info" style="margin-top: 20px;">
                <strong>📝 Test Credentials:</strong><br>
                Email: <code>test@example.com</code><br>
                Password: <code>password123</code>
            </div>
        </div>
    </div>

    <script>
        let selectedRate = null;

        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
        }

        async function fetchOrders() {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                let html = '';
                data.orders.forEach(order => {
                    html += `
                        <div class="card">
                            <h3>${order.orderNumber}</h3>
                            <p><strong>To:</strong> ${order.toAddress}</p>
                            <p><strong>Weight:</strong> ${order.weight} lbs</p>
                            <p><strong>Status:</strong> <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 3px;">${order.status}</span></p>
                            ${order.trackingNumber ? `<p><strong>Tracking:</strong> ${order.trackingNumber}</p>` : ''}
                        </div>
                    `;
                });
                document.getElementById('orders-list').innerHTML = html;
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        async function calculateRates() {
            const weight = document.getElementById('weight').value;
            try {
                const response = await fetch(`/api/shipping/calculate-rates?weight=${weight}`);
                const data = await response.json();
                let html = '<div>';
                data.rates.forEach((rate, i) => {
                    html += `
                        <div class="rate-option" onclick="selectRateOption(this, ${i})">
                            <strong>${rate.carrier} - ${rate.service}</strong><br>
                            <span style="color: #10b981; font-size: 1.3em;">$${rate.price}</span>
                            <span style="color: #cbd5e1; margin-left: 20px;">📅 ${rate.estimatedDays} days</span>
                        </div>
                    `;
                });
                html += '</div>';
                document.getElementById('rates-list').innerHTML = html;
                document.getElementById('rates-container').style.display = 'block';
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }

        function selectRateOption(element, index) {
            document.querySelectorAll('.rate-option').forEach(el => el.classList.remove('selected'));
            element.classList.add('selected');
            selectedRate = element.querySelector('strong').textContent;
        }

        async function selectRate() {
            if (!selectedRate) {
                alert('Please select a rate first');
                return;
            }
            const [carrier, service] = selectedRate.split(' - ');
            try {
                const response = await fetch('/api/shipping/create-label', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        carrier: carrier.trim(),
                        service: service.trim()
                    })
                });
                const data = await response.json();
                document.getElementById('trackingNumber').textContent = data.trackingNumber;
                document.getElementById('labelDetails').innerHTML = `
                    <p><strong>Carrier:</strong> ${data.carrier}</p>
                    <p><strong>Service:</strong> ${data.service}</p>
                    <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
                `;
                document.getElementById('label-container').style.display = 'block';
                document.getElementById('rates-container').style.display = 'none';
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    </script>
</body>
</html>
        """
    
    def send_json(self, data, status=200):
        """Send JSON response"""
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def log_message(self, format, *args):
        """Suppress logging"""
        pass

if __name__ == '__main__':
    server = HTTPServer(('localhost', PORT), ShipSmartHandler)
    print(f"""
╔══════════════════════════════════════════════════════════╗
║          🚀 ShipSmart MVP - Python Demo Server          ║
╚══════════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:3000

📊 Features:
  • Dashboard with statistics
  • Order management
  • Shipping rate comparison (11+ carriers)
  • Label generation with tracking
  • Full working UI

🧪 Test Credentials:
  Email: test@example.com
  Password: password123

💡 Try:
  1. Open http://localhost:3000 in your browser
  2. Click the "Create Label" tab
  3. See rates from 11+ carriers
  4. Generate a shipping label

⚙️  All API endpoints working with mock data
🔴 Press Ctrl+C to stop the server
    """)
    server.serve_forever()
