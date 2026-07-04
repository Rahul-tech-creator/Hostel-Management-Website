const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\thota\\.gemini\\antigravity-ide\\brain\\45f6f641-27b0-4c59-bc61-7a596bea43c3';
const destDir = 'd:\\Hostel\\public';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir);
}

const files = fs.readdirSync(srcDir);
const sidebarImg = files.find(f => f.startsWith('hostel_sidebar_art_') && f.endsWith('.png'));
const dashboardImg = files.find(f => f.startsWith('hostel_dashboard_art_') && f.endsWith('.png'));

if (sidebarImg) {
  fs.copyFileSync(path.join(srcDir, sidebarImg), path.join(destDir, 'sidebar-art.png'));
  console.log('Copied sidebar-art.png');
}

if (dashboardImg) {
  fs.copyFileSync(path.join(srcDir, dashboardImg), path.join(destDir, 'dashboard-art.png'));
  console.log('Copied dashboard-art.png');
}
